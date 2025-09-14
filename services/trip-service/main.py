from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import math
import asyncio
import httpx
from dotenv import load_dotenv
import logging
import enum

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://collab:collab@localhost:5432/collab")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class TripStatus(str, enum.Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DELAYED = "delayed"

class TripType(str, enum.Enum):
    DELIVERY = "delivery"
    PICKUP = "pickup"
    SERVICE = "service"
    INSPECTION = "inspection"
    MAINTENANCE = "maintenance"

class CheckpointStatus(str, enum.Enum):
    PENDING = "pending"
    ARRIVED = "arrived"
    COMPLETED = "completed"
    SKIPPED = "skipped"

# Database Models
class Trip(Base):
    __tablename__ = "trips"
    
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(String, unique=True, index=True, nullable=False)
    trip_number = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    trip_type = Column(Enum(TripType), nullable=False)
    status = Column(Enum(TripStatus), default=TripStatus.PLANNED)
    
    # Driver and vehicle info
    driver_id = Column(Integer, nullable=False)
    vehicle_id = Column(String, nullable=True)
    
    # Timing
    planned_start_time = Column(DateTime, nullable=False)
    planned_end_time = Column(DateTime, nullable=True)
    actual_start_time = Column(DateTime, nullable=True)
    actual_end_time = Column(DateTime, nullable=True)
    
    # Location info
    start_location = Column(JSON, nullable=False)  # {lat, lng, address}
    end_location = Column(JSON, nullable=True)     # {lat, lng, address}
    
    # Trip metadata
    estimated_distance_km = Column(Float, nullable=True)
    estimated_duration_minutes = Column(Integer, nullable=True)
    actual_distance_km = Column(Float, nullable=True)
    actual_duration_minutes = Column(Integer, nullable=True)
    
    # Priority and notes
    priority = Column(String, default="normal")  # low, normal, high, urgent
    notes = Column(Text, nullable=True)
    
    # Audit fields
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    checkpoints = relationship("TripCheckpoint", back_populates="trip", cascade="all, delete-orphan")
    updates = relationship("TripUpdate", back_populates="trip", cascade="all, delete-orphan")

class TripCheckpoint(Base):
    __tablename__ = "trip_checkpoints"
    
    id = Column(Integer, primary_key=True, index=True)
    checkpoint_id = Column(String, unique=True, index=True, nullable=False)
    trip_id = Column(String, ForeignKey("trips.trip_id"))
    sequence_order = Column(Integer, nullable=False)
    
    # Location
    name = Column(String, nullable=False)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    geofence_radius_meters = Column(Integer, default=100)
    
    # Timing
    planned_arrival_time = Column(DateTime, nullable=True)
    planned_departure_time = Column(DateTime, nullable=True)
    actual_arrival_time = Column(DateTime, nullable=True)
    actual_departure_time = Column(DateTime, nullable=True)
    
    # Status and actions
    status = Column(Enum(CheckpointStatus), default=CheckpointStatus.PENDING)
    checkpoint_type = Column(String, default="delivery")  # delivery, pickup, service, inspection
    required_actions = Column(JSON, nullable=True)  # List of required actions
    completed_actions = Column(JSON, nullable=True)  # List of completed actions
    
    # Notes and photos
    notes = Column(Text, nullable=True)
    photos = Column(JSON, nullable=True)  # List of photo URLs
    
    # Relationships
    trip = relationship("Trip", back_populates="checkpoints")

class TripUpdate(Base):
    __tablename__ = "trip_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    update_id = Column(String, unique=True, index=True, nullable=False)
    trip_id = Column(String, ForeignKey("trips.trip_id"))
    update_type = Column(String, nullable=False)  # status_change, location, checkpoint, delay, issue
    message = Column(Text, nullable=False)
    location = Column(JSON, nullable=True)  # {lat, lng, address}
    metadata = Column(JSON, nullable=True)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trip = relationship("Trip", back_populates="updates")

class TripTemplate(Base):
    __tablename__ = "trip_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    trip_type = Column(Enum(TripType), nullable=False)
    default_duration_minutes = Column(Integer, nullable=True)
    default_checkpoints = Column(JSON, nullable=True)  # Template checkpoint data
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class TripCreate(BaseModel):
    title: str
    description: Optional[str] = None
    trip_type: TripType
    driver_id: int
    vehicle_id: Optional[str] = None
    planned_start_time: datetime
    planned_end_time: Optional[datetime] = None
    start_location: Dict[str, Any]
    end_location: Optional[Dict[str, Any]] = None
    priority: str = "normal"
    notes: Optional[str] = None
    checkpoints: List[Dict[str, Any]] = []

class TripCheckpointCreate(BaseModel):
    sequence_order: int
    name: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    geofence_radius_meters: int = 100
    planned_arrival_time: Optional[datetime] = None
    planned_departure_time: Optional[datetime] = None
    checkpoint_type: str = "delivery"
    required_actions: Optional[List[str]] = None

class TripUpdateCreate(BaseModel):
    update_type: str
    message: str
    location: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class TripStatusUpdate(BaseModel):
    status: TripStatus
    notes: Optional[str] = None

# FastAPI app
app = FastAPI(
    title="Trip Management Service",
    description="Comprehensive trip and route management system",
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
def generate_trip_id():
    return f"trip_{uuid.uuid4().hex[:12]}"

def generate_checkpoint_id():
    return f"cp_{uuid.uuid4().hex[:12]}"

def generate_update_id():
    return f"update_{uuid.uuid4().hex[:12]}"

def generate_template_id():
    return f"tpl_{uuid.uuid4().hex[:12]}"

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def calculate_estimated_duration(distance_km: float, avg_speed_kmh: float = 50) -> int:
    """Calculate estimated duration in minutes"""
    return int((distance_km / avg_speed_kmh) * 60)

async def send_trip_notification(trip_id: str, notification_type: str, message: str, 
                               recipients: List[Dict[str, Any]], metadata: Dict[str, Any] = None):
    """Send trip-related notifications"""
    try:
        logger.info(f"Sending trip notification for {trip_id}: {message}")
        # TODO: Integrate with notification service
        # This could send to chat channels, push notifications, SMS, etc.
        
        # For now, we'll send to the geofence service for location-based notifications
        if notification_type == "location_update":
            async with httpx.AsyncClient() as client:
                payload = {
                    "trip_id": trip_id,
                    "message": message,
                    "metadata": metadata or {}
                }
                # TODO: Send to appropriate notification channels
                logger.info(f"Trip notification payload: {payload}")
    
    except Exception as e:
        logger.error(f"Failed to send trip notification: {str(e)}")

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "trip-service"}

@app.post("/api/trips")
async def create_trip(
    request: TripCreate,
    created_by: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new trip"""
    try:
        trip_id = generate_trip_id()
        trip_number = f"TRP-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        # Calculate estimated distance and duration
        estimated_distance = None
        estimated_duration = None
        if request.end_location and request.start_location:
            estimated_distance = calculate_distance(
                request.start_location["latitude"],
                request.start_location["longitude"],
                request.end_location["latitude"],
                request.end_location["longitude"]
            )
            estimated_duration = calculate_estimated_duration(estimated_distance)
        
        # Create trip
        trip = Trip(
            trip_id=trip_id,
            trip_number=trip_number,
            title=request.title,
            description=request.description,
            trip_type=request.trip_type,
            driver_id=request.driver_id,
            vehicle_id=request.vehicle_id,
            planned_start_time=request.planned_start_time,
            planned_end_time=request.planned_end_time,
            start_location=request.start_location,
            end_location=request.end_location,
            estimated_distance_km=estimated_distance,
            estimated_duration_minutes=estimated_duration,
            priority=request.priority,
            notes=request.notes,
            created_by=created_by
        )
        
        db.add(trip)
        db.flush()  # Get the trip ID
        
        # Add checkpoints
        for checkpoint_data in request.checkpoints:
            checkpoint = TripCheckpoint(
                checkpoint_id=generate_checkpoint_id(),
                trip_id=trip_id,
                sequence_order=checkpoint_data["sequence_order"],
                name=checkpoint_data["name"],
                address=checkpoint_data.get("address"),
                latitude=checkpoint_data["latitude"],
                longitude=checkpoint_data["longitude"],
                geofence_radius_meters=checkpoint_data.get("geofence_radius_meters", 100),
                planned_arrival_time=checkpoint_data.get("planned_arrival_time"),
                planned_departure_time=checkpoint_data.get("planned_departure_time"),
                checkpoint_type=checkpoint_data.get("checkpoint_type", "delivery"),
                required_actions=checkpoint_data.get("required_actions")
            )
            db.add(checkpoint)
        
        # Create initial trip update
        initial_update = TripUpdate(
            update_id=generate_update_id(),
            trip_id=trip_id,
            update_type="status_change",
            message=f"Trip '{request.title}' created and assigned to driver {request.driver_id}",
            created_by=created_by
        )
        db.add(initial_update)
        
        db.commit()
        db.refresh(trip)
        
        # Send notification
        background_tasks.add_task(
            send_trip_notification,
            trip_id,
            "trip_created",
            f"New trip '{request.title}' has been created",
            [{"type": "driver", "id": request.driver_id}],
            {"trip_number": trip_number, "trip_type": request.trip_type}
        )
        
        return {
            "message": "Trip created successfully",
            "trip_id": trip_id,
            "trip_number": trip_number,
            "status": trip.status
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create trip: {str(e)}")

@app.get("/api/trips")
async def get_trips(
    driver_id: Optional[int] = None,
    status: Optional[TripStatus] = None,
    trip_type: Optional[TripType] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get trips with optional filters"""
    query = db.query(Trip)
    
    if driver_id:
        query = query.filter(Trip.driver_id == driver_id)
    
    if status:
        query = query.filter(Trip.status == status)
    
    if trip_type:
        query = query.filter(Trip.trip_type == trip_type)
    
    trips = query.order_by(Trip.created_at.desc()).limit(limit).all()
    
    return [
        {
            "trip_id": trip.trip_id,
            "trip_number": trip.trip_number,
            "title": trip.title,
            "description": trip.description,
            "trip_type": trip.trip_type,
            "status": trip.status,
            "driver_id": trip.driver_id,
            "vehicle_id": trip.vehicle_id,
            "planned_start_time": trip.planned_start_time,
            "planned_end_time": trip.planned_end_time,
            "actual_start_time": trip.actual_start_time,
            "actual_end_time": trip.actual_end_time,
            "start_location": trip.start_location,
            "end_location": trip.end_location,
            "estimated_distance_km": trip.estimated_distance_km,
            "estimated_duration_minutes": trip.estimated_duration_minutes,
            "actual_distance_km": trip.actual_distance_km,
            "actual_duration_minutes": trip.actual_duration_minutes,
            "priority": trip.priority,
            "notes": trip.notes,
            "created_at": trip.created_at
        } for trip in trips
    ]

@app.get("/api/trips/{trip_id}")
async def get_trip(trip_id: str, db: Session = Depends(get_db)):
    """Get trip details with checkpoints and updates"""
    trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    checkpoints = db.query(TripCheckpoint).filter(
        TripCheckpoint.trip_id == trip_id
    ).order_by(TripCheckpoint.sequence_order).all()
    
    updates = db.query(TripUpdate).filter(
        TripUpdate.trip_id == trip_id
    ).order_by(TripUpdate.created_at.desc()).limit(20).all()
    
    return {
        "trip": {
            "trip_id": trip.trip_id,
            "trip_number": trip.trip_number,
            "title": trip.title,
            "description": trip.description,
            "trip_type": trip.trip_type,
            "status": trip.status,
            "driver_id": trip.driver_id,
            "vehicle_id": trip.vehicle_id,
            "planned_start_time": trip.planned_start_time,
            "planned_end_time": trip.planned_end_time,
            "actual_start_time": trip.actual_start_time,
            "actual_end_time": trip.actual_end_time,
            "start_location": trip.start_location,
            "end_location": trip.end_location,
            "estimated_distance_km": trip.estimated_distance_km,
            "estimated_duration_minutes": trip.estimated_duration_minutes,
            "actual_distance_km": trip.actual_distance_km,
            "actual_duration_minutes": trip.actual_duration_minutes,
            "priority": trip.priority,
            "notes": trip.notes,
            "created_at": trip.created_at
        },
        "checkpoints": [
            {
                "checkpoint_id": cp.checkpoint_id,
                "sequence_order": cp.sequence_order,
                "name": cp.name,
                "address": cp.address,
                "latitude": cp.latitude,
                "longitude": cp.longitude,
                "geofence_radius_meters": cp.geofence_radius_meters,
                "planned_arrival_time": cp.planned_arrival_time,
                "planned_departure_time": cp.planned_departure_time,
                "actual_arrival_time": cp.actual_arrival_time,
                "actual_departure_time": cp.actual_departure_time,
                "status": cp.status,
                "checkpoint_type": cp.checkpoint_type,
                "required_actions": cp.required_actions,
                "completed_actions": cp.completed_actions,
                "notes": cp.notes,
                "photos": cp.photos
            } for cp in checkpoints
        ],
        "updates": [
            {
                "update_id": u.update_id,
                "update_type": u.update_type,
                "message": u.message,
                "location": u.location,
                "metadata": u.metadata,
                "created_by": u.created_by,
                "created_at": u.created_at
            } for u in updates
        ]
    }

@app.put("/api/trips/{trip_id}/status")
async def update_trip_status(
    trip_id: str,
    request: TripStatusUpdate,
    updated_by: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Update trip status"""
    try:
        trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        old_status = trip.status
        trip.status = request.status
        
        # Update timing based on status
        now = datetime.utcnow()
        if request.status == TripStatus.IN_PROGRESS and not trip.actual_start_time:
            trip.actual_start_time = now
        elif request.status == TripStatus.COMPLETED and not trip.actual_end_time:
            trip.actual_end_time = now
            # Calculate actual duration
            if trip.actual_start_time:
                duration = now - trip.actual_start_time
                trip.actual_duration_minutes = int(duration.total_seconds() / 60)
        
        # Create status update record
        update = TripUpdate(
            update_id=generate_update_id(),
            trip_id=trip_id,
            update_type="status_change",
            message=f"Trip status changed from {old_status} to {request.status}",
            metadata={"old_status": old_status, "new_status": request.status, "notes": request.notes},
            created_by=updated_by
        )
        db.add(update)
        
        db.commit()
        
        # Send notification
        background_tasks.add_task(
            send_trip_notification,
            trip_id,
            "status_change",
            f"Trip '{trip.title}' status changed to {request.status}",
            [{"type": "driver", "id": trip.driver_id}],
            {"old_status": old_status, "new_status": request.status}
        )
        
        return {
            "message": "Trip status updated successfully",
            "trip_id": trip_id,
            "old_status": old_status,
            "new_status": request.status
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update trip status: {str(e)}")

@app.post("/api/trips/{trip_id}/checkpoints/{checkpoint_id}/arrive")
async def arrive_at_checkpoint(
    trip_id: str,
    checkpoint_id: str,
    latitude: float,
    longitude: float,
    accuracy_meters: Optional[float] = None,
    notes: Optional[str] = None,
    updated_by: int = None,
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """Mark arrival at a checkpoint"""
    try:
        checkpoint = db.query(TripCheckpoint).filter(
            TripCheckpoint.checkpoint_id == checkpoint_id,
            TripCheckpoint.trip_id == trip_id
        ).first()
        
        if not checkpoint:
            raise HTTPException(status_code=404, detail="Checkpoint not found")
        
        # Update checkpoint
        checkpoint.status = CheckpointStatus.ARRIVED
        checkpoint.actual_arrival_time = datetime.utcnow()
        if notes:
            checkpoint.notes = notes
        
        # Create update record
        update = TripUpdate(
            update_id=generate_update_id(),
            trip_id=trip_id,
            update_type="checkpoint",
            message=f"Arrived at checkpoint: {checkpoint.name}",
            location={"latitude": latitude, "longitude": longitude},
            metadata={"checkpoint_id": checkpoint_id, "accuracy_meters": accuracy_meters},
            created_by=updated_by or checkpoint.trip.driver_id
        )
        db.add(update)
        
        db.commit()
        
        # Send notification
        background_tasks.add_task(
            send_trip_notification,
            trip_id,
            "checkpoint_arrival",
            f"Driver arrived at {checkpoint.name}",
            [{"type": "dispatcher", "id": "all"}],
            {"checkpoint_id": checkpoint_id, "checkpoint_name": checkpoint.name}
        )
        
        return {
            "message": "Checkpoint arrival recorded",
            "checkpoint_id": checkpoint_id,
            "checkpoint_name": checkpoint.name,
            "arrival_time": checkpoint.actual_arrival_time
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record checkpoint arrival: {str(e)}")

@app.post("/api/trips/{trip_id}/updates")
async def add_trip_update(
    trip_id: str,
    request: TripUpdateCreate,
    created_by: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Add an update to a trip"""
    try:
        trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        update = TripUpdate(
            update_id=generate_update_id(),
            trip_id=trip_id,
            update_type=request.update_type,
            message=request.message,
            location=request.location,
            metadata=request.metadata,
            created_by=created_by
        )
        
        db.add(update)
        db.commit()
        
        # Send notification for important updates
        if request.update_type in ["delay", "issue", "emergency"]:
            background_tasks.add_task(
                send_trip_notification,
                trip_id,
                request.update_type,
                request.message,
                [{"type": "dispatcher", "id": "all"}],
                request.metadata
            )
        
        return {
            "message": "Trip update added successfully",
            "update_id": update.update_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add trip update: {str(e)}")

@app.get("/api/trips/{trip_id}/route")
async def get_trip_route(trip_id: str, db: Session = Depends(get_db)):
    """Get optimized route for a trip"""
    try:
        trip = db.query(Trip).filter(Trip.trip_id == trip_id).first()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        
        checkpoints = db.query(TripCheckpoint).filter(
            TripCheckpoint.trip_id == trip_id
        ).order_by(TripCheckpoint.sequence_order).all()
        
        # Build route waypoints
        waypoints = []
        
        # Start location
        waypoints.append({
            "type": "start",
            "name": "Start Location",
            "latitude": trip.start_location["latitude"],
            "longitude": trip.start_location["longitude"],
            "address": trip.start_location.get("address")
        })
        
        # Checkpoints
        for cp in checkpoints:
            waypoints.append({
                "type": "checkpoint",
                "checkpoint_id": cp.checkpoint_id,
                "name": cp.name,
                "latitude": cp.latitude,
                "longitude": cp.longitude,
                "address": cp.address,
                "status": cp.status,
                "sequence_order": cp.sequence_order
            })
        
        # End location
        if trip.end_location:
            waypoints.append({
                "type": "end",
                "name": "End Location",
                "latitude": trip.end_location["latitude"],
                "longitude": trip.end_location["longitude"],
                "address": trip.end_location.get("address")
            })
        
        return {
            "trip_id": trip_id,
            "trip_number": trip.trip_number,
            "waypoints": waypoints,
            "total_distance_km": trip.estimated_distance_km,
            "estimated_duration_minutes": trip.estimated_duration_minutes
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trip route: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)


