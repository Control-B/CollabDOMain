from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import httpx
import asyncio
from typing import Dict, Any
import logging
from datetime import datetime
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CollabAzure API Gateway",
    description="Central API Gateway for CollabAzure Microservices",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Service registry
SERVICES = {
    "auth": "http://auth-service:8001",
    "dms": "http://dms-service:8002", 
    "esign": "http://esign-service:8003",
    "geofence": "http://geofence-service:8004",
    "trip": "http://trip-service:8005",
    "livekit": "http://livekit-service:8006",
    "chat": "http://chat-core:4000"
}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"]  # Configure appropriately for production
)

# HTTP client for making requests to services
http_client = httpx.AsyncClient(timeout=30.0)

@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("API Gateway starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources"""
    await http_client.aclose()
    logger.info("API Gateway shutting down...")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/services")
async def list_services():
    """List all available services"""
    return {"services": list(SERVICES.keys()), "endpoints": SERVICES}

async def forward_request(service_name: str, path: str, method: str, request: Request):
    """Forward request to appropriate service"""
    if service_name not in SERVICES:
        raise HTTPException(status_code=404, detail=f"Service '{service_name}' not found")
    
    service_url = SERVICES[service_name]
    target_url = f"{service_url}{path}"
    
    # Get request body if present
    body = None
    if method in ["POST", "PUT", "PATCH"]:
        body = await request.body()
    
    # Get headers (excluding host and content-length)
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    try:
        # Make request to target service
        response = await http_client.request(
            method=method,
            url=target_url,
            headers=headers,
            content=body,
            params=request.query_params
        )
        
        # Return response
        return JSONResponse(
            content=response.json() if response.headers.get("content-type", "").startswith("application/json") else {"data": response.text},
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Service timeout")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail=f"Service '{service_name}' unavailable")
    except Exception as e:
        logger.error(f"Error forwarding request to {service_name}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Authentication routes
@app.api_route("/api/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_proxy(path: str, request: Request):
    """Proxy requests to authentication service"""
    return await forward_request("auth", f"/api/auth/{path}", request.method, request)

# Document Management routes
@app.api_route("/api/documents/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def dms_proxy(path: str, request: Request):
    """Proxy requests to document management service"""
    return await forward_request("dms", f"/api/documents/{path}", request.method, request)

# E-Signature routes
@app.api_route("/api/signatures/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def esign_proxy(path: str, request: Request):
    """Proxy requests to e-signature service"""
    return await forward_request("esign", f"/api/signatures/{path}", request.method, request)

# Geofencing routes
@app.api_route("/api/geofence/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def geofence_proxy(path: str, request: Request):
    """Proxy requests to geofencing service"""
    return await forward_request("geofence", f"/api/geofence/{path}", request.method, request)

# Trip Management routes
@app.api_route("/api/trips/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def trip_proxy(path: str, request: Request):
    """Proxy requests to trip management service"""
    return await forward_request("trip", f"/api/trips/{path}", request.method, request)

# LiveKit Call routes
@app.api_route("/api/calls/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def livekit_proxy(path: str, request: Request):
    """Proxy requests to LiveKit call service"""
    return await forward_request("livekit", f"/api/calls/{path}", request.method, request)

# Chat routes
@app.api_route("/api/chat/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def chat_proxy(path: str, request: Request):
    """Proxy requests to chat service"""
    return await forward_request("chat", f"/api/chat/{path}", request.method, request)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
