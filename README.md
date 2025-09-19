# CollabDOMain - Slack-Style Collaboration for Trucking

🚛 **Real-Time Collaboration Platform for the Trucking Industry**

[![DigitalOcean](https://img.shields.io/badge/Platform-DigitalOcean-0080FF?style=for-the-badge&logo=digitalocean)](https://www.digitalocean.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

## 🎯 Overview

CollabDOMain brings **Slack-like real-time collaboration** to the trucking industry with core features including automatic geofencing check-ins, integrated document management with e-signing, and enhanced supply chain visibility. Additional advanced features include predictive analytics, intelligent scheduling, and automated workflow management.

### ✨ Core Features

- 💬 **Slack-Style Collaboration** - Real-time chat, voice, and video communication for trucking teams
- 🎯 **Automatic Geofencing Check-ins** - Location-based automation and smart notifications  
- 📄 **Document Management & E-Signing** - Digital workflow with integrated signatures and compliance
- 🚛 **Fleet Communication** - Channel-based communication for drivers, dispatchers, and warehouse teams

### 🚀 Enhanced Features (Bonus)

- 📍 **Predictive ETA System** - Traffic-aware arrival predictions with ML insights
- 📅 **Smart Appointment Scheduling** - Intelligent dock assignment and capacity optimization  
- 🚛 **Real-Time Asset Tracking** - GPS-based trailer management with geofenced zones
- ⚠️ **Exception Management** - Automated delay detection and escalation
- 📊 **Comprehensive Analytics** - Real-time dashboards and performance metrics

## 🏗️ Architecture

### **Microservices Stack**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Frontend      │  │   API Gateway   │  │   Auth Service  │
│   (Next.js)     │  │   (FastAPI)     │  │   (FastAPI)     │
│   Port 3000     │  │   Port 8000     │  │   Port 8001     │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   ETA Service   │  │ Appointment Svc │  │ Yard Management │
│   (FastAPI)     │  │   (FastAPI)     │  │   (FastAPI)     │
│   Port 8005     │  │   Port 8006     │  │   Port 8007     │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   DMS Core      │  │  Chat Service   │  │   Geofence Svc  │
│   (C# .NET)     │  │   (Elixir)      │  │   (FastAPI)     │
│   Port 5000     │  │   Port 4000     │  │   Port 8004     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### **Technology Stack**

#### **Backend Services**
- **FastAPI** - High-performance Python APIs with automatic documentation
- **C# .NET Core** - Main DMS API with Entity Framework
- **Elixir Phoenix** - Real-time WebSocket connections for chat
- **PostgreSQL** - Primary database with advanced indexing
- **Redis** - Caching and session management

#### **Frontend**
- **Next.js 14** - React framework with app router
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development
- **Real-time Updates** - WebSocket integration

#### **Infrastructure**
- **DigitalOcean Spaces** - S3-compatible object storage
- **DigitalOcean Managed PostgreSQL** - Scalable database cluster
- **DigitalOcean App Platform** - Container deployment
- **Docker** - Containerized microservices

## 🚀 Quick Start

### **Prerequisites**
- Docker & Docker Compose
- Node.js 18+
- .NET 7+
- Elixir 1.15+

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/yourusername/CollabDOMain.git
cd CollabDOMain

# Copy environment configuration
cp config/digitalocean.env.example .env

# Start all services
docker-compose -f docker-compose-microservices.yml up

# Services will be available at:
# - Frontend: http://localhost:3000
# - API Gateway: http://localhost:8000
# - DMS Core: http://localhost:5000
# - Chat Service: http://localhost:4000
```

### **DigitalOcean Deployment**
```bash
# Configure DigitalOcean credentials
export DO_TOKEN="your-digitalocean-token"

# Deploy to DigitalOcean App Platform
doctl apps create --spec .do/app.yaml

# Or use the deployment script
./deploy/digitalocean-deploy.sh
```

## 📡 API Documentation

### **Core Endpoints**

#### **Locations Management**
```bash
# List locations
GET /api/locations

# Create location
POST /api/locations
{
  "name": "Tampa Distribution Center",
  "timeZone": "America/New_York",
  "address": "123 Logistics Ave, Tampa, FL",
  "geojsonGate": "{\"type\":\"Point\",\"coordinates\":[-82.4572,27.9506]}"
}
```

#### **Appointment Scheduling**
```bash
# Create appointment
POST /api/appointments
{
  "locationId": "uuid",
  "carrierId": "uuid", 
  "windowStart": "2025-01-20T08:00:00Z",
  "windowEnd": "2025-01-20T10:00:00Z",
  "priority": 7
}

# Check availability
POST /api/slots/availability
{
  "location_id": "uuid",
  "start_date": "2025-01-20T06:00:00Z",
  "end_date": "2025-01-20T18:00:00Z",
  "duration_minutes": 120
}
```

#### **ETA Tracking**
```bash
# Update ETA
POST /api/eta/update
{
  "appointment_id": "uuid",
  "eta": "2025-01-20T09:30:00Z",
  "source": "device",
  "confidence": 0.85,
  "current_latitude": 28.0,
  "current_longitude": -82.5
}
```

#### **Asset Management**
```bash
# Register trailer
POST /api/trailers
{
  "carrierId": "uuid",
  "equipmentType": "van",
  "plate": "FL123ABC"
}

# Update location
POST /api/trailers/location
{
  "trailer_id": "uuid",
  "latitude": 27.9506,
  "longitude": -82.4572
}
```

### **Interactive API Docs**
- **ETA Service**: http://localhost:8005/docs
- **Appointment Service**: http://localhost:8006/docs  
- **Yard Management**: http://localhost:8007/docs
- **DMS Core**: http://localhost:5000/swagger

## 🌊 DigitalOcean Configuration

### **Environment Variables**
```bash
# Database
DO_DATABASE_URL=postgresql://user:pass@your-cluster.db.ondigitalocean.com:25060/db

# Storage
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_ACCESS_KEY=your-access-key
DO_SPACES_SECRET_KEY=your-secret-key

# Redis
DO_REDIS_URL=rediss://redis-cluster.db.ondigitalocean.com:25061

# Functions
DO_FUNCTION_DOCUMENT_PROCESSOR=https://faas-nyc1-xxx.doserverless.co/...
DO_FUNCTION_NOTIFICATION_SENDER=https://faas-nyc1-xxx.doserverless.co/...
```

### **App Platform Spec**
```yaml
name: collabdomain
services:
- name: api-gateway
  source_dir: /services/api-gateway
  github:
    repo: yourusername/CollabDOMain
    branch: main
  run_command: uvicorn main:app --host 0.0.0.0 --port 8080
  http_port: 8080
  instance_count: 1
  instance_size_slug: basic-xxs

- name: frontend
  source_dir: /apps/landing
  github:
    repo: yourusername/CollabDOMain
    branch: main
  build_command: npm run build
  run_command: npm start
  http_port: 3000
  instance_count: 1
  instance_size_slug: basic-xxs
```

## 📱 Mobile & Desktop Integration

### **GPS Location Tracking**
```javascript
// Real-time location updates
const updateLocation = async (appointmentId, position) => {
  await fetch('/api/eta/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appointment_id: appointmentId,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed_mph: position.coords.speed * 2.237,
      timestamp: new Date().toISOString()
    })
  });
};

// Auto-update every 30 seconds
navigator.geolocation.watchPosition(updateLocation);
```

### **Real-Time Notifications**
```javascript
// WebSocket integration
const socket = new WebSocket('ws://localhost:4000/socket');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.event === 'eta_update') {
    updateETADisplay(data.appointment_id, data.new_eta);
  }
};
```

## 🔒 Security & Compliance

### **Authentication**
- **JWT-based** authentication with role-based access control
- **Multi-tenant** data isolation by organization
- **API rate limiting** and request validation
- **Secure headers** and CORS configuration

### **Data Protection**
- **Encrypted** data at rest and in transit
- **Audit logging** for all user actions
- **GDPR compliance** with data retention policies
- **SOC 2** ready infrastructure on DigitalOcean

## 📊 Performance & Monitoring

### **Metrics**
- **Response time** monitoring across all services
- **Database performance** with query optimization
- **Real-time dashboards** via integrated analytics
- **Exception tracking** with automated alerts

### **Scalability**
- **Horizontal scaling** with container orchestration
- **Database connection pooling** and caching
- **CDN integration** for static assets
- **Load balancing** across service instances

## 🔄 Development Workflow

### **Git Workflow**
```bash
# Feature development
git checkout -b feature/new-logistics-feature
git commit -m "feat: add smart routing algorithm"
git push origin feature/new-logistics-feature

# Create PR → Review → Merge → Auto-deploy
```

### **Testing**
```bash
# Unit tests
npm test                    # Frontend tests
dotnet test                 # C# API tests  
mix test                    # Elixir tests
pytest services/*/test_*.py # Python service tests

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### **Database Migrations**
```bash
# C# Entity Framework
dotnet ef migrations add "AddLogisticsModels"
dotnet ef database update

# Elixir Ecto
mix ecto.gen.migration add_chat_enhancements
mix ecto.migrate
```

## 📚 Documentation

- **[C3-Hive Enhancements](./docs/C3_HIVE_ENHANCEMENTS.md)** - Complete technical documentation
- **[API Reference](./docs/API.md)** - Detailed endpoint documentation  
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - DigitalOcean setup instructions
- **[Development Setup](./docs/DEVELOPMENT.md)** - Local development guide

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/CollabDOMain/issues)
- **Discord**: [Join our community](https://discord.gg/collabdomain)
- **Email**: support@dispatchar.com

## 🎉 Acknowledgments

- **DigitalOcean** for cloud infrastructure
- **FastAPI** for high-performance APIs
- **Next.js** for the amazing frontend framework
- **Elixir/Phoenix** for real-time capabilities
- **The logistics community** for inspiring this platform

---

**Ready for Production Deployment on DigitalOcean! 🚀**

Made with ❤️ for the logistics community