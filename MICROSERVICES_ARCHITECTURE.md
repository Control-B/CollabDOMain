# Microservices Architecture Design

## Overview

This document outlines the new microservices architecture for the CollabAzure application, replacing the current monolithic structure with independent, scalable services.

## Current Issues

- Monolithic mobile app with mixed concerns
- Tight coupling between features
- Difficult to maintain and scale
- Single point of failure
- Complex dependency management

## New Architecture

### 1. Backend Services (Independent APIs)

#### 1.1 Authentication Service

- **Technology**: FastAPI (Python)
- **Port**: 8001
- **Responsibilities**:
  - User authentication (JWT tokens)
  - User management
  - Role-based access control
  - Session management
  - Password hashing and validation

#### 1.2 Document Management Service (DMS)

- **Technology**: FastAPI (Python)
- **Port**: 8002
- **Responsibilities**:
  - Document upload/download
  - Document versioning
  - File storage (Azure Blob Storage)
  - Document metadata management
  - Document sharing and permissions
  - File type validation and processing

#### 1.3 E-Signature Service

- **Technology**: FastAPI (Python)
- **Port**: 8003
- **Responsibilities**:
  - Digital signature creation
  - Signature verification
  - Document signing workflows
  - Signature audit trails
  - Integration with document service
  - PDF manipulation and signing

#### 1.4 Geofencing Service

- **Technology**: FastAPI (Python)
- **Port**: 8004
- **Responsibilities**:
  - Location tracking
  - Geofence creation and management
  - Check-in/check-out events
  - Location-based notifications
  - Trip tracking
  - GPS coordinate processing

#### 1.5 Chat/Communication Service

- **Technology**: Elixir/Phoenix (existing)
- **Port**: 4000
- **Responsibilities**:
  - Real-time messaging
  - Channel management
  - Message history
  - Push notifications
  - WebSocket connections

#### 1.6 Trip Management Service

- **Technology**: FastAPI (Python)
- **Port**: 8005
- **Responsibilities**:
  - Trip creation and management
  - Trip sheets
  - Driver assignments
  - Trip status tracking
  - Integration with geofencing
  - Route optimization

#### 1.7 LiveKit Call Service

- **Technology**: FastAPI (Python)
- **Port**: 8006
- **Responsibilities**:
  - Voice and video call management
  - Call initiation and termination
  - Phone number registration
  - Call history tracking
  - LiveKit integration
  - WebRTC media handling
  - Call recording and playback

### 2. API Gateway

- **Technology**: FastAPI (Python)
- **Port**: 8000
- **Responsibilities**:
  - Request routing and load balancing
  - Authentication/authorization
  - Rate limiting and throttling
  - Request/response transformation
  - Service discovery
  - CORS handling
  - API documentation aggregation

### 3. Frontend Applications

#### 3.1 Web Application

- **Technology**: Next.js (existing)
- **Port**: 3000
- **Responsibilities**:
  - Admin dashboard
  - Document management UI
  - User management
  - Analytics and reporting
  - System configuration
  - E-signature interface
  - Geofencing management
  - Trip management
  - Voice and video calling interface
  - Call history and management

### 4. Shared Services

#### 4.1 Database Services

- **PostgreSQL**: Primary database (port 5432)
- **Redis**: Caching and session storage (port 6379)
- **Azurite**: Local blob storage (ports 10000-10002)

#### 4.2 Message Queue

- **Technology**: Redis Streams or Azure Service Bus
- **Responsibilities**:
  - Asynchronous communication
  - Event-driven architecture
  - Service decoupling

## Service Communication

### API Communication

- All services communicate via REST APIs
- JSON for data exchange
- HTTP/HTTPS protocols
- Standardized error responses

### Event-Driven Communication

- Services publish events for cross-service communication
- Event sourcing for audit trails
- Asynchronous processing

## Data Flow

```
Web App → API Gateway → Backend Services → Database
     ↓
Services → Message Queue → Other Services
```

## Benefits

1. **Independence**: Each service can be developed, deployed, and scaled independently
2. **Technology Diversity**: Each service can use the best technology for its purpose
3. **Fault Isolation**: Failure in one service doesn't affect others
4. **Scalability**: Services can be scaled based on demand
5. **Maintainability**: Smaller, focused codebases are easier to maintain
6. **Team Autonomy**: Different teams can work on different services

## Migration Strategy

1. **Phase 1**: Create new backend services with clean APIs
2. **Phase 2**: Implement API Gateway
3. **Phase 3**: Migrate web app to use new APIs
4. **Phase 4**: Decommission old monolithic components

## Security

- JWT tokens for authentication
- API keys for service-to-service communication
- HTTPS for all communications
- Input validation and sanitization
- Rate limiting and DDoS protection
- Audit logging for all operations
