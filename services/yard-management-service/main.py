from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, Text, ForeignKey, Float, Integer, JSON, Enum, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any, Tuple
import os
import uuid
import json
import enum
import asyncio
import httpx
from dotenv import load_dotenv
import logging
import math

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://collab:collab@localhost:5432/collab")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class EquipmentTypeEnum(enum.Enum):
    van = "van"
    reefer = "reefer"
    flatbed = "flatbed"

class TrailerStatusEnum(enum.Enum):
    enroute = "enroute"
    at_gate = "at_gate"
    in_yard = "in_yard"
    at_dock = "at_dock"
    empty = "empty"
    loaded = "loaded"
    ready = "ready"

class EventTypeEnum(enum.Enum):
    eta = "eta"
    arrive = "arrive"
    at_dock = "at_dock"
    depart = "depart"
    doc_signed = "doc_signed"
    exception = "exception"

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

class Trailer(Base):
    __tablename__ = "trailers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    carrier_id = Column(UUID(as_uuid=True), nullable=False)
    equipment_type = Column(Enum(EquipmentTypeEnum), default=EquipmentTypeEnum.van)
    plate = Column(String(50), nullable=False)
    status = Column(Enum(TrailerStatusEnum), default=TrailerStatusEnum.enroute)
    last_latitude = Column(Float)
    last_longitude = Column(Float)
    last_seen = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class LogisticsEvent(Base):
    __tablename__ = "logistics_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    type = Column(Enum(EventTypeEnum), nullable=False)
    ref_table = Column(String(100))  # e.g., "trailers", "appointments"
    ref_id = Column(UUID(as_uuid=True))
    payload = Column(JSON)  # JSON payload for flexible event data
    at = Column(DateTime, default=datetime.utcnow)

class YardZone(Base):
    __tablename__ = "yard_zones"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    zone_name = Column(String(100), nullable=False)
    zone_type = Column(String(50), default="parking")  # parking, staging, loading, etc.
    capacity = Column(Integer, default=10)
    geojson_boundary = Column(Text)  # GeoJSON polygon for zone boundary
    metadata = Column(JSON)  # Additional zone properties
    created_at = Column(DateTime, default=datetime.utcnow)

class TrailerPosition(Base):
    __tablename__ = "trailer_positions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trailer_id = Column(UUID(as_uuid=True), ForeignKey("trailers.id"), nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"))
    yard_zone_id = Column(UUID(as_uuid=True), ForeignKey("yard_zones.id"))
    spot_number = Column(String(50))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy_meters = Column(Float)
    entered_at = Column(DateTime, default=datetime.utcnow)
    exited_at = Column(DateTime)

# Pydantic Models
class TrailerCreate(BaseModel):
    carrier_id: str
    equipment_type: str = "van"
    plate: str

class TrailerUpdate(BaseModel):
    status: Optional[str] = None
    equipment_type: Optional[str] = None

class TrailerLocationUpdate(BaseModel):
    trailer_id: str
    latitude: float
    longitude: float
    accuracy_meters: Optional[float] = None
    timestamp: Optional[datetime] = None

class YardZoneCreate(BaseModel):
    location_id: str
    zone_name: str
    zone_type: str = "parking"
    capacity: int = 10
    boundary_coordinates: List[Dict[str, float]]  # [{"lat": x, "lon": y}, ...]
    metadata: Optional[Dict[str, Any]] = None

class TrailerSearchRequest(BaseModel):
    location_id: Optional[str] = None
    carrier_id: Optional[str] = None
    status: Optional[str] = None
    equipment_type: Optional[str] = None
    in_yard: Optional[bool] = None

class YardOccupancyResponse(BaseModel):
    zone_id: str
    zone_name: str
    zone_type: str
    capacity: int
    current_occupancy: int
    occupancy_percentage: float
    available_spots: int

# FastAPI app
app = FastAPI(
    title="Yard & Trailer Management Service",
    description="Asset tracking and yard management for logistics operations",
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
    """Calculate distance between two points using Haversine formula (returns meters)"""
    R = 6371000  # Earth's radius in meters
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def is_point_in_polygon(point_lat: float, point_lon: float, polygon_coords: List[Dict[str, float]]) -> bool:
    """Check if a point is within a polygon using ray casting algorithm"""
    x, y = point_lon, point_lat
    n = len(polygon_coords)
    inside = False
    
    p1x, p1y = polygon_coords[0]["lon"], polygon_coords[0]["lat"]
    for i in range(1, n + 1):
        p2x, p2y = polygon_coords[i % n]["lon"], polygon_coords[i % n]["lat"]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    
    return inside

def determine_yard_zone(latitude: float, longitude: float, location_id: str, db: Session) -> Optional[str]:
    """Determine which yard zone a trailer is in based on coordinates"""
    zones = db.query(YardZone).filter(YardZone.location_id == location_id).all()
    
    for zone in zones:
        if zone.geojson_boundary:
            try:
                boundary_data = json.loads(zone.geojson_boundary)
                if boundary_data.get("type") == "Polygon":
                    coordinates = boundary_data.get("coordinates", [[]])[0]
                    polygon_coords = [{"lat": coord[1], "lon": coord[0]} for coord in coordinates]
                    
                    if is_point_in_polygon(latitude, longitude, polygon_coords):
                        return str(zone.id)
            except:
                continue
    
    return None

def find_available_spot(zone_id: str, db: Session) -> Optional[str]:
    """Find an available spot in a yard zone"""
    zone = db.query(YardZone).filter(YardZone.id == zone_id).first()
    if not zone:
        return None
    
    # Get occupied spots
    occupied_positions = db.query(TrailerPosition).filter(
        TrailerPosition.yard_zone_id == zone_id,
        TrailerPosition.exited_at.is_(None)
    ).all()
    
    occupied_spots = {pos.spot_number for pos in occupied_positions if pos.spot_number}
    
    # Generate spot numbers (simple numbering system)
    for i in range(1, zone.capacity + 1):
        spot_number = f"{zone.zone_name}-{i:03d}"
        if spot_number not in occupied_spots:
            return spot_number
    
    return None

async def create_yard_event(event_type: str, trailer_id: str, location_id: str, 
                           payload: Dict[str, Any], db: Session):
    """Create a logistics event for yard operations"""
    try:
        event = LogisticsEvent(
            location_id=location_id,
            type=EventTypeEnum(event_type),
            ref_table="trailers",
            ref_id=trailer_id,
            payload=payload
        )
        
        db.add(event)
        db.commit()
        
        logger.info(f"Yard event created: {event_type} for trailer {trailer_id}")
    
    except Exception as e:
        logger.error(f"Failed to create yard event: {str(e)}")

async def send_yard_notification(event_type: str, trailer_id: str, details: Dict[str, Any]):
    """Send notification for yard events"""
    try:
        # TODO: Integrate with notification service
        logger.info(f"Yard notification: {event_type} - Trailer {trailer_id}: {details}")
        
        # Webhook to main DMS service
        async with httpx.AsyncClient() as client:
            payload = {
                "event_type": f"yard_{event_type}",
                "trailer_id": trailer_id,
                "details": details,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Send to DMS core service
            dms_url = os.getenv("DMS_CORE_URL", "http://localhost:5000")
            try:
                await client.post(f"{dms_url}/events/inbound", json=payload)
            except:
                logger.warning("Failed to notify DMS core service")
    
    except Exception as e:
        logger.error(f"Failed to send yard notification: {str(e)}")

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "yard-management-service"}

@app.post("/api/trailers")
async def create_trailer(
    request: TrailerCreate,
    db: Session = Depends(get_db)
):
    """Register a new trailer"""
    try:
        # Check if plate already exists for carrier
        existing = db.query(Trailer).filter(
            Trailer.carrier_id == request.carrier_id,
            Trailer.plate == request.plate
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Trailer plate already exists for this carrier")
        
        trailer = Trailer(
            carrier_id=request.carrier_id,
            equipment_type=EquipmentTypeEnum(request.equipment_type),
            plate=request.plate
        )
        
        db.add(trailer)
        db.commit()
        db.refresh(trailer)
        
        return {
            "message": "Trailer registered successfully",
            "trailer_id": str(trailer.id),
            "trailer": {
                "id": str(trailer.id),
                "carrier_id": str(trailer.carrier_id),
                "equipment_type": trailer.equipment_type.value,
                "plate": trailer.plate,
                "status": trailer.status.value,
                "created_at": trailer.created_at
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create trailer: {str(e)}")

@app.get("/api/trailers")
async def search_trailers(
    carrier_id: Optional[str] = None,
    status: Optional[str] = None,
    equipment_type: Optional[str] = None,
    location_id: Optional[str] = None,
    in_yard: Optional[bool] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Search trailers with filters"""
    try:
        query = db.query(Trailer)
        
        if carrier_id:
            query = query.filter(Trailer.carrier_id == carrier_id)
        
        if status:
            query = query.filter(Trailer.status == TrailerStatusEnum(status))
        
        if equipment_type:
            query = query.filter(Trailer.equipment_type == EquipmentTypeEnum(equipment_type))
        
        trailers = query.order_by(Trailer.last_seen.desc()).limit(limit).all()
        
        # Filter by location/yard if specified
        if location_id or in_yard is not None:
            filtered_trailers = []
            for trailer in trailers:
                # Get latest position
                latest_position = db.query(TrailerPosition).filter(
                    TrailerPosition.trailer_id == trailer.id
                ).order_by(TrailerPosition.entered_at.desc()).first()
                
                if location_id and latest_position and str(latest_position.location_id) == location_id:
                    filtered_trailers.append(trailer)
                elif in_yard is True and latest_position and latest_position.yard_zone_id:
                    filtered_trailers.append(trailer)
                elif in_yard is False and (not latest_position or not latest_position.yard_zone_id):
                    filtered_trailers.append(trailer)
            
            trailers = filtered_trailers
        
        return [
            {
                "id": str(trailer.id),
                "carrier_id": str(trailer.carrier_id),
                "equipment_type": trailer.equipment_type.value,
                "plate": trailer.plate,
                "status": trailer.status.value,
                "last_latitude": trailer.last_latitude,
                "last_longitude": trailer.last_longitude,
                "last_seen": trailer.last_seen,
                "created_at": trailer.created_at
            } for trailer in trailers
        ]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search trailers: {str(e)}")

@app.put("/api/trailers/{trailer_id}")
async def update_trailer(
    trailer_id: str,
    request: TrailerUpdate,
    db: Session = Depends(get_db)
):
    """Update trailer information"""
    try:
        trailer = db.query(Trailer).filter(Trailer.id == trailer_id).first()
        
        if not trailer:
            raise HTTPException(status_code=404, detail="Trailer not found")
        
        if request.status:
            old_status = trailer.status.value
            trailer.status = TrailerStatusEnum(request.status)
            
            # Log status change
            logger.info(f"Trailer {trailer_id} status changed from {old_status} to {request.status}")
        
        if request.equipment_type:
            trailer.equipment_type = EquipmentTypeEnum(request.equipment_type)
        
        trailer.last_seen = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Trailer updated successfully",
            "trailer_id": trailer_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update trailer: {str(e)}")

@app.post("/api/trailers/location")
async def update_trailer_location(
    request: TrailerLocationUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Update trailer location and manage yard positioning"""
    try:
        trailer = db.query(Trailer).filter(Trailer.id == request.trailer_id).first()
        
        if not trailer:
            raise HTTPException(status_code=404, detail="Trailer not found")
        
        # Update trailer's last known position
        trailer.last_latitude = request.latitude
        trailer.last_longitude = request.longitude
        trailer.last_seen = request.timestamp or datetime.utcnow()
        
        # Check if trailer is at any location
        locations = db.query(Location).all()
        current_location = None
        
        for location in locations:
            if location.geojson_gate:
                try:
                    gate_data = json.loads(location.geojson_gate)
                    if gate_data.get("type") == "Point":
                        gate_coords = gate_data.get("coordinates", [])
                        if len(gate_coords) >= 2:
                            distance = calculate_distance(
                                request.latitude, request.longitude,
                                gate_coords[1], gate_coords[0]
                            )
                            
                            if distance <= 100:  # Within 100 meters of gate
                                current_location = location
                                break
                except:
                    continue
        
        # Get current position record
        current_position = db.query(TrailerPosition).filter(
            TrailerPosition.trailer_id == request.trailer_id,
            TrailerPosition.exited_at.is_(None)
        ).first()
        
        if current_location:
            # Trailer is at a location
            if trailer.status == TrailerStatusEnum.enroute:
                trailer.status = TrailerStatusEnum.at_gate
                
                # Create arrival event
                background_tasks.add_task(
                    create_yard_event,
                    "arrive",
                    request.trailer_id,
                    str(current_location.id),
                    {
                        "trailer_plate": trailer.plate,
                        "location_name": current_location.name,
                        "arrival_time": trailer.last_seen.isoformat()
                    },
                    db
                )
            
            # Check if trailer entered a yard zone
            yard_zone_id = determine_yard_zone(
                request.latitude, request.longitude, 
                str(current_location.id), db
            )
            
            if yard_zone_id:
                # Trailer is in a yard zone
                if not current_position or current_position.yard_zone_id != yard_zone_id:
                    # Exit previous position if exists
                    if current_position:
                        current_position.exited_at = datetime.utcnow()
                    
                    # Find available spot
                    spot_number = find_available_spot(yard_zone_id, db)
                    
                    # Create new position record
                    new_position = TrailerPosition(
                        trailer_id=request.trailer_id,
                        location_id=current_location.id,
                        yard_zone_id=yard_zone_id,
                        spot_number=spot_number,
                        latitude=request.latitude,
                        longitude=request.longitude,
                        accuracy_meters=request.accuracy_meters
                    )
                    
                    db.add(new_position)
                    
                    # Update trailer status
                    trailer.status = TrailerStatusEnum.in_yard
                    
                    # Get zone info for event
                    zone = db.query(YardZone).filter(YardZone.id == yard_zone_id).first()
                    
                    # Create yard entry event
                    background_tasks.add_task(
                        create_yard_event,
                        "yard_entry",
                        request.trailer_id,
                        str(current_location.id),
                        {
                            "trailer_plate": trailer.plate,
                            "zone_name": zone.zone_name if zone else "Unknown",
                            "spot_number": spot_number,
                            "entry_time": datetime.utcnow().isoformat()
                        },
                        db
                    )
            
            elif current_position and current_position.yard_zone_id:
                # Trailer left yard zone
                current_position.exited_at = datetime.utcnow()
                trailer.status = TrailerStatusEnum.at_gate
                
                # Create yard exit event
                zone = db.query(YardZone).filter(
                    YardZone.id == current_position.yard_zone_id
                ).first()
                
                background_tasks.add_task(
                    create_yard_event,
                    "yard_exit",
                    request.trailer_id,
                    str(current_location.id),
                    {
                        "trailer_plate": trailer.plate,
                        "zone_name": zone.zone_name if zone else "Unknown",
                        "spot_number": current_position.spot_number,
                        "exit_time": datetime.utcnow().isoformat()
                    },
                    db
                )
        
        else:
            # Trailer is not at any location
            if current_position:
                current_position.exited_at = datetime.utcnow()
            
            if trailer.status in [TrailerStatusEnum.at_gate, TrailerStatusEnum.in_yard]:
                trailer.status = TrailerStatusEnum.enroute
        
        db.commit()
        
        return {
            "message": "Trailer location updated",
            "trailer_id": request.trailer_id,
            "current_status": trailer.status.value,
            "at_location": current_location.name if current_location else None,
            "in_yard_zone": yard_zone_id is not None
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update location: {str(e)}")

@app.post("/api/yard-zones")
async def create_yard_zone(
    request: YardZoneCreate,
    db: Session = Depends(get_db)
):
    """Create a yard zone"""
    try:
        # Convert coordinates to GeoJSON
        coordinates = [[coord["lon"], coord["lat"]] for coord in request.boundary_coordinates]
        coordinates.append(coordinates[0])  # Close the polygon
        
        geojson_boundary = json.dumps({
            "type": "Polygon",
            "coordinates": [coordinates]
        })
        
        zone = YardZone(
            location_id=request.location_id,
            zone_name=request.zone_name,
            zone_type=request.zone_type,
            capacity=request.capacity,
            geojson_boundary=geojson_boundary,
            metadata=request.metadata
        )
        
        db.add(zone)
        db.commit()
        db.refresh(zone)
        
        return {
            "message": "Yard zone created successfully",
            "zone_id": str(zone.id),
            "zone": {
                "id": str(zone.id),
                "location_id": str(zone.location_id),
                "zone_name": zone.zone_name,
                "zone_type": zone.zone_type,
                "capacity": zone.capacity,
                "created_at": zone.created_at
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create yard zone: {str(e)}")

@app.get("/api/yard-zones")
async def get_yard_zones(
    location_id: Optional[str] = None,
    zone_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get yard zones with optional filters"""
    query = db.query(YardZone)
    
    if location_id:
        query = query.filter(YardZone.location_id == location_id)
    
    if zone_type:
        query = query.filter(YardZone.zone_type == zone_type)
    
    zones = query.order_by(YardZone.zone_name).all()
    
    return [
        {
            "id": str(zone.id),
            "location_id": str(zone.location_id),
            "zone_name": zone.zone_name,
            "zone_type": zone.zone_type,
            "capacity": zone.capacity,
            "metadata": zone.metadata,
            "created_at": zone.created_at
        } for zone in zones
    ]

@app.get("/api/yard-zones/{location_id}/occupancy")
async def get_yard_occupancy(
    location_id: str,
    db: Session = Depends(get_db)
) -> List[YardOccupancyResponse]:
    """Get current yard occupancy for all zones at a location"""
    try:
        zones = db.query(YardZone).filter(YardZone.location_id == location_id).all()
        
        occupancy_data = []
        for zone in zones:
            # Count current occupancy
            current_occupancy = db.query(TrailerPosition).filter(
                TrailerPosition.yard_zone_id == zone.id,
                TrailerPosition.exited_at.is_(None)
            ).count()
            
            occupancy_percentage = (current_occupancy / zone.capacity) * 100 if zone.capacity > 0 else 0
            available_spots = max(0, zone.capacity - current_occupancy)
            
            occupancy_data.append(YardOccupancyResponse(
                zone_id=str(zone.id),
                zone_name=zone.zone_name,
                zone_type=zone.zone_type,
                capacity=zone.capacity,
                current_occupancy=current_occupancy,
                occupancy_percentage=round(occupancy_percentage, 2),
                available_spots=available_spots
            ))
        
        return occupancy_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get yard occupancy: {str(e)}")

@app.get("/api/trailers/{trailer_id}/position")
async def get_trailer_position(
    trailer_id: str,
    db: Session = Depends(get_db)
):
    """Get current position and status of a trailer"""
    try:
        trailer = db.query(Trailer).filter(Trailer.id == trailer_id).first()
        
        if not trailer:
            raise HTTPException(status_code=404, detail="Trailer not found")
        
        # Get current position
        current_position = db.query(TrailerPosition).filter(
            TrailerPosition.trailer_id == trailer_id,
            TrailerPosition.exited_at.is_(None)
        ).first()
        
        position_data = {
            "trailer_id": str(trailer.id),
            "plate": trailer.plate,
            "status": trailer.status.value,
            "equipment_type": trailer.equipment_type.value,
            "last_latitude": trailer.last_latitude,
            "last_longitude": trailer.last_longitude,
            "last_seen": trailer.last_seen,
            "current_position": None
        }
        
        if current_position:
            # Get zone and location details
            zone = db.query(YardZone).filter(
                YardZone.id == current_position.yard_zone_id
            ).first()
            
            location = db.query(Location).filter(
                Location.id == current_position.location_id
            ).first()
            
            position_data["current_position"] = {
                "location_id": str(current_position.location_id),
                "location_name": location.name if location else None,
                "yard_zone_id": str(current_position.yard_zone_id) if current_position.yard_zone_id else None,
                "zone_name": zone.zone_name if zone else None,
                "spot_number": current_position.spot_number,
                "entered_at": current_position.entered_at,
                "latitude": current_position.latitude,
                "longitude": current_position.longitude
            }
        
        return position_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trailer position: {str(e)}")

@app.get("/api/events")
async def get_yard_events(
    location_id: Optional[str] = None,
    event_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get yard logistics events"""
    query = db.query(LogisticsEvent)
    
    if location_id:
        query = query.filter(LogisticsEvent.location_id == location_id)
    
    if event_type:
        query = query.filter(LogisticsEvent.type == EventTypeEnum(event_type))
    
    if start_date:
        query = query.filter(LogisticsEvent.at >= start_date)
    
    if end_date:
        query = query.filter(LogisticsEvent.at <= end_date)
    
    events = query.order_by(LogisticsEvent.at.desc()).limit(limit).all()
    
    return [
        {
            "id": str(event.id),
            "location_id": str(event.location_id),
            "type": event.type.value,
            "ref_table": event.ref_table,
            "ref_id": str(event.ref_id) if event.ref_id else None,
            "payload": event.payload,
            "at": event.at
        } for event in events
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
