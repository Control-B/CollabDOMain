from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, Text, ForeignKey, Float, Integer, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import math
import asyncio
import httpx
import enum
from dotenv import load_dotenv
import logging
import statistics

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://collab:collab@localhost:5432/collab")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class EtaSourceEnum(enum.Enum):
    device = "device"
    manual = "manual"

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

# Database Models (matching C# models)
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
    dock_id = Column(UUID(as_uuid=True))
    created_by = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class EtaUpdate(Base):
    __tablename__ = "eta_updates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    source = Column(Enum(EtaSourceEnum), default=EtaSourceEnum.manual)
    eta = Column(DateTime, nullable=False)
    confidence = Column(Float, default=0.5)
    dwell_pred_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class TrafficData(Base):
    __tablename__ = "traffic_data"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    hour_of_day = Column(Integer, nullable=False)  # 0-23
    day_of_week = Column(Integer, nullable=False)  # 0-6 (Monday=0)
    avg_delay_minutes = Column(Float, default=0)
    sample_count = Column(Integer, default=1)
    last_updated = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class EtaUpdateRequest(BaseModel):
    appointment_id: str
    eta: datetime
    source: str = "manual"
    confidence: Optional[float] = 0.5
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    speed_mph: Optional[float] = None

class LocationPing(BaseModel):
    appointment_id: str
    latitude: float
    longitude: float
    timestamp: datetime
    speed_mph: Optional[float] = None
    accuracy_meters: Optional[float] = None

class EtaResponse(BaseModel):
    appointment_id: str
    current_eta: datetime
    confidence: float
    dwell_prediction_minutes: Optional[int]
    distance_remaining_miles: Optional[float]
    estimated_delay_minutes: Optional[int]
    traffic_factor: Optional[float]
    last_updated: datetime

# FastAPI app
app = FastAPI(
    title="ETA Prediction Service",
    description="Advanced ETA prediction with traffic factors and dwell time",
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
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula (returns miles)"""
    R = 3959  # Earth's radius in miles
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def get_location_coordinates(location_id: str, db: Session) -> tuple[float, float]:
    """Extract coordinates from location's geojson_gate or address"""
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        return None, None
    
    # Try to parse gate coordinates from GeoJSON
    if location.geojson_gate:
        try:
            geojson = json.loads(location.geojson_gate)
            if geojson.get("type") == "Point":
                coords = geojson.get("coordinates", [])
                if len(coords) >= 2:
                    return coords[1], coords[0]  # lat, lon
        except:
            pass
    
    # Fallback: use hardcoded coordinates (in real app, geocode the address)
    # For demo purposes, return Tampa, FL coordinates
    return 27.9506, -82.4572

def get_traffic_factor(location_id: str, eta_time: datetime, db: Session) -> float:
    """Get traffic delay factor based on historical data"""
    hour = eta_time.hour
    day_of_week = eta_time.weekday()
    
    traffic_data = db.query(TrafficData).filter(
        TrafficData.location_id == location_id,
        TrafficData.hour_of_day == hour,
        TrafficData.day_of_week == day_of_week
    ).first()
    
    if traffic_data:
        # Return traffic factor (1.0 = no delay, 1.5 = 50% longer)
        base_delay = traffic_data.avg_delay_minutes
        return 1.0 + (base_delay / 60.0)  # Convert minutes to hours
    
    # Default traffic patterns
    if day_of_week < 5:  # Weekday
        if 7 <= hour <= 9 or 16 <= hour <= 18:  # Rush hours
            return 1.3
        elif 10 <= hour <= 15:  # Midday
            return 1.1
    else:  # Weekend
        if 10 <= hour <= 16:  # Weekend busy hours
            return 1.2
    
    return 1.0  # No delay

def predict_dwell_time(location_id: str, appointment_time: datetime, db: Session) -> int:
    """Predict dwell time based on historical data"""
    hour = appointment_time.hour
    day_of_week = appointment_time.weekday()
    
    # Simple prediction based on time of day
    if day_of_week < 5:  # Weekday
        if 6 <= hour <= 8 or 16 <= hour <= 18:  # Busy hours
            return 90  # 1.5 hours
        elif 9 <= hour <= 15:  # Normal hours
            return 60  # 1 hour
    else:  # Weekend
        return 45  # 45 minutes
    
    return 30  # Default 30 minutes

def calculate_eta_with_factors(current_lat: float, current_lon: float, 
                              dest_lat: float, dest_lon: float,
                              speed_mph: float, traffic_factor: float) -> datetime:
    """Calculate ETA considering distance, speed, and traffic"""
    distance_miles = calculate_distance(current_lat, current_lon, dest_lat, dest_lon)
    
    if speed_mph <= 0:
        speed_mph = 50  # Default highway speed
    
    # Calculate base travel time
    travel_time_hours = distance_miles / speed_mph
    
    # Apply traffic factor
    adjusted_time_hours = travel_time_hours * traffic_factor
    
    # Add current time
    eta = datetime.utcnow() + timedelta(hours=adjusted_time_hours)
    
    return eta, distance_miles

def is_significant_eta_change(old_eta: datetime, new_eta: datetime, threshold_minutes: int = 10) -> bool:
    """Check if ETA change is significant enough to trigger update"""
    delta = abs((new_eta - old_eta).total_seconds() / 60)
    return delta >= threshold_minutes

async def send_eta_notification(appointment_id: str, eta_change_minutes: int, new_eta: datetime):
    """Send notification for significant ETA changes"""
    try:
        # TODO: Integrate with notification service
        logger.info(f"ETA Change Alert - Appointment {appointment_id}: {eta_change_minutes} min change, new ETA: {new_eta}")
        
        # Webhook to main DMS service
        async with httpx.AsyncClient() as client:
            payload = {
                "event_type": "eta_update",
                "appointment_id": appointment_id,
                "eta_change_minutes": eta_change_minutes,
                "new_eta": new_eta.isoformat(),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Send to DMS core service
            dms_url = os.getenv("DMS_CORE_URL", "http://localhost:5000")
            try:
                await client.post(f"{dms_url}/events/inbound", json=payload)
            except:
                logger.warning("Failed to notify DMS core service")
    
    except Exception as e:
        logger.error(f"Failed to send ETA notification: {str(e)}")

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "eta-service"}

@app.post("/api/eta/update")
async def update_eta(
    request: EtaUpdateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Update ETA for an appointment"""
    try:
        # Validate appointment exists
        appointment = db.query(Appointment).filter(
            Appointment.id == request.appointment_id
        ).first()
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Get last ETA for comparison
        last_eta = db.query(EtaUpdate).filter(
            EtaUpdate.appointment_id == request.appointment_id
        ).order_by(EtaUpdate.created_at.desc()).first()
        
        # Calculate enhanced ETA if location data provided
        enhanced_eta = request.eta
        distance_remaining = None
        traffic_factor = 1.0
        dwell_prediction = None
        
        if request.current_latitude and request.current_longitude:
            # Get destination coordinates
            dest_lat, dest_lon = get_location_coordinates(appointment.location_id, db)
            
            if dest_lat and dest_lon:
                # Calculate traffic factor
                traffic_factor = get_traffic_factor(
                    appointment.location_id, 
                    request.eta, 
                    db
                )
                
                # Calculate enhanced ETA
                enhanced_eta, distance_remaining = calculate_eta_with_factors(
                    request.current_latitude,
                    request.current_longitude,
                    dest_lat,
                    dest_lon,
                    request.speed_mph or 50,
                    traffic_factor
                )
                
                # Predict dwell time
                dwell_prediction = predict_dwell_time(
                    appointment.location_id,
                    enhanced_eta,
                    db
                )
        
        # Create ETA update record
        eta_update = EtaUpdate(
            appointment_id=request.appointment_id,
            source=EtaSourceEnum(request.source),
            eta=enhanced_eta,
            confidence=request.confidence,
            dwell_pred_minutes=dwell_prediction
        )
        
        db.add(eta_update)
        db.commit()
        db.refresh(eta_update)
        
        # Check for significant change and send notification
        if last_eta and is_significant_eta_change(last_eta.eta, enhanced_eta):
            eta_change_minutes = int((enhanced_eta - last_eta.eta).total_seconds() / 60)
            background_tasks.add_task(
                send_eta_notification,
                request.appointment_id,
                eta_change_minutes,
                enhanced_eta
            )
        
        return {
            "message": "ETA updated successfully",
            "eta_id": str(eta_update.id),
            "appointment_id": request.appointment_id,
            "eta": enhanced_eta,
            "confidence": request.confidence,
            "dwell_prediction_minutes": dwell_prediction,
            "distance_remaining_miles": distance_remaining,
            "traffic_factor": traffic_factor
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update ETA: {str(e)}")

@app.post("/api/eta/ping")
async def process_location_ping(
    request: LocationPing,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Process location ping and auto-update ETA"""
    try:
        # Get appointment
        appointment = db.query(Appointment).filter(
            Appointment.id == request.appointment_id
        ).first()
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Get destination coordinates
        dest_lat, dest_lon = get_location_coordinates(appointment.location_id, db)
        
        if not dest_lat or not dest_lon:
            raise HTTPException(status_code=400, detail="Unable to determine destination coordinates")
        
        # Calculate new ETA
        traffic_factor = get_traffic_factor(appointment.location_id, datetime.utcnow(), db)
        
        new_eta, distance_remaining = calculate_eta_with_factors(
            request.latitude,
            request.longitude,
            dest_lat,
            dest_lon,
            request.speed_mph or 50,
            traffic_factor
        )
        
        # Calculate confidence based on GPS accuracy and speed consistency
        confidence = 0.8  # Base confidence
        if request.accuracy_meters and request.accuracy_meters < 10:
            confidence += 0.1
        if request.speed_mph and request.speed_mph > 5:  # Moving vehicle
            confidence += 0.1
        
        confidence = min(confidence, 1.0)
        
        # Get last ETA
        last_eta = db.query(EtaUpdate).filter(
            EtaUpdate.appointment_id == request.appointment_id
        ).order_by(EtaUpdate.created_at.desc()).first()
        
        # Only update if significant change (hysteresis)
        if not last_eta or is_significant_eta_change(last_eta.eta, new_eta, threshold_minutes=5):
            # Create new ETA update
            dwell_prediction = predict_dwell_time(appointment.location_id, new_eta, db)
            
            eta_update = EtaUpdate(
                appointment_id=request.appointment_id,
                source=EtaSourceEnum.device,
                eta=new_eta,
                confidence=confidence,
                dwell_pred_minutes=dwell_prediction
            )
            
            db.add(eta_update)
            db.commit()
            
            # Send notification for significant changes
            if last_eta:
                eta_change_minutes = int((new_eta - last_eta.eta).total_seconds() / 60)
                if abs(eta_change_minutes) >= 10:  # 10+ minute change
                    background_tasks.add_task(
                        send_eta_notification,
                        request.appointment_id,
                        eta_change_minutes,
                        new_eta
                    )
        
        return {
            "message": "Location ping processed",
            "appointment_id": request.appointment_id,
            "current_eta": new_eta,
            "confidence": confidence,
            "distance_remaining_miles": distance_remaining,
            "traffic_factor": traffic_factor
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process location ping: {str(e)}")

@app.get("/api/eta/{appointment_id}")
async def get_current_eta(
    appointment_id: str,
    db: Session = Depends(get_db)
) -> EtaResponse:
    """Get current ETA for an appointment"""
    try:
        # Get latest ETA
        eta_update = db.query(EtaUpdate).filter(
            EtaUpdate.appointment_id == appointment_id
        ).order_by(EtaUpdate.created_at.desc()).first()
        
        if not eta_update:
            raise HTTPException(status_code=404, detail="No ETA found for appointment")
        
        # Calculate delay from original appointment window
        appointment = db.query(Appointment).filter(
            Appointment.id == appointment_id
        ).first()
        
        estimated_delay_minutes = None
        if appointment:
            delay_delta = eta_update.eta - appointment.window_start
            estimated_delay_minutes = int(delay_delta.total_seconds() / 60)
        
        return EtaResponse(
            appointment_id=appointment_id,
            current_eta=eta_update.eta,
            confidence=eta_update.confidence,
            dwell_prediction_minutes=eta_update.dwell_pred_minutes,
            distance_remaining_miles=None,  # Would need current location
            estimated_delay_minutes=estimated_delay_minutes,
            traffic_factor=None,  # Would need recalculation
            last_updated=eta_update.created_at
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get ETA: {str(e)}")

@app.get("/api/eta/location/{location_id}/traffic")
async def get_traffic_patterns(
    location_id: str,
    db: Session = Depends(get_db)
):
    """Get traffic patterns for a location"""
    try:
        traffic_data = db.query(TrafficData).filter(
            TrafficData.location_id == location_id
        ).all()
        
        patterns = {}
        for data in traffic_data:
            day_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][data.day_of_week]
            if day_name not in patterns:
                patterns[day_name] = {}
            
            patterns[day_name][f"{data.hour_of_day:02d}:00"] = {
                "avg_delay_minutes": data.avg_delay_minutes,
                "sample_count": data.sample_count,
                "last_updated": data.last_updated
            }
        
        return {
            "location_id": location_id,
            "traffic_patterns": patterns
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get traffic patterns: {str(e)}")

@app.post("/api/eta/traffic/update")
async def update_traffic_data(
    location_id: str,
    hour: int,
    day_of_week: int,
    delay_minutes: float,
    db: Session = Depends(get_db)
):
    """Update traffic data (called by actual arrival times)"""
    try:
        # Find existing or create new traffic data
        traffic_data = db.query(TrafficData).filter(
            TrafficData.location_id == location_id,
            TrafficData.hour_of_day == hour,
            TrafficData.day_of_week == day_of_week
        ).first()
        
        if traffic_data:
            # Update running average
            total_delay = traffic_data.avg_delay_minutes * traffic_data.sample_count
            new_total = total_delay + delay_minutes
            traffic_data.sample_count += 1
            traffic_data.avg_delay_minutes = new_total / traffic_data.sample_count
            traffic_data.last_updated = datetime.utcnow()
        else:
            # Create new record
            traffic_data = TrafficData(
                location_id=location_id,
                hour_of_day=hour,
                day_of_week=day_of_week,
                avg_delay_minutes=delay_minutes,
                sample_count=1
            )
            db.add(traffic_data)
        
        db.commit()
        
        return {
            "message": "Traffic data updated",
            "location_id": location_id,
            "hour": hour,
            "day_of_week": day_of_week,
            "avg_delay_minutes": traffic_data.avg_delay_minutes,
            "sample_count": traffic_data.sample_count
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update traffic data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
