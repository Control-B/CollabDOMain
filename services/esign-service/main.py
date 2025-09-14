from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import base64
import io
from PIL import Image, ImageDraw, ImageFont
import fitz  # PyMuPDF
from dotenv import load_dotenv
import hashlib
import qrcode

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://collab:collab@localhost:5432/collab")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Document(Base):
    __tablename__ = "esign_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, unique=True, index=True, nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_hash = Column(String, nullable=False)  # For integrity verification
    uploaded_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="draft")  # draft, sent, signed, completed, cancelled

class Envelope(Base):
    __tablename__ = "envelopes"
    
    id = Column(Integer, primary_key=True, index=True)
    envelope_id = Column(String, unique=True, index=True, nullable=False)
    document_id = Column(String, ForeignKey("esign_documents.document_id"))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String, default="created")  # created, sent, signed, completed, cancelled
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    document = relationship("Document")
    recipients = relationship("EnvelopeRecipient", back_populates="envelope")
    signatures = relationship("Signature", back_populates="envelope")

class EnvelopeRecipient(Base):
    __tablename__ = "envelope_recipients"
    
    id = Column(Integer, primary_key=True, index=True)
    envelope_id = Column(String, ForeignKey("envelopes.envelope_id"))
    recipient_type = Column(String, nullable=False)  # email, phone, user_id
    recipient_value = Column(String, nullable=False)  # email address, phone number, or user ID
    recipient_name = Column(String, nullable=False)
    role = Column(String, default="signer")  # signer, cc, approver
    order = Column(Integer, default=1)
    status = Column(String, default="pending")  # pending, sent, viewed, signed, declined
    signed_at = Column(DateTime, nullable=True)
    
    # Relationships
    envelope = relationship("Envelope", back_populates="recipients")

class Signature(Base):
    __tablename__ = "signatures"
    
    id = Column(Integer, primary_key=True, index=True)
    signature_id = Column(String, unique=True, index=True, nullable=False)
    envelope_id = Column(String, ForeignKey("envelopes.envelope_id"))
    recipient_id = Column(Integer, ForeignKey("envelope_recipients.id"))
    signature_type = Column(String, nullable=False)  # drawn, typed, uploaded, initials
    signature_data = Column(LargeBinary, nullable=True)  # Base64 encoded signature image
    signature_text = Column(String, nullable=True)  # For typed signatures
    position_x = Column(Integer, nullable=False)
    position_y = Column(Integer, nullable=False)
    page_number = Column(Integer, nullable=False)
    width = Column(Integer, default=200)
    height = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    envelope = relationship("Envelope", back_populates="signatures")
    recipient = relationship("EnvelopeRecipient")

class SignatureTemplate(Base):
    __tablename__ = "signature_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    template_name = Column(String, nullable=False)
    signature_type = Column(String, nullable=False)  # drawn, typed, uploaded
    signature_data = Column(LargeBinary, nullable=True)
    signature_text = Column(String, nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class DocumentUpload(BaseModel):
    filename: str
    title: Optional[str] = None
    message: Optional[str] = None

class CreateEnvelopeRequest(BaseModel):
    document_id: str
    title: str
    message: Optional[str] = None
    recipients: List[Dict[str, Any]]
    expires_in_days: Optional[int] = 30

class SignatureRequest(BaseModel):
    signature_type: str  # drawn, typed, uploaded, initials
    signature_data: Optional[str] = None  # Base64 encoded image
    signature_text: Optional[str] = None  # For typed signatures
    position_x: int
    position_y: int
    page_number: int
    width: int = 200
    height: int = 100

class SignatureTemplateRequest(BaseModel):
    template_name: str
    signature_type: str
    signature_data: Optional[str] = None
    signature_text: Optional[str] = None
    is_default: bool = False

# FastAPI app
app = FastAPI(
    title="E-Signature Service",
    description="Advanced digital signature and document management system",
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

# Utility functions
def generate_document_id():
    return f"doc_{uuid.uuid4().hex[:12]}"

def generate_envelope_id():
    return f"env_{uuid.uuid4().hex[:12]}"

def generate_signature_id():
    return f"sig_{uuid.uuid4().hex[:12]}"

def calculate_file_hash(file_content: bytes) -> str:
    return hashlib.sha256(file_content).hexdigest()

def generate_typed_signature(text: str, font_size: int = 24) -> str:
    """Generate a signature image from typed text"""
    # Create image with transparent background
    img = Image.new('RGBA', (400, 100), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fallback to default
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (400 - text_width) // 2
    y = (100 - text_height) // 2
    
    # Draw the text
    draw.text((x, y), text, fill=(0, 0, 0, 255), font=font)
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str

def generate_initials(text: str, font_size: int = 20) -> str:
    """Generate initials from text"""
    words = text.split()
    initials = ''.join([word[0].upper() for word in words if word])
    return generate_typed_signature(initials, font_size)

def apply_signature_to_pdf(pdf_path: str, signature_data: str, x: int, y: int, page_num: int, width: int = 200, height: int = 100) -> str:
    """Apply signature to PDF document"""
    # Open PDF
    doc = fitz.open(pdf_path)
    page = doc[page_num - 1]  # PyMuPDF uses 0-based indexing
    
    # Decode signature image
    signature_bytes = base64.b64decode(signature_data)
    
    # Create image from bytes
    img = Image.open(io.BytesIO(signature_bytes))
    img = img.resize((width, height))
    
    # Convert to bytes
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='PNG')
    img_bytes = img_buffer.getvalue()
    
    # Insert image into PDF
    rect = fitz.Rect(x, y, x + width, y + height)
    page.insert_image(rect, stream=img_bytes)
    
    # Save modified PDF
    output_path = f"temp_signed_{uuid.uuid4().hex[:8]}.pdf"
    doc.save(output_path)
    doc.close()
    
    return output_path

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "esign-service"}

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(None),
    uploaded_by: int = Form(...),
    db: Session = Depends(get_db)
):
    """Upload a document for signing"""
    try:
        # Read file content
        content = await file.read()
        file_hash = calculate_file_hash(content)
        
        # Generate document ID
        document_id = generate_document_id()
        
        # Save file
        file_path = f"documents/{document_id}_{file.filename}"
        os.makedirs("documents", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Create document record
        document = Document(
            document_id=document_id,
            filename=file.filename,
            file_path=file_path,
            file_hash=file_hash,
            uploaded_by=uploaded_by
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return {
            "message": "Document uploaded successfully",
            "document_id": document_id,
            "filename": file.filename,
            "file_hash": file_hash
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")

@app.post("/api/envelopes/create")
async def create_envelope(
    request: CreateEnvelopeRequest,
    created_by: int,
    db: Session = Depends(get_db)
):
    """Create a signing envelope"""
    try:
        # Verify document exists
        document = db.query(Document).filter(Document.document_id == request.document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Generate envelope ID
        envelope_id = generate_envelope_id()
        
        # Calculate expiration date
        expires_at = datetime.utcnow() + timedelta(days=request.expires_in_days) if request.expires_in_days else None
        
        # Create envelope
        envelope = Envelope(
            envelope_id=envelope_id,
            document_id=request.document_id,
            title=request.title,
            message=request.message,
            created_by=created_by,
            expires_at=expires_at
        )
        
        db.add(envelope)
        db.flush()  # Get the envelope ID
        
        # Add recipients
        for i, recipient_data in enumerate(request.recipients):
            recipient = EnvelopeRecipient(
                envelope_id=envelope_id,
                recipient_type=recipient_data.get("type", "email"),
                recipient_value=recipient_data["value"],
                recipient_name=recipient_data["name"],
                role=recipient_data.get("role", "signer"),
                order=i + 1
            )
            db.add(recipient)
        
        db.commit()
        db.refresh(envelope)
        
        return {
            "message": "Envelope created successfully",
            "envelope_id": envelope_id,
            "status": envelope.status,
            "expires_at": envelope.expires_at
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create envelope: {str(e)}")

@app.post("/api/envelopes/{envelope_id}/sign")
async def sign_document(
    envelope_id: str,
    signature_request: SignatureRequest,
    recipient_id: int,
    db: Session = Depends(get_db)
):
    """Add signature to document"""
    try:
        # Get envelope and recipient
        envelope = db.query(Envelope).filter(Envelope.envelope_id == envelope_id).first()
        if not envelope:
            raise HTTPException(status_code=404, detail="Envelope not found")
        
        recipient = db.query(EnvelopeRecipient).filter(
            EnvelopeRecipient.id == recipient_id,
            EnvelopeRecipient.envelope_id == envelope_id
        ).first()
        if not recipient:
            raise HTTPException(status_code=404, detail="Recipient not found")
        
        # Generate signature
        signature_data = None
        if signature_request.signature_type == "typed" and signature_request.signature_text:
            signature_data = generate_typed_signature(signature_request.signature_text)
        elif signature_request.signature_type == "initials" and signature_request.signature_text:
            signature_data = generate_initials(signature_request.signature_text)
        elif signature_request.signature_type in ["drawn", "uploaded"] and signature_request.signature_data:
            signature_data = signature_request.signature_data
        else:
            raise HTTPException(status_code=400, detail="Invalid signature data")
        
        # Create signature record
        signature = Signature(
            signature_id=generate_signature_id(),
            envelope_id=envelope_id,
            recipient_id=recipient_id,
            signature_type=signature_request.signature_type,
            signature_data=base64.b64decode(signature_data) if signature_data else None,
            signature_text=signature_request.signature_text,
            position_x=signature_request.position_x,
            position_y=signature_request.position_y,
            page_number=signature_request.page_number,
            width=signature_request.width,
            height=signature_request.height
        )
        
        db.add(signature)
        
        # Update recipient status
        recipient.status = "signed"
        recipient.signed_at = datetime.utcnow()
        
        # Check if all recipients have signed
        all_signed = db.query(EnvelopeRecipient).filter(
            EnvelopeRecipient.envelope_id == envelope_id,
            EnvelopeRecipient.role == "signer"
        ).all()
        
        if all(r.status == "signed" for r in all_signed):
            envelope.status = "completed"
            envelope.completed_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "message": "Document signed successfully",
            "signature_id": signature.signature_id,
            "envelope_status": envelope.status
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sign document: {str(e)}")

@app.get("/api/envelopes/{envelope_id}")
async def get_envelope(envelope_id: str, db: Session = Depends(get_db)):
    """Get envelope details"""
    envelope = db.query(Envelope).filter(Envelope.envelope_id == envelope_id).first()
    if not envelope:
        raise HTTPException(status_code=404, detail="Envelope not found")
    
    recipients = db.query(EnvelopeRecipient).filter(
        EnvelopeRecipient.envelope_id == envelope_id
    ).all()
    
    return {
        "envelope_id": envelope.envelope_id,
        "title": envelope.title,
        "message": envelope.message,
        "status": envelope.status,
        "created_at": envelope.created_at,
        "expires_at": envelope.expires_at,
        "completed_at": envelope.completed_at,
        "recipients": [
            {
                "id": r.id,
                "name": r.recipient_name,
                "type": r.recipient_type,
                "value": r.recipient_value,
                "role": r.role,
                "status": r.status,
                "signed_at": r.signed_at
            } for r in recipients
        ]
    }

@app.get("/api/envelopes/{envelope_id}/download")
async def download_signed_document(envelope_id: str, db: Session = Depends(get_db)):
    """Download the signed document"""
    envelope = db.query(Envelope).filter(Envelope.envelope_id == envelope_id).first()
    if not envelope:
        raise HTTPException(status_code=404, detail="Envelope not found")
    
    if envelope.status != "completed":
        raise HTTPException(status_code=400, detail="Document not fully signed yet")
    
    # Get all signatures for this envelope
    signatures = db.query(Signature).filter(Signature.envelope_id == envelope_id).all()
    
    # Apply signatures to PDF
    document = envelope.document
    signed_pdf_path = document.file_path
    
    for signature in signatures:
        signature_data = base64.b64encode(signature.signature_data).decode() if signature.signature_data else None
        if signature_data:
            signed_pdf_path = apply_signature_to_pdf(
                signed_pdf_path,
                signature_data,
                signature.position_x,
                signature.position_y,
                signature.page_number,
                signature.width,
                signature.height
            )
    
    # Return file path (in production, this would be a proper file download)
    return {"signed_document_path": signed_pdf_path}

@app.post("/api/signature-templates")
async def create_signature_template(
    request: SignatureTemplateRequest,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Create a signature template"""
    try:
        # Generate signature data if needed
        signature_data = None
        if request.signature_type == "typed" and request.signature_text:
            signature_data = generate_typed_signature(request.signature_text)
        elif request.signature_type == "initials" and request.signature_text:
            signature_data = generate_initials(request.signature_text)
        elif request.signature_type in ["drawn", "uploaded"] and request.signature_data:
            signature_data = request.signature_data
        
        # If setting as default, unset other defaults for this user
        if request.is_default:
            db.query(SignatureTemplate).filter(
                SignatureTemplate.user_id == user_id,
                SignatureTemplate.is_default == True
            ).update({"is_default": False})
        
        # Create template
        template = SignatureTemplate(
            template_id=f"tpl_{uuid.uuid4().hex[:12]}",
            user_id=user_id,
            template_name=request.template_name,
            signature_type=request.signature_type,
            signature_data=base64.b64decode(signature_data) if signature_data else None,
            signature_text=request.signature_text,
            is_default=request.is_default
        )
        
        db.add(template)
        db.commit()
        db.refresh(template)
        
        return {
            "message": "Signature template created successfully",
            "template_id": template.template_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create signature template: {str(e)}")

@app.get("/api/signature-templates/{user_id}")
async def get_signature_templates(user_id: int, db: Session = Depends(get_db)):
    """Get user's signature templates"""
    templates = db.query(SignatureTemplate).filter(
        SignatureTemplate.user_id == user_id
    ).all()
    
    return [
        {
            "template_id": t.template_id,
            "template_name": t.template_name,
            "signature_type": t.signature_type,
            "signature_text": t.signature_text,
            "is_default": t.is_default,
            "created_at": t.created_at
        } for t in templates
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)


