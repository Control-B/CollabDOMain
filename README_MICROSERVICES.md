# CollabAzure Microservices Architecture

## 🎯 Overview

This project has been restructured into a clean microservices architecture using FastAPI, providing better separation of concerns, scalability, and maintainability.

## 🏗️ Architecture

### Backend Services (FastAPI)

| Service              | Port | Description                                          |
| -------------------- | ---- | ---------------------------------------------------- |
| **API Gateway**      | 8000 | Central entry point, request routing, authentication |
| **Auth Service**     | 8001 | User authentication, JWT tokens, user management     |
| **DMS Service**      | 8002 | Document upload/download, file management            |
| **E-Sign Service**   | 8003 | Digital signatures, document signing workflows       |
| **Geofence Service** | 8004 | Location tracking, geofencing, check-ins             |
| **Trip Service**     | 8005 | Trip management, driver assignments                  |
| **LiveKit Service**  | 8006 | Voice/video calls, call management                   |
| **Chat Service**     | 4000 | Real-time messaging (Elixir/Phoenix)                 |

### Frontend Applications

| Application | Port | Technology | Description                                                                       |
| ----------- | ---- | ---------- | --------------------------------------------------------------------------------- |
| **Web App** | 3000 | Next.js    | Admin dashboard, document management, e-signatures, geofencing, voice/video calls |

### Infrastructure

| Service            | Port | Description                               |
| ------------------ | ---- | ----------------------------------------- |
| **PostgreSQL**     | 5432 | Primary database                          |
| **Redis**          | 6379 | Caching and session storage               |
| **LiveKit Server** | 7880 | WebRTC media server for voice/video calls |

## 🚀 Quick Start

### 1. Start All Services

```bash
# Make the script executable (if not already)
chmod +x start-microservices.sh

# Start all microservices
./start-microservices.sh
```

### 2. Access Services

- **API Gateway**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Web App**: http://localhost:3000

### 3. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Register a new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test Voice/Video Calls

```bash
# Register a phone number
curl -X POST http://localhost:8000/api/phone-numbers/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "user_id": 1
  }'

# Initiate a call
curl -X POST http://localhost:8000/api/calls/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "caller_phone": "+1234567890",
    "callee_phone": "+0987654321",
    "call_type": "video"
  }'

# Get call history
curl http://localhost:8000/api/calls/history/+1234567890
```

## 🔧 Development

### Individual Service Development

Each service can be developed independently:

```bash
# Auth Service
cd services/auth-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

# DMS Service
cd services/dms-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8002

# API Gateway
cd services/api-gateway
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Database Management

```bash
# Connect to PostgreSQL
docker exec -it collabazure_postgres_1 psql -U collab -d collab

# View logs
docker-compose -f docker-compose-microservices.yml logs -f
```

## 📊 API Endpoints

### Authentication Service (8001)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - List users (admin)

### Document Management Service (8002)

- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List documents
- `GET /api/documents/{id}` - Get document details
- `GET /api/documents/{id}/download` - Download document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

### API Gateway (8000)

All services are accessible through the gateway:

- `http://localhost:8000/api/auth/*` → Auth Service
- `http://localhost:8000/api/documents/*` → DMS Service
- `http://localhost:8000/api/signatures/*` → E-Sign Service
- `http://localhost:8000/api/geofence/*` → Geofence Service
- `http://localhost:8000/api/trips/*` → Trip Service

## 🔒 Security

- JWT tokens for authentication
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Secure password hashing with bcrypt
- API rate limiting (configurable)

## 📈 Benefits of This Architecture

1. **Independence**: Each service can be developed, deployed, and scaled independently
2. **Technology Diversity**: Each service can use the best technology for its purpose
3. **Fault Isolation**: Failure in one service doesn't affect others
4. **Scalability**: Services can be scaled based on demand
5. **Maintainability**: Smaller, focused codebases are easier to maintain
6. **Team Autonomy**: Different teams can work on different services

## 🛠️ Adding New Services

1. Create new service directory in `services/`
2. Add FastAPI application with proper structure
3. Update `docker-compose-microservices.yml`
4. Add routing in API Gateway
5. Update this README

## 📝 Environment Variables

Create `.env` files in each service directory:

```bash
# Database
DATABASE_URL=postgresql://collab:collab@localhost:5432/collab

# JWT
SECRET_KEY=your-super-secret-key-change-in-production

# Service URLs
API_GATEWAY_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 8000-8005, 3000, 4000, 5432, 6379 are available
2. **Database connection**: Ensure PostgreSQL is running and accessible
3. **CORS issues**: Check CORS configuration in API Gateway

### Logs

```bash
# View all logs
docker-compose -f docker-compose-microservices.yml logs -f

# View specific service logs
docker-compose -f docker-compose-microservices.yml logs -f auth-service
```

## 🚀 Production Deployment

For production deployment:

1. Update environment variables
2. Use production database
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Configure load balancing
6. Set up monitoring and logging

## 📚 Documentation

- [Microservices Architecture Design](./MICROSERVICES_ARCHITECTURE.md)
- [API Documentation](http://localhost:8000/docs) (when running)
- [Original Architecture](./ARCHITECTURE.md)

## 🤝 Contributing

1. Each service should be developed independently
2. Follow FastAPI best practices
3. Add proper error handling and validation
4. Write tests for new features
5. Update documentation

---

**Note**: This is a clean, modern microservices architecture that replaces the previous monolithic structure. Each service is independent and can be developed, tested, and deployed separately.
