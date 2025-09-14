from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, JSON
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

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://collab:collab@localhost:5432/collab")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class GeofenceZone(Base):
    __tablename__ = "geofence_zones"
    
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_meters = Column(Integer, nullable=False)
    zone_type = Column(String, default="circular")  # circular, polygon
    polygon_coordinates = Column(JSON, nullable=True)  # For polygon zones
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    checkins = relationship("GeofenceCheckin", back_populates="zone")
    events = relationship("GeofenceEvent", back_populates="zone")

class GeofenceCheckin(Base):
    __tablename__ = "geofence_checkins"
    
    id = Column(Integer, primary_key=True, index=True)
    checkin_id = Column(String, unique=True, index=True, nullable=False)
    zone_id = Column(String, ForeignKey("geofence_zones.zone_id"))
    user_id = Column(Integer, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy_meters = Column(Float, nullable=True)
    checkin_type = Column(String, default="manual")  # manual, automatic, scheduled
    status = Column(String, default="pending")  # pending, verified, rejected
    notes = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    zone = relationship("GeofenceZone", back_populates="checkins")

class GeofenceEvent(Base):
    __tablename__ = "geofence_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, index=True, nullable=False)
    zone_id = Column(String, ForeignKey("geofence_zones.zone_id"))
    user_id = Column(Integer, nullable=False)
    event_type = Column(String, nullable=False)  # enter, exit, dwell, checkin
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy_meters = Column(Float, nullable=True)
    duration_seconds = Column(Integer, nullable=True)  # For dwell events
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    zone = relationship("GeofenceZone", back_populates="events")

class UserLocation(Base):
    __tablename__ = "user_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy_meters = Column(Float, nullable=True)
    altitude = Column(Float, nullable=True)
    speed = Column(Float, nullable=True)
    heading = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class NotificationRule(Base):
    __tablename__ = "notification_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(String, unique=True, index=True, nullable=False)
    zone_id = Column(String, ForeignKey("geofence_zones.zone_id"))
    event_type = Column(String, nullable=False)  # enter, exit, dwell, checkin
    notification_type = Column(String, nullable=False)  # push, sms, email, webhook
    recipients = Column(JSON, nullable=False)  # List of recipient info
    message_template = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class GeofenceZoneCreate(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    radius_meters: int
    zone_type: str = "circular"
    polygon_coordinates: Optional[List[Dict[str, float]]] = None

class GeofenceCheckinRequest(BaseModel):
    zone_id: str
    latitude: float
    longitude: float
    accuracy_meters: Optional[float] = None
    checkin_type: str = "manual"
    notes: Optional[str] = None
    photo_data: Optional[str] = None  # Base64 encoded image

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    accuracy_meters: Optional[float] = None
    altitude: Optional[float] = None
    speed: Optional[float] = None
    heading: Optional[float] = None

class NotificationRuleCreate(BaseModel):
    zone_id: str
    event_type: str
    notification_type: str
    recipients: List[Dict[str, Any]]
    message_template: str

# FastAPI app
app = FastAPI(
    title="Geofencing Service",
    description="Advanced geofencing system with mobile GPS integration",
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
def generate_zone_id():
    return f"zone_{uuid.uuid4().hex[:12]}"

def generate_checkin_id():
    return f"checkin_{uuid.uuid4().hex[:12]}"

def generate_event_id():
    return f"event_{uuid.uuid4().hex[:12]}"

def generate_rule_id():
    return f"rule_{uuid.uuid4().hex[:12]}"

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    R = 6371000  # Earth's radius in meters
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def is_point_in_circle(point_lat: float, point_lon: float, 
                      center_lat: float, center_lon: float, radius_meters: float) -> bool:
    """Check if a point is within a circular geofence"""
    distance = calculate_distance(point_lat, point_lon, center_lat, center_lon)
    return distance <= radius_meters

def is_point_in_polygon(point_lat: float, point_lon: float, polygon_coords: List[Dict[str, float]]) -> bool:
    """Check if a point is within a polygon geofence using ray casting algorithm"""
    x, y = point_lon, point_lat
    n = len(polygon_coords)
    inside = False
    
    p1x, p1y = polygon_coords[0]["longitude"], polygon_coords[0]["latitude"]
    for i in range(1, n + 1):
        p2x, p2y = polygon_coords[i % n]["longitude"], polygon_coords[i % n]["latitude"]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    
    return inside

def is_point_in_geofence(latitude: float, longitude: float, zone: GeofenceZone) -> bool:
    """Check if a point is within any type of geofence"""
    if zone.zone_type == "circular":
        return is_point_in_circle(latitude, longitude, zone.latitude, zone.longitude, zone.radius_meters)
    elif zone.zone_type == "polygon" and zone.polygon_coordinates:
        return is_point_in_polygon(latitude, longitude, zone.polygon_coordinates)
    return False

async def send_notification(notification_type: str, recipients: List[Dict[str, Any]], 
                          message: str, metadata: Dict[str, Any] = None):
    """Send notification via various channels"""
    try:
        if notification_type == "push":
            # Send push notification
            for recipient in recipients:
                logger.info(f"Sending push notification to {recipient.get('device_token')}: {message}")
                # TODO: Integrate with push notification service (FCM, APNS)
        
        elif notification_type == "sms":
            # Send SMS
            for recipient in recipients:
                logger.info(f"Sending SMS to {recipient.get('phone')}: {message}")
                # TODO: Integrate with SMS service (Twilio, AWS SNS)
        
        elif notification_type == "email":
            # Send email
            for recipient in recipients:
                logger.info(f"Sending email to {recipient.get('email')}: {message}")
                # TODO: Integrate with email service (SendGrid, AWS SES)
        
        elif notification_type == "webhook":
            # Send webhook
            for recipient in recipients:
                webhook_url = recipient.get('url')
                if webhook_url:
                    async with httpx.AsyncClient() as client:
                        payload = {
                            "message": message,
                            "metadata": metadata or {},
                            "timestamp": datetime.utcnow().isoformat()
                        }
                        await client.post(webhook_url, json=payload)
                        logger.info(f"Sent webhook to {webhook_url}")
    
    except Exception as e:
        logger.error(f"Failed to send notification: {str(e)}")

async def process_geofence_event(user_id: int, latitude: float, longitude: float, 
                               accuracy_meters: float, db: Session):
    """Process location update and check for geofence events"""
    try:
        # Get all active geofence zones
        zones = db.query(GeofenceZone).filter(GeofenceZone.is_active == True).all()
        
        for zone in zones:
            is_inside = is_point_in_geofence(latitude, longitude, zone)
            
            # Check if this is a new event (enter/exit)
            last_event = db.query(GeofenceEvent).filter(
                GeofenceEvent.zone_id == zone.zone_id,
                GeofenceEvent.user_id == user_id
            ).order_by(GeofenceEvent.created_at.desc()).first()
            
            event_type = None
            if is_inside and (not last_event or last_event.event_type in ["exit", "dwell"]):
                event_type = "enter"
            elif not is_inside and last_event and last_event.event_type == "enter":
                event_type = "exit"
            
            if event_type:
                # Create geofence event
                event = GeofenceEvent(
                    event_id=generate_event_id(),
                    zone_id=zone.zone_id,
                    user_id=user_id,
                    event_type=event_type,
                    latitude=latitude,
                    longitude=longitude,
                    accuracy_meters=accuracy_meters
                )
                db.add(event)
                
                # Send notifications
                rules = db.query(NotificationRule).filter(
                    NotificationRule.zone_id == zone.zone_id,
                    NotificationRule.event_type == event_type,
                    NotificationRule.is_active == True
                ).all()
                
                for rule in rules:
                    message = rule.message_template.format(
                        zone_name=zone.name,
                        user_id=user_id,
                        event_type=event_type,
                        timestamp=datetime.utcnow().isoformat()
                    )
                    await send_notification(
                        rule.notification_type,
                        rule.recipients,
                        message,
                        {"zone_id": zone.zone_id, "event_id": event.event_id}
                    )
        
        db.commit()
        return True
    
    except Exception as e:
        logger.error(f"Failed to process geofence event: {str(e)}")
        return False

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "geofence-service"}

@app.post("/api/zones")
async def create_geofence_zone(
    request: GeofenceZoneCreate,
    created_by: int,
    db: Session = Depends(get_db)
):
    """Create a new geofence zone"""
    try:
        zone_id = generate_zone_id()
        
        zone = GeofenceZone(
            zone_id=zone_id,
            name=request.name,
            description=request.description,
            latitude=request.latitude,
            longitude=request.longitude,
            radius_meters=request.radius_meters,
            zone_type=request.zone_type,
            polygon_coordinates=request.polygon_coordinates,
            created_by=created_by
        )
        
        db.add(zone)
        db.commit()
        db.refresh(zone)
        
        return {
            "message": "Geofence zone created successfully",
            "zone_id": zone_id,
            "zone": {
                "zone_id": zone.zone_id,
                "name": zone.name,
                "description": zone.description,
                "latitude": zone.latitude,
                "longitude": zone.longitude,
                "radius_meters": zone.radius_meters,
                "zone_type": zone.zone_type,
                "is_active": zone.is_active
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create geofence zone: {str(e)}")

@app.get("/api/zones")
async def get_geofence_zones(
    user_id: Optional[int] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    """Get geofence zones"""
    query = db.query(GeofenceZone)
    
    if is_active is not None:
        query = query.filter(GeofenceZone.is_active == is_active)
    
    zones = query.all()
    
    return [
        {
            "zone_id": zone.zone_id,
            "name": zone.name,
            "description": zone.description,
            "latitude": zone.latitude,
            "longitude": zone.longitude,
            "radius_meters": zone.radius_meters,
            "zone_type": zone.zone_type,
            "polygon_coordinates": zone.polygon_coordinates,
            "is_active": zone.is_active,
            "created_at": zone.created_at
        } for zone in zones
    ]

@app.post("/api/location/update")
async def update_user_location(
    request: LocationUpdate,
    user_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Update user location and process geofence events"""
    try:
        # Store location update
        location = UserLocation(
            user_id=user_id,
            latitude=request.latitude,
            longitude=request.longitude,
            accuracy_meters=request.accuracy_meters,
            altitude=request.altitude,
            speed=request.speed,
            heading=request.heading
        )
        db.add(location)
        db.commit()
        
        # Process geofence events in background
        background_tasks.add_task(
            process_geofence_event,
            user_id,
            request.latitude,
            request.longitude,
            request.accuracy_meters,
            db
        )
        
        return {
            "message": "Location updated successfully",
            "user_id": user_id,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "timestamp": location.timestamp
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update location: {str(e)}")

@app.post("/api/checkin")
async def create_checkin(
    request: GeofenceCheckinRequest,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Create a manual check-in"""
    try:
        # Get the geofence zone
        zone = db.query(GeofenceZone).filter(GeofenceZone.zone_id == request.zone_id).first()
        if not zone:
            raise HTTPException(status_code=404, detail="Geofence zone not found")
        
        # Verify user is within the geofence
        is_inside = is_point_in_geofence(request.latitude, request.longitude, zone)
        if not is_inside:
            distance = calculate_distance(request.latitude, request.longitude, zone.latitude, zone.longitude)
            raise HTTPException(
                status_code=400, 
                detail=f"Location is outside geofence. Distance: {distance:.2f}m, Required: {zone.radius_meters}m"
            )
        
        # Create check-in
        checkin_id = generate_checkin_id()
        checkin = GeofenceCheckin(
            checkin_id=checkin_id,
            zone_id=request.zone_id,
            user_id=user_id,
            latitude=request.latitude,
            longitude=request.longitude,
            accuracy_meters=request.accuracy_meters,
            checkin_type=request.checkin_type,
            notes=request.notes,
            status="verified" if is_inside else "pending"
        )
        
        db.add(checkin)
        
        # Create check-in event
        event = GeofenceEvent(
            event_id=generate_event_id(),
            zone_id=request.zone_id,
            user_id=user_id,
            event_type="checkin",
            latitude=request.latitude,
            longitude=request.longitude,
            accuracy_meters=request.accuracy_meters,
            metadata={"checkin_id": checkin_id, "checkin_type": request.checkin_type}
        )
        db.add(event)
        
        # Send notifications for check-in
        rules = db.query(NotificationRule).filter(
            NotificationRule.zone_id == request.zone_id,
            NotificationRule.event_type == "checkin",
            NotificationRule.is_active == True
        ).all()
        
        for rule in rules:
            message = rule.message_template.format(
                zone_name=zone.name,
                user_id=user_id,
                checkin_type=request.checkin_type,
                timestamp=datetime.utcnow().isoformat()
            )
            await send_notification(
                rule.notification_type,
                rule.recipients,
                message,
                {"zone_id": request.zone_id, "checkin_id": checkin_id}
            )
        
        db.commit()
        
        return {
            "message": "Check-in created successfully",
            "checkin_id": checkin_id,
            "status": checkin.status,
            "zone_name": zone.name,
            "is_inside": is_inside
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create check-in: {str(e)}")

@app.get("/api/checkins/{user_id}")
async def get_user_checkins(
    user_id: int,
    zone_id: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get user's check-ins"""
    query = db.query(GeofenceCheckin).filter(GeofenceCheckin.user_id == user_id)
    
    if zone_id:
        query = query.filter(GeofenceCheckin.zone_id == zone_id)
    
    checkins = query.order_by(GeofenceCheckin.created_at.desc()).limit(limit).all()
    
    return [
        {
            "checkin_id": c.checkin_id,
            "zone_id": c.zone_id,
            "latitude": c.latitude,
            "longitude": c.longitude,
            "accuracy_meters": c.accuracy_meters,
            "checkin_type": c.checkin_type,
            "status": c.status,
            "notes": c.notes,
            "created_at": c.created_at
        } for c in checkins
    ]

@app.get("/api/events/{user_id}")
async def get_user_events(
    user_id: int,
    zone_id: Optional[str] = None,
    event_type: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get user's geofence events"""
    query = db.query(GeofenceEvent).filter(GeofenceEvent.user_id == user_id)
    
    if zone_id:
        query = query.filter(GeofenceEvent.zone_id == zone_id)
    
    if event_type:
        query = query.filter(GeofenceEvent.event_type == event_type)
    
    events = query.order_by(GeofenceEvent.created_at.desc()).limit(limit).all()
    
    return [
        {
            "event_id": e.event_id,
            "zone_id": e.zone_id,
            "event_type": e.event_type,
            "latitude": e.latitude,
            "longitude": e.longitude,
            "accuracy_meters": e.accuracy_meters,
            "duration_seconds": e.duration_seconds,
            "metadata": e.metadata,
            "created_at": e.created_at
        } for e in events
    ]

@app.post("/api/notification-rules")
async def create_notification_rule(
    request: NotificationRuleCreate,
    created_by: int,
    db: Session = Depends(get_db)
):
    """Create a notification rule"""
    try:
        rule_id = generate_rule_id()
        
        rule = NotificationRule(
            rule_id=rule_id,
            zone_id=request.zone_id,
            event_type=request.event_type,
            notification_type=request.notification_type,
            recipients=request.recipients,
            message_template=request.message_template,
            created_by=created_by
        )
        
        db.add(rule)
        db.commit()
        db.refresh(rule)
        
        return {
            "message": "Notification rule created successfully",
            "rule_id": rule_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create notification rule: {str(e)}")

@app.get("/api/nearby-zones")
async def get_nearby_zones(
    latitude: float,
    longitude: float,
    radius_km: float = 10.0,
    db: Session = Depends(get_db)
):
    """Get geofence zones near a location"""
    zones = db.query(GeofenceZone).filter(GeofenceZone.is_active == True).all()
    
    nearby_zones = []
    for zone in zones:
        distance = calculate_distance(latitude, longitude, zone.latitude, zone.longitude)
        if distance <= radius_km * 1000:  # Convert km to meters
            nearby_zones.append({
                "zone_id": zone.zone_id,
                "name": zone.name,
                "description": zone.description,
                "latitude": zone.latitude,
                "longitude": zone.longitude,
                "radius_meters": zone.radius_meters,
                "zone_type": zone.zone_type,
                "distance_meters": distance,
                "is_inside": is_point_in_geofence(latitude, longitude, zone)
            })
    
    # Sort by distance
    nearby_zones.sort(key=lambda x: x["distance_meters"])
    
    return nearby_zones

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)


