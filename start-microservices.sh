#!/bin/bash

echo "🚀 Starting CollabAzure Microservices Architecture"
echo "=================================================="

# Stop any existing services
echo "🛑 Stopping existing services..."
docker-compose -f docker-compose-microservices.yml down

# Start the microservices
echo "🏗️  Starting microservices..."
docker-compose -f docker-compose-microservices.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# API Gateway
echo "📡 API Gateway (Port 8000):"
curl -s http://localhost:8000/health || echo "❌ API Gateway not ready"

# Auth Service
echo "🔐 Auth Service (Port 8001):"
curl -s http://localhost:8001/health || echo "❌ Auth Service not ready"

# DMS Service
echo "📄 Document Management Service (Port 8002):"
curl -s http://localhost:8002/health || echo "❌ DMS Service not ready"

echo ""
echo "✅ Microservices are starting up!"
echo ""
echo "🌐 Available Services:"
echo "   • API Gateway: http://localhost:8000"
echo "   • API Documentation: http://localhost:8000/docs"
echo "   • Auth Service: http://localhost:8001"
echo "   • DMS Service: http://localhost:8002"
echo "   • Web App: http://localhost:3000"
echo ""
echo "🔧 To view logs:"
echo "   docker-compose -f docker-compose-microservices.yml logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f docker-compose-microservices.yml down"
