from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, Text, ForeignKey, Float, Integer, JSON, Enum, and_, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import enum
import asyncio
import httpx
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://collab:collab@localhost:5432/collab")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class AppointmentStatusEnum(enum.Enum):
    scheduled = "scheduled"
    arriving = "arriving"
    arrived = "arrived"
    at_dock = "at_dock"
    loading = "loading"
    ready = "ready"
    departed = "departed"
    no_show = "no_show"
    cancelled = "cancelled"

class DockStatusEnum(enum.Enum):
    available = "available"
    occupied = "occupied"
    down = "down"

# Database Models
class Location(Base):
    __tablename__ = "locations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), nullable=False)
    name = Column(String(200), nullable=False)
    tz = Column(String(100), nullable=False, default="UTC")
    address = Column(String(500))
    geojson_gate = Column(Text)
    geojson_yard = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Dock(Base):
    __tablename__ = "docks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    door_no = Column(String(50), nullable=False)
    capabilities = Column(JSON)  # JSON capabilities
    status = Column(Enum(DockStatusEnum), default=DockStatusEnum.available)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    carrier_id = Column(UUID(as_uuid=True), nullable=False)
    po = Column(String(100))
    ref_no = Column(String(100))
    window_start = Column(DateTime, nullable=False)
    window_end = Column(DateTime, nullable=False)
    status = Column(Enum(AppointmentStatusEnum), default=AppointmentStatusEnum.scheduled)
    priority = Column(Integer, default=5)
    dock_id = Column(UUID(as_uuid=True), ForeignKey("docks.id"))
    created_by = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SlotRule(Base):
    __tablename__ = "slot_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    dock_group = Column(String(100))  # e.g., "loading", "unloading"
    capacity_per_slot = Column(Integer, default=1)
    slot_minutes = Column(Integer, default=60)  # Default 1 hour slots
    windows = Column(JSON)  # Time windows JSON
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class AppointmentCreate(BaseModel):
    location_id: str
    carrier_id: str
    po: Optional[str] = None
    ref_no: Optional[str] = None
    window_start: datetime
    window_end: datetime
    priority: int = 5
    dock_requirements: Optional[Dict[str, Any]] = None
    created_by: str

class AppointmentUpdate(BaseModel):
    window_start: Optional[datetime] = None
    window_end: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[int] = None
    dock_id: Optional[str] = None

class DockCreate(BaseModel):
    location_id: str
    door_no: str
    capabilities: Optional[Dict[str, Any]] = None

class DockUpdate(BaseModel):
    status: Optional[str] = None
    capabilities: Optional[Dict[str, Any]] = None

class SlotAvailabilityRequest(BaseModel):
    location_id: str
    start_date: datetime
    end_date: datetime
    duration_minutes: int = 60
    dock_requirements: Optional[Dict[str, Any]] = None

class SlotRecommendation(BaseModel):
    slot_start: datetime
    slot_end: datetime
    dock_id: Optional[str]
    dock_door_no: Optional[str]
    availability_score: float
    estimated_wait_minutes: int

# FastAPI app
app = FastAPI(
    title="Appointment & Dock Scheduling Service",
    description="Smart appointment scheduling with dock management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions
def check_dock_compatibility(dock_capabilities: Dict, requirements: Dict) -> bool:
    """Check if dock meets appointment requirements"""
    if not requirements:
        return True
    
    if not dock_capabilities:
        return False
    
    # Check equipment type compatibility
    if requirements.get("equipment_type"):
        supported_types = dock_capabilities.get("equipment_types", [])
        if requirements["equipment_type"] not in supported_types:
            return False
    
    # Check height clearance
    if requirements.get("height_feet"):
        max_height = dock_capabilities.get("max_height_feet", 0)
        if requirements["height_feet"] > max_height:
            return False
    
    # Check special requirements
    required_features = requirements.get("features", [])
    available_features = dock_capabilities.get("features", [])
    for feature in required_features:
        if feature not in available_features:
            return False
    
    return True

def calculate_availability_score(slot_start: datetime, slot_end: datetime, 
                                existing_appointments: List[Appointment]) -> float:
    """Calculate availability score for a time slot (0.0 to 1.0)"""
    score = 1.0
    
    # Check for conflicts with existing appointments
    for appt in existing_appointments:
        if (slot_start < appt.window_end and slot_end > appt.window_start):
            # Overlapping appointment - reduce score based on priority
            overlap_minutes = min(slot_end, appt.window_end) - max(slot_start, appt.window_start)
            overlap_ratio = overlap_minutes.total_seconds() / (slot_end - slot_start).total_seconds()
            priority_factor = appt.priority / 10.0  # Normalize priority (1-10 scale)
            score -= overlap_ratio * priority_factor * 0.5
    
    return max(0.0, score)

def get_available_slots(location_id: str, start_date: datetime, end_date: datetime,
                       duration_minutes: int, dock_requirements: Dict,
                       db: Session) -> List[SlotRecommendation]:
    """Find available appointment slots"""
    
    # Get location's slot rules
    slot_rules = db.query(SlotRule).filter(
        SlotRule.location_id == location_id
    ).all()
    
    # Get compatible docks
    docks = db.query(Dock).filter(
        Dock.location_id == location_id,
        Dock.status == DockStatusEnum.available
    ).all()
    
    compatible_docks = []
    for dock in docks:
        if check_dock_compatibility(dock.capabilities or {}, dock_requirements or {}):
            compatible_docks.append(dock)
    
    if not compatible_docks:
        return []
    
    # Get existing appointments in the time range
    existing_appointments = db.query(Appointment).filter(
        Appointment.location_id == location_id,
        Appointment.window_start < end_date,
        Appointment.window_end > start_date,
        Appointment.status.in_([
            AppointmentStatusEnum.scheduled,
            AppointmentStatusEnum.arriving,
            AppointmentStatusEnum.arrived,
            AppointmentStatusEnum.at_dock,
            AppointmentStatusEnum.loading
        ])
    ).all()
    
    # Generate time slots
    recommendations = []
    current_time = start_date
    slot_duration = timedelta(minutes=duration_minutes)
    
    while current_time + slot_duration <= end_date:
        slot_end = current_time + slot_duration
        
        # Check business hours (default 6 AM to 6 PM)
        if 6 <= current_time.hour < 18:
            # Find best dock for this slot
            best_dock = None
            best_score = 0
            
            for dock in compatible_docks:
                # Filter appointments for this specific dock
                dock_appointments = [
                    appt for appt in existing_appointments 
                    if appt.dock_id == dock.id
                ]
                
                score = calculate_availability_score(
                    current_time, slot_end, dock_appointments
                )
                
                if score > best_score:
                    best_score = score
                    best_dock = dock
            
            if best_dock and best_score > 0.3:  # Minimum threshold
                # Calculate estimated wait time
                wait_minutes = 0
                for appt in existing_appointments:
                    if (appt.dock_id == best_dock.id and 
                        appt.window_end <= current_time and
                        appt.status in [AppointmentStatusEnum.at_dock, AppointmentStatusEnum.loading]):
                        # Appointment might run over
                        potential_delay = (current_time - appt.window_end).total_seconds() / 60
                        wait_minutes = max(0, min(30, potential_delay))  # Max 30 min delay
                
                recommendations.append(SlotRecommendation(
                    slot_start=current_time,
                    slot_end=slot_end,
                    dock_id=str(best_dock.id),
                    dock_door_no=best_dock.door_no,
                    availability_score=best_score,
                    estimated_wait_minutes=int(wait_minutes)
                ))
        
        # Move to next slot
        current_time += timedelta(minutes=30)  # 30-minute increments
    
    # Sort by score (best first)
    recommendations.sort(key=lambda x: x.availability_score, reverse=True)
    
    return recommendations[:20]  # Return top 20 recommendations

async def auto_assign_dock(appointment_id: str, db: Session) -> Optional[str]:
    """Automatically assign the best available dock to an appointment"""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    
    if not appointment or appointment.dock_id:
        return None
    
    # Get available docks at the location
    available_docks = db.query(Dock).filter(
        Dock.location_id == appointment.location_id,
        Dock.status == DockStatusEnum.available
    ).all()
    
    if not available_docks:
        return None
    
    # Check for conflicts at appointment time
    best_dock = None
    min_conflicts = float('inf')
    
    for dock in available_docks:
        # Count conflicting appointments
        conflicts = db.query(Appointment).filter(
            Appointment.dock_id == dock.id,
            Appointment.window_start < appointment.window_end,
            Appointment.window_end > appointment.window_start,
            Appointment.status.in_([
                AppointmentStatusEnum.scheduled,
                AppointmentStatusEnum.arriving,
                AppointmentStatusEnum.arrived,
                AppointmentStatusEnum.at_dock,
                AppointmentStatusEnum.loading
            ])
        ).count()
        
        if conflicts < min_conflicts:
            min_conflicts = conflicts
            best_dock = dock
    
    if best_dock and min_conflicts == 0:  # No conflicts
        appointment.dock_id = best_dock.id
        db.commit()
        return str(best_dock.id)
    
    return None

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "appointment-service"}

@app.post("/api/appointments")
async def create_appointment(
    request: AppointmentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new appointment"""
    try:
        # Validate location exists
        location = db.query(Location).filter(Location.id == request.location_id).first()
        if not location:
            raise HTTPException(status_code=404, detail="Location not found")
        
        # Create appointment
        appointment = Appointment(
            location_id=request.location_id,
            carrier_id=request.carrier_id,
            po=request.po,
            ref_no=request.ref_no,
            window_start=request.window_start,
            window_end=request.window_end,
            priority=request.priority,
            created_by=request.created_by
        )
        
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        
        # Try to auto-assign dock
        background_tasks.add_task(auto_assign_dock, str(appointment.id), db)
        
        return {
            "message": "Appointment created successfully",
            "appointment_id": str(appointment.id),
            "appointment": {
                "id": str(appointment.id),
                "location_id": str(appointment.location_id),
                "carrier_id": str(appointment.carrier_id),
                "po": appointment.po,
                "ref_no": appointment.ref_no,
                "window_start": appointment.window_start,
                "window_end": appointment.window_end,
                "status": appointment.status.value,
                "priority": appointment.priority,
                "dock_id": str(appointment.dock_id) if appointment.dock_id else None,
                "created_at": appointment.created_at
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create appointment: {str(e)}")

@app.get("/api/appointments")
async def get_appointments(
    location_id: Optional[str] = None,
    carrier_id: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get appointments with filters"""
    query = db.query(Appointment)
    
    if location_id:
        query = query.filter(Appointment.location_id == location_id)
    
    if carrier_id:
        query = query.filter(Appointment.carrier_id == carrier_id)
    
    if status:
        query = query.filter(Appointment.status == AppointmentStatusEnum(status))
    
    if start_date:
        query = query.filter(Appointment.window_start >= start_date)
    
    if end_date:
        query = query.filter(Appointment.window_end <= end_date)
    
    appointments = query.order_by(Appointment.window_start).limit(limit).all()
    
    return [
        {
            "id": str(appt.id),
            "location_id": str(appt.location_id),
            "carrier_id": str(appt.carrier_id),
            "po": appt.po,
            "ref_no": appt.ref_no,
            "window_start": appt.window_start,
            "window_end": appt.window_end,
            "status": appt.status.value,
            "priority": appt.priority,
            "dock_id": str(appt.dock_id) if appt.dock_id else None,
            "created_at": appt.created_at
        } for appt in appointments
    ]

@app.put("/api/appointments/{appointment_id}")
async def update_appointment(
    appointment_id: str,
    request: AppointmentUpdate,
    db: Session = Depends(get_db)
):
    """Update an appointment"""
    try:
        appointment = db.query(Appointment).filter(
            Appointment.id == appointment_id
        ).first()
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Update fields
        if request.window_start:
            appointment.window_start = request.window_start
        
        if request.window_end:
            appointment.window_end = request.window_end
        
        if request.status:
            appointment.status = AppointmentStatusEnum(request.status)
        
        if request.priority is not None:
            appointment.priority = request.priority
        
        if request.dock_id:
            appointment.dock_id = request.dock_id
        
        db.commit()
        
        return {
            "message": "Appointment updated successfully",
            "appointment_id": appointment_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update appointment: {str(e)}")

@app.post("/api/slots/availability")
async def check_slot_availability(
    request: SlotAvailabilityRequest,
    db: Session = Depends(get_db)
):
    """Get available appointment slots"""
    try:
        recommendations = get_available_slots(
            request.location_id,
            request.start_date,
            request.end_date,
            request.duration_minutes,
            request.dock_requirements or {},
            db
        )
        
        return {
            "location_id": request.location_id,
            "requested_duration_minutes": request.duration_minutes,
            "available_slots": [
                {
                    "slot_start": rec.slot_start,
                    "slot_end": rec.slot_end,
                    "dock_id": rec.dock_id,
                    "dock_door_no": rec.dock_door_no,
                    "availability_score": rec.availability_score,
                    "estimated_wait_minutes": rec.estimated_wait_minutes
                } for rec in recommendations
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check availability: {str(e)}")

@app.post("/api/docks")
async def create_dock(
    request: DockCreate,
    db: Session = Depends(get_db)
):
    """Create a new dock"""
    try:
        # Check if door number already exists at location
        existing = db.query(Dock).filter(
            Dock.location_id == request.location_id,
            Dock.door_no == request.door_no
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Door number already exists at this location")
        
        dock = Dock(
            location_id=request.location_id,
            door_no=request.door_no,
            capabilities=request.capabilities
        )
        
        db.add(dock)
        db.commit()
        db.refresh(dock)
        
        return {
            "message": "Dock created successfully",
            "dock_id": str(dock.id),
            "dock": {
                "id": str(dock.id),
                "location_id": str(dock.location_id),
                "door_no": dock.door_no,
                "capabilities": dock.capabilities,
                "status": dock.status.value,
                "updated_at": dock.updated_at
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create dock: {str(e)}")

@app.get("/api/docks")
async def get_docks(
    location_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get docks with filters"""
    query = db.query(Dock)
    
    if location_id:
        query = query.filter(Dock.location_id == location_id)
    
    if status:
        query = query.filter(Dock.status == DockStatusEnum(status))
    
    docks = query.order_by(Dock.door_no).all()
    
    return [
        {
            "id": str(dock.id),
            "location_id": str(dock.location_id),
            "door_no": dock.door_no,
            "capabilities": dock.capabilities,
            "status": dock.status.value,
            "updated_at": dock.updated_at
        } for dock in docks
    ]

@app.put("/api/docks/{dock_id}")
async def update_dock(
    dock_id: str,
    request: DockUpdate,
    db: Session = Depends(get_db)
):
    """Update dock status or capabilities"""
    try:
        dock = db.query(Dock).filter(Dock.id == dock_id).first()
        
        if not dock:
            raise HTTPException(status_code=404, detail="Dock not found")
        
        if request.status:
            dock.status = DockStatusEnum(request.status)
        
        if request.capabilities is not None:
            dock.capabilities = request.capabilities
        
        dock.updated_at = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Dock updated successfully",
            "dock_id": dock_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update dock: {str(e)}")

@app.post("/api/appointments/{appointment_id}/assign-dock")
async def assign_dock_to_appointment(
    appointment_id: str,
    dock_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Assign a dock to an appointment (manual or auto)"""
    try:
        appointment = db.query(Appointment).filter(
            Appointment.id == appointment_id
        ).first()
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        if dock_id:
            # Manual assignment
            dock = db.query(Dock).filter(Dock.id == dock_id).first()
            if not dock:
                raise HTTPException(status_code=404, detail="Dock not found")
            
            appointment.dock_id = dock_id
            db.commit()
            
            return {
                "message": "Dock assigned successfully",
                "appointment_id": appointment_id,
                "dock_id": dock_id,
                "dock_door_no": dock.door_no
            }
        else:
            # Auto assignment
            assigned_dock_id = await auto_assign_dock(appointment_id, db)
            
            if assigned_dock_id:
                dock = db.query(Dock).filter(Dock.id == assigned_dock_id).first()
                return {
                    "message": "Dock auto-assigned successfully",
                    "appointment_id": appointment_id,
                    "dock_id": assigned_dock_id,
                    "dock_door_no": dock.door_no
                }
            else:
                raise HTTPException(status_code=409, detail="No suitable dock available")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to assign dock: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)
