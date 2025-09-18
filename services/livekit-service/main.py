from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
import uuid
import asyncio
import json
from dotenv import load_dotenv
import livekit
from livekit import api
from livekit.api import AccessToken

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://collab:collab@localhost:5432/collab")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# LiveKit configuration
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "ws://localhost:7880")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "devkey")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "secret")

# Database Models
class Call(Base):
    __tablename__ = "calls"
    
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(String, unique=True, index=True, nullable=False)
    room_name = Column(String, nullable=False)
    caller_phone = Column(String, nullable=False)
    callee_phone = Column(String, nullable=False)
    caller_user_id = Column(Integer, nullable=True)
    callee_user_id = Column(Integer, nullable=True)
    status = Column(String, default="initiated")  # initiated, ringing, active, ended
    call_type = Column(String, default="voice")  # voice, video
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, default=0)
    recording_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CallParticipant(Base):
    __tablename__ = "call_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(String, ForeignKey("calls.call_id"))
    user_id = Column(Integer, nullable=True)
    phone_number = Column(String, nullable=False)
    participant_id = Column(String, nullable=False)  # LiveKit participant ID
    joined_at = Column(DateTime, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)
    is_muted = Column(Boolean, default=False)
    is_video_enabled = Column(Boolean, default=True)
    
    call = relationship("Call")

class PhoneNumber(Base):
    __tablename__ = "phone_numbers"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class CallCreate(BaseModel):
    caller_phone: str
    callee_phone: str
    call_type: str = "voice"  # voice or video
    caller_user_id: Optional[int] = None
    callee_user_id: Optional[int] = None

class CallResponse(BaseModel):
    id: int
    call_id: str
    room_name: str
    caller_phone: str
    callee_phone: str
    status: str
    call_type: str
    started_at: datetime
    ended_at: Optional[datetime]
    duration_seconds: int
    recording_url: Optional[str]
    access_token: str
    livekit_url: str

class CallHistoryResponse(BaseModel):
    id: int
    call_id: str
    caller_phone: str
    callee_phone: str
    status: str
    call_type: str
    started_at: datetime
    ended_at: Optional[datetime]
    duration_seconds: int

class PhoneNumberResponse(BaseModel):
    id: int
    phone_number: str
    user_id: Optional[int]
    is_active: bool
    created_at: datetime

class JoinCallRequest(BaseModel):
    call_id: str
    phone_number: str
    user_id: Optional[int] = None

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(
    title="LiveKit Call Service",
    description="Voice and video calling service with LiveKit integration",
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

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Optional bearer token auth (set LIVEKIT_SERVICE_TOKEN to enable)
SERVICE_TOKEN = os.getenv("LIVEKIT_SERVICE_TOKEN")

def require_service_auth(authorization: str | None = Header(default=None)):
    if not SERVICE_TOKEN:
        return True
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    token = authorization.split(" ", 1)[1]
    if token != SERVICE_TOKEN:
        raise HTTPException(status_code=403, detail="Forbidden")
    return True

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, call_id: str):
        await websocket.accept()
        self.active_connections[call_id] = websocket

    def disconnect(self, call_id: str):
        if call_id in self.active_connections:
            del self.active_connections[call_id]

    async def send_personal_message(self, message: str, call_id: str):
        if call_id in self.active_connections:
            await self.active_connections[call_id].send_text(message)

    async def broadcast_to_call(self, message: str, call_id: str):
        if call_id in self.active_connections:
            await self.active_connections[call_id].send_text(message)

manager = ConnectionManager()

# Utility functions
def generate_access_token(room_name: str, participant_name: str, can_publish: bool = True, can_subscribe: bool = True) -> str:
    """Generate LiveKit access token for a participant"""
    token = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
    token.with_identity(participant_name)
    
    # Create grants for the token
    grants = api.VideoGrants(
        room_join=True,
        room=room_name,
        can_publish=can_publish,
        can_subscribe=can_subscribe,
        can_publish_data=True
    )
    token.with_grants(grants)
    return token.to_jwt()

def generate_room_name() -> str:
    """Generate unique room name"""
    return f"call_{uuid.uuid4().hex[:12]}"

def generate_call_id() -> str:
    """Generate unique call ID"""
    return f"call_{uuid.uuid4().hex[:8]}"

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "livekit-service"}

@app.post("/api/calls/initiate", response_model=CallResponse)
async def initiate_call(call_data: CallCreate, db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """Initiate a new call"""
    try:
        # Generate unique identifiers
        call_id = generate_call_id()
        room_name = generate_room_name()
        
        # Create call record
        call = Call(
            call_id=call_id,
            room_name=room_name,
            caller_phone=call_data.caller_phone,
            callee_phone=call_data.callee_phone,
            caller_user_id=call_data.caller_user_id,
            callee_user_id=call_data.callee_user_id,
            call_type=call_data.call_type,
            status="initiated"
        )
        
        db.add(call)
        db.commit()
        db.refresh(call)
        
        # Generate access token for caller
        access_token = generate_access_token(room_name, f"caller_{call_data.caller_phone}")
        
        return CallResponse(
            id=call.id,
            call_id=call.call_id,
            room_name=call.room_name,
            caller_phone=call.caller_phone,
            callee_phone=call.callee_phone,
            status=call.status,
            call_type=call.call_type,
            started_at=call.started_at,
            ended_at=call.ended_at,
            duration_seconds=call.duration_seconds,
            recording_url=call.recording_url,
            access_token=access_token,
            livekit_url=LIVEKIT_URL
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate call: {str(e)}")

@app.post("/api/calls/{call_id}/join", response_model=CallResponse)
async def join_call(call_id: str, join_data: JoinCallRequest, db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """Join an existing call"""
    try:
        # Get call details
        call = db.query(Call).filter(Call.call_id == call_id).first()
        if not call:
            raise HTTPException(status_code=404, detail="Call not found")
        
        if call.status == "ended":
            raise HTTPException(status_code=400, detail="Call has already ended")
        
        # Update call status if needed
        if call.status == "initiated":
            call.status = "ringing"
            db.commit()
        
        # Generate access token for participant
        participant_name = f"participant_{join_data.phone_number}"
        access_token = generate_access_token(call.room_name, participant_name)
        
        # Add participant record
        participant = CallParticipant(
            call_id=call_id,
            user_id=join_data.user_id,
            phone_number=join_data.phone_number,
            participant_id=participant_name
        )
        db.add(participant)
        db.commit()
        
        return CallResponse(
            id=call.id,
            call_id=call.call_id,
            room_name=call.room_name,
            caller_phone=call.caller_phone,
            callee_phone=call.callee_phone,
            status=call.status,
            call_type=call.call_type,
            started_at=call.started_at,
            ended_at=call.ended_at,
            duration_seconds=call.duration_seconds,
            recording_url=call.recording_url,
            access_token=access_token,
            livekit_url=LIVEKIT_URL
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to join call: {str(e)}")

@app.post("/api/calls/{call_id}/start")
async def start_call(call_id: str, db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """Mark call as active/started"""
    call = db.query(Call).filter(Call.call_id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    call.status = "active"
    db.commit()
    
    return {"message": "Call started", "call_id": call_id, "status": "active"}

@app.post("/api/calls/{call_id}/end")
async def end_call(call_id: str, db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """End a call"""
    call = db.query(Call).filter(Call.call_id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    call.status = "ended"
    call.ended_at = datetime.utcnow()
    
    # Calculate duration
    if call.started_at:
        duration = call.ended_at - call.started_at
        call.duration_seconds = int(duration.total_seconds())
    
    db.commit()
    
    return {"message": "Call ended", "call_id": call_id, "duration_seconds": call.duration_seconds}

@app.get("/api/calls/{call_id}", response_model=CallResponse)
async def get_call(call_id: str, db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """Get call details"""
    call = db.query(Call).filter(Call.call_id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    return CallResponse(
        id=call.id,
        call_id=call.call_id,
        room_name=call.room_name,
        caller_phone=call.caller_phone,
        callee_phone=call.callee_phone,
        status=call.status,
        call_type=call.call_type,
        started_at=call.started_at,
        ended_at=call.ended_at,
        duration_seconds=call.duration_seconds,
        recording_url=call.recording_url,
        access_token="",  # Not returned for security
        livekit_url=LIVEKIT_URL
    )

@app.get("/api/calls/history/{phone_number}", response_model=List[CallHistoryResponse])
async def get_call_history(phone_number: str, limit: int = 50, db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """Get call history for a phone number"""
    calls = db.query(Call).filter(
        (Call.caller_phone == phone_number) | (Call.callee_phone == phone_number)
    ).order_by(Call.started_at.desc()).limit(limit).all()
    
    return [
        CallHistoryResponse(
            id=call.id,
            call_id=call.call_id,
            caller_phone=call.caller_phone,
            callee_phone=call.callee_phone,
            status=call.status,
            call_type=call.call_type,
            started_at=call.started_at,
            ended_at=call.ended_at,
            duration_seconds=call.duration_seconds
        ) for call in calls
    ]

@app.post("/api/phone-numbers/register", response_model=PhoneNumberResponse)
async def register_phone_number(phone_number: str, user_id: Optional[int] = None, db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """Register a phone number for calling"""
    # Check if phone number already exists
    existing = db.query(PhoneNumber).filter(PhoneNumber.phone_number == phone_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    phone = PhoneNumber(
        phone_number=phone_number,
        user_id=user_id
    )
    
    db.add(phone)
    db.commit()
    db.refresh(phone)
    
    return PhoneNumberResponse(
        id=phone.id,
        phone_number=phone.phone_number,
        user_id=phone.user_id,
        is_active=phone.is_active,
        created_at=phone.created_at
    )

@app.get("/api/phone-numbers", response_model=List[PhoneNumberResponse])
async def list_phone_numbers(db: Session = Depends(get_db), _auth: bool = Depends(require_service_auth)):
    """List all registered phone numbers"""
    phones = db.query(PhoneNumber).filter(PhoneNumber.is_active == True).all()
    
    return [
        PhoneNumberResponse(
            id=phone.id,
            phone_number=phone.phone_number,
            user_id=phone.user_id,
            is_active=phone.is_active,
            created_at=phone.created_at
        ) for phone in phones
    ]

@app.websocket("/ws/calls/{call_id}")
async def websocket_endpoint(websocket: WebSocket, call_id: str):
    """WebSocket endpoint for real-time call updates"""
    await manager.connect(websocket, call_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages (call controls, etc.)
            message = json.loads(data)
            
            # Broadcast to other participants in the call
            await manager.broadcast_to_call(json.dumps(message), call_id)
    
    except WebSocketDisconnect:
        manager.disconnect(call_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)

