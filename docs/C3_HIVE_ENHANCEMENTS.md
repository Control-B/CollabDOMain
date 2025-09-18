# C3-Hive Style Backend Enhancements

## Overview

This document outlines the comprehensive C3-Hive style enhancements added to the CollabAzure logistics platform. These enhancements provide advanced supply chain visibility, predictive analytics, and automated workflow management while preserving all existing functionality.

## 🎯 Key Features Added

### ✅ **Preserved Existing Features**

- ✅ Geofence check-in → arrive → auto-assign door flow
- ✅ Real-time chat (text, voice, video) via Elixir Phoenix Channels
- ✅ Document management & e-signature functionality
- ✅ Multi-tenant architecture with RBAC
- ✅ All existing API endpoints and frontend

### 🆕 **New C3-Hive Features**

#### 📍 **1. Predictive ETA System**

- **Device/Manual Location Updates**: Real-time GPS tracking from desktop/mobile
- **Traffic Factor Analysis**: Historical data-driven delay predictions
- **Hysteresis Logic**: Prevents ETA flapping with 10-minute threshold
- **Confidence Scoring**: GPS accuracy and movement-based reliability
- **Dwell Time Prediction**: Historical patterns for dock operations

#### 📅 **2. Smart Appointment & Dock Scheduling**

- **Intelligent Slot Recommendations**: Availability scoring algorithm
- **Dock Compatibility Matching**: Equipment type and capability checks
- **Auto-Assignment Logic**: Best dock selection with conflict resolution
- **Capacity Management**: Real-time dock utilization tracking
- **Priority-Based Scheduling**: 1-10 priority scale with weighted scoring

#### 🚛 **3. Yard & Trailer Management**

- **Real-Time Asset Tracking**: GPS-based trailer positioning
- **Geofenced Yard Zones**: Polygon-based zone boundaries
- **Automatic Spot Assignment**: Available parking spot allocation
- **Status Transitions**: Enroute → At Gate → In Yard → At Dock
- **Event-Driven Notifications**: Entry/exit alerts with webhooks

#### ⚠️ **4. Exception Management**

- **Automated Detection**: Late, early, no-show, over-dwell
- **Severity Classification**: Info, Warning, Critical levels
- **Audit Trail**: Complete exception lifecycle tracking
- **Integration Ready**: Webhook notifications for external systems

#### 📊 **5. Analytics & Event Logging**

- **Comprehensive Audit Trail**: All logistics events tracked
- **Performance Metrics**: Dwell times, delay patterns
- **Real-Time Dashboards**: Via existing chat integration
- **Traffic Pattern Learning**: Continuous improvement of predictions

## 🗄️ Database Schema Enhancements

### **New Core Tables**

```sql
-- Location and facility management
locations(id, org_id, name, tz, address, geojson_gate, geojson_yard, created_at)

-- Dock/door management
docks(id, location_id, door_no, capabilities, status, updated_at)

-- Appointment scheduling
appointments(id, location_id, carrier_id, po, ref_no, window_start, window_end,
           status, priority, dock_id, created_by, created_at)

-- Enhanced check-ins (extends geofence)
checkins(id, appointment_id, driver_id, method, at, gate_ref, latitude, longitude)

-- Asset tracking
trailers(id, carrier_id, equipment_type, plate, status, last_latitude,
        last_longitude, last_seen, created_at)

-- ETA prediction
eta_updates(id, appointment_id, source, eta, confidence, dwell_pred_minutes, created_at)

-- Business rules
slot_rules(id, location_id, dock_group, capacity_per_slot, slot_minutes, windows)
detention_policies(id, location_id, free_minutes, charge_per_hour)

-- Document workflow
documents(id, appointment_id, type, blob_url, signed_at, signer_role)

-- Comprehensive logging
events(id, location_id, type, ref_table, ref_id, payload, at)
exceptions(id, appointment_id, code, severity, opened_at, closed_at, notes)
```

## 🏗️ Service Architecture

### **Enhanced Microservices**

#### **1. ETA Service** (Port 8005)

- **Endpoints**:
  - `POST /api/eta/update` - Manual ETA updates
  - `POST /api/eta/ping` - GPS location pings
  - `GET /api/eta/{appointment_id}` - Current ETA
  - `GET /api/eta/location/{location_id}/traffic` - Traffic patterns
- **Features**:
  - Haversine distance calculations
  - Traffic factor analysis (1.0-1.5x multiplier)
  - Confidence scoring (0.0-1.0)
  - Webhook notifications for changes ≥10 minutes

#### **2. Appointment Service** (Port 8006)

- **Endpoints**:
  - `POST /api/appointments` - Create appointments
  - `GET /api/appointments` - List with filters
  - `POST /api/slots/availability` - Find available slots
  - `POST /api/docks` - Dock management
  - `POST /api/appointments/{id}/assign-dock` - Auto/manual assignment
- **Features**:
  - Availability scoring algorithm
  - Dock capability matching
  - Conflict resolution
  - 30-minute slot increments

#### **3. Yard Management Service** (Port 8007)

- **Endpoints**:
  - `POST /api/trailers` - Register trailers
  - `POST /api/trailers/location` - Location updates
  - `POST /api/yard-zones` - Create zones
  - `GET /api/yard-zones/{location_id}/occupancy` - Real-time occupancy
  - `GET /api/trailers/{id}/position` - Current position
- **Features**:
  - Point-in-polygon geofencing
  - Automatic spot assignment
  - Status transition automation
  - Event-driven notifications

### **Enhanced DMS Core** (Port 5000)

- **New Endpoints**:
  - `/api/locations` - Location management
  - `/api/appointments` - Appointment CRUD
  - `/api/trailers` - Trailer tracking
  - `/api/appointments/{id}/eta` - ETA management
  - `/events/inbound` - Service integration
- **Features**:
  - Unified API gateway
  - Multi-tenant data isolation
  - Real-time chat integration
  - Audit logging

## 🌊 DigitalOcean Migration

### **Infrastructure Changes**

#### **From Azure → To DigitalOcean**

```bash
# Database
Azure Postgres → DigitalOcean Managed PostgreSQL
Connection: postgresql://user:pass@your-cluster.db.ondigitalocean.com:25060/db

# Storage
Azure Blob → DigitalOcean Spaces (S3-compatible)
Endpoint: https://nyc3.digitaloceanspaces.com

# Functions
Azure Functions → DigitalOcean Functions
Serverless: https://faas-nyc1-xxx.doserverless.co/

# Cache/Messaging
Azure Service Bus → DigitalOcean Managed Redis
Connection: rediss://redis-cluster.db.ondigitalocean.com:25061
```

#### **Deployment Configuration**

```yaml
# docker-compose-microservices.yml
services:
  eta-service: # Port 8005
  appointment-service: # Port 8006
  yard-management: # Port 8007
  # ... existing services maintained
```

#### **Environment Configuration**

```bash
# config/digitalocean.env.example
DO_DATABASE_URL=postgresql://...
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_REDIS_URL=rediss://...
```

## 🔄 Data Flow & Integration

### **Real-Time Event Processing**

```mermaid
graph TB
    A[GPS Update] --> B[Yard Service]
    B --> C[Geofence Check]
    C --> D[Status Update]
    D --> E[Event Log]
    E --> F[Chat Notification]

    G[ETA Update] --> H[ETA Service]
    H --> I[Traffic Analysis]
    I --> J[Confidence Score]
    J --> K[Webhook Alert]

    L[Appointment Request] --> M[Appointment Service]
    M --> N[Dock Matching]
    N --> O[Auto Assignment]
    O --> P[Schedule Confirmation]
```

### **Service Communication**

- **Webhook Integration**: Services communicate via HTTP webhooks
- **Event Sourcing**: All events logged to central database
- **Real-Time Updates**: Chat service integration for live notifications
- **Idempotent Operations**: Safe retry mechanisms

## 🚀 Getting Started

### **1. Environment Setup**

```bash
# Copy DigitalOcean configuration
cp config/digitalocean.env.example .env

# Edit with your actual DigitalOcean credentials
vim .env
```

### **2. Database Migration**

```bash
# The enhanced models are automatically created via Entity Framework
# All existing data is preserved - no migration needed
```

### **3. Service Deployment**

```bash
# Start all enhanced services
docker-compose -f docker-compose-microservices.yml up

# Services will be available on:
# - ETA Service: http://localhost:8005
# - Appointment Service: http://localhost:8006
# - Yard Management: http://localhost:8007
# - DMS Core API: http://localhost:5000
```

### **4. API Testing**

```bash
# Test ETA service
curl -X GET http://localhost:8005/health

# Test appointment service
curl -X GET http://localhost:8006/health

# Test yard management
curl -X GET http://localhost:8007/health

# View API documentation
# Visit: http://localhost:8005/docs (FastAPI auto-docs)
```

## 📱 Mobile/Desktop Integration

### **GPS Location Updates**

```javascript
// Desktop/Mobile GPS integration
const updateLocation = async (appointmentId, position) => {
  await fetch('/api/eta/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appointment_id: appointmentId,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed_mph: position.coords.speed * 2.237, // m/s to mph
      accuracy_meters: position.coords.accuracy,
      timestamp: new Date().toISOString(),
    }),
  });
};

// Auto-update every 30 seconds when moving
navigator.geolocation.watchPosition(updateLocation, null, {
  enableHighAccuracy: true,
  maximumAge: 30000,
});
```

### **Real-Time Status Updates**

```javascript
// WebSocket integration with existing chat
const socket = new WebSocket('ws://localhost:4000/socket');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.event === 'eta_update') {
    // Update ETA display
    updateETADisplay(data.appointment_id, data.new_eta);
  }
  if (data.event === 'yard_entry') {
    // Show yard entry notification
    showNotification(`Trailer ${data.plate} entered ${data.zone_name}`);
  }
};
```

## 🔍 API Examples

### **Create Location**

```bash
curl -X POST http://localhost:5000/api/locations \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tampa Distribution Center",
    "timeZone": "America/New_York",
    "address": "123 Logistics Ave, Tampa, FL",
    "geojsonGate": "{\"type\":\"Point\",\"coordinates\":[-82.4572,27.9506]}"
  }'
```

### **Create Appointment**

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "location-uuid",
    "carrierId": "carrier-uuid",
    "po": "PO-12345",
    "windowStart": "2025-01-20T08:00:00Z",
    "windowEnd": "2025-01-20T10:00:00Z",
    "priority": 7
  }'
```

### **Update ETA**

```bash
curl -X POST http://localhost:8005/api/eta/update \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": "appointment-uuid",
    "eta": "2025-01-20T09:30:00Z",
    "source": "device",
    "confidence": 0.85,
    "current_latitude": 28.0,
    "current_longitude": -82.5,
    "speed_mph": 65
  }'
```

### **Check Slot Availability**

```bash
curl -X POST http://localhost:8006/api/slots/availability \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": "location-uuid",
    "start_date": "2025-01-20T06:00:00Z",
    "end_date": "2025-01-20T18:00:00Z",
    "duration_minutes": 120,
    "dock_requirements": {
      "equipment_type": "van",
      "height_feet": 13.5
    }
  }'
```

## 🔐 Security & Multi-Tenancy

### **Authentication & Authorization**

- **JWT-based auth**: Maintained from existing system
- **Org-level isolation**: All data scoped by `org_id`
- **Role-based permissions**: Dispatcher, Driver, Carrier, Admin
- **API rate limiting**: Built into FastAPI services

### **Data Privacy**

- **Tenant isolation**: Database queries filtered by organization
- **Audit logging**: All actions tracked with user context
- **Secure endpoints**: All APIs require valid JWT tokens
- **Input validation**: Pydantic models prevent injection attacks

## 📊 Performance & Scalability

### **Optimizations**

- **Database indices**: Optimized for common query patterns
- **Connection pooling**: SQLAlchemy async connections
- **Caching strategy**: Redis for frequently accessed data
- **Background tasks**: Non-blocking webhook processing
- **Horizontal scaling**: Stateless service design

### **Monitoring & Observability**

- **Health checks**: `/health` endpoints on all services
- **Structured logging**: JSON format for log aggregation
- **Metrics collection**: Ready for Prometheus integration
- **Error tracking**: Comprehensive exception handling
- **Performance monitoring**: Database query optimization

## 🔄 Future Roadmap

### **Phase 2 Enhancements** (Future)

- **Advanced Analytics**: ML-based delay prediction
- **Carrier Portal**: Self-service appointment booking
- **Exception Workflows**: Automated escalation rules
- **Document Gating**: Automated compliance checking
- **IoT Integration**: Sensor data for real-time visibility
- **ELD Integration**: Direct integration with fleet management systems

### **Platform Integrations** (Future)

- **TMS Integration**: SAP, Oracle, JDA connectivity
- **EDI Processing**: Automated document exchange
- **Third-party APIs**: Traffic, weather, port data
- **BI Connectors**: Power BI, Tableau dashboards
- **Mobile Apps**: Native iOS/Android applications

## 🛠️ Troubleshooting

### **Common Issues**

#### **Database Connection**

```bash
# Check PostgreSQL connection
docker exec -it postgres psql -U collab -d collab -c "\dt"

# Verify new tables exist
docker exec -it postgres psql -U collab -d collab -c "\d appointments"
```

#### **Service Health**

```bash
# Check all service health
curl http://localhost:8005/health  # ETA Service
curl http://localhost:8006/health  # Appointment Service
curl http://localhost:8007/health  # Yard Management
curl http://localhost:5000/health  # DMS Core
```

#### **API Documentation**

- ETA Service: http://localhost:8005/docs
- Appointment Service: http://localhost:8006/docs
- Yard Management: http://localhost:8007/docs
- DMS Core: http://localhost:5000/swagger

## 🎉 Success Metrics

The C3-Hive enhancements provide:

✅ **100% Backward Compatibility** - All existing functionality preserved  
✅ **Advanced Logistics Visibility** - Real-time tracking and predictive analytics  
✅ **Intelligent Automation** - Smart scheduling and dock assignment  
✅ **Scalable Architecture** - Microservices ready for DigitalOcean deployment  
✅ **Event-Driven Integration** - Seamless real-time notifications  
✅ **Enterprise-Grade Security** - Multi-tenant with comprehensive audit trails

**Ready for Production Deployment on DigitalOcean! 🚀**
