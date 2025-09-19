# 🚀 CollabDOMain Deployment Instructions

## 📋 Overview

This guide walks you through deploying the complete **CollabDOMain Slack-style collaboration platform for trucking** to DigitalOcean. The platform provides real-time communication, automatic geofencing check-ins, and document management with e-signing, plus enhanced logistics features.

## 🎯 What We're Deploying

### ✅ **Complete Application Stack:**

#### **Backend Services (12 services):**

- 🎯 **Geofence Service** (Port 8004) - Location tracking and geofencing ✅
- 📍 **ETA Service** (Port 8005) - Predictive arrival tracking ✅
- 📅 **Appointment Service** (Port 8006) - Smart scheduling ✅
- 🚛 **Yard Management Service** (Port 8007) - Asset tracking ✅
- 🔐 **Auth Service** (Port 8001) - Authentication
- 📄 **DMS Service** (Port 8002) - Document management
- ✍️ **E-Sign Service** (Port 8003) - Digital signatures
- 🛣️ **Trip Service** (Port 8008) - Trip management
- 💬 **Chat Service** (Port 4000) - Real-time collaboration (Elixir)
- 🎬 **LiveKit Service** (Port 8009) - Video calling
- 🌐 **API Gateway** (Port 8000) - Service coordination
- ⚡ **DMS Core** (Port 5000) - Main C# API

#### **Frontend Applications:**

- 🎨 **Landing Page** (Next.js) - Marketing site with videos/animations
- 📱 **Web App** (Next.js) - Main application interface

#### **Database & Infrastructure:**

- 🗄️ **PostgreSQL** - Primary database with all C3-Hive enhancements
- 🔄 **Redis** - Caching and session management
- 📁 **File Storage** - Document and media uploads
- 🔒 **SSL/TLS** - HTTPS encryption ready

## 🎉 GitHub Repository

✅ **Successfully Created:** https://github.com/Control-B/CollabDOMain

The repository contains:

- Complete codebase with all services
- Docker configurations
- Deployment scripts
- Documentation
- Environment templates

## 🌊 DigitalOcean Deployment Options

### **Option 1: Manual Droplet Creation (Recommended)**

1. **Go to DigitalOcean Dashboard**

   - Login to your DigitalOcean account
   - Navigate to "Create" → "Droplets"

2. **Droplet Configuration:**

   ```
   Image: Docker 20.04 (LTS) x64
   Plan: Basic
   CPU Options: Regular Intel - $24/mo (2 vCPUs, 4 GB RAM, 80 GB SSD)
   Datacenter Region: New York 3 (nyc3) or closest to your users
   Authentication: SSH Key (recommended) or Password
   ```

3. **Advanced Options:**

   - ✅ Enable Monitoring
   - ✅ Enable IPv6
   - ✅ Enable Backups (recommended for production)
   - Add Tags: `collabdomain`, `production`, `logistics`

4. **Create Droplet**
   - Click "Create Droplet"
   - Note the IP address once created

### **Option 2: Automated Creation (Script)**

If you have DigitalOcean CLI or API access:

```bash
# Set your DO token
export DIGITALOCEAN_TOKEN="your_token_here"

# Run the creation script
./deploy/create-droplet.sh
```

## 🔧 Server Setup

### **Step 1: Connect to Your Droplet**

```bash
# SSH into your new droplet
ssh root@YOUR_DROPLET_IP

# Or if using SSH key authentication
ssh -i ~/.ssh/your_key root@YOUR_DROPLET_IP
```

### **Step 2: Clone and Setup**

```bash
# Create deployment directory
mkdir -p /opt/collabdomain
cd /opt/collabdomain

# Clone the repository
git clone https://github.com/Control-B/CollabDOMain.git .

# Run the automated setup script
chmod +x deploy/setup-server.sh
./deploy/setup-server.sh
```

The setup script will:

- ✅ Install Docker & Docker Compose
- ✅ Configure Nginx reverse proxy
- ✅ Set up firewall rules
- ✅ Create systemd service
- ✅ Prepare environment files

### **Step 3: Configure Environment**

```bash
# Edit the environment file
nano .env

# Add your configurations:
```

```env
# Database (use DigitalOcean Managed PostgreSQL for production)
DATABASE_URL=postgresql://collab:collab@localhost:5432/collab

# DigitalOcean Spaces (for file storage)
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_ACCESS_KEY=your-access-key
DO_SPACES_SECRET_KEY=your-secret-key

# Application
JWT_SECRET=your-super-secret-jwt-key-here
API_BASE_URL=http://YOUR_DROPLET_IP

# Email (for notifications)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### **Step 4: Start All Services**

```bash
# Start the entire platform
sudo systemctl start collabdomain

# Check status
sudo systemctl status collabdomain

# View real-time logs
docker-compose logs -f
```

## 🌐 Accessing Your Platform

Once deployed, your services will be available at:

### **Public URLs:**

- 🎨 **Landing Page**: `http://YOUR_DROPLET_IP`
- 🌐 **API Gateway**: `http://YOUR_DROPLET_IP/api`
- 📱 **Web Application**: `http://YOUR_DROPLET_IP:3000`

### **Service Health Checks:**

```bash
# Check all services are running
curl http://YOUR_DROPLET_IP/api/health

# Individual service health
curl http://YOUR_DROPLET_IP:8005/health  # ETA Service
curl http://YOUR_DROPLET_IP:8006/health  # Appointment Service
curl http://YOUR_DROPLET_IP:8007/health  # Yard Management
curl http://YOUR_DROPLET_IP:8004/health  # Geofence Service
```

### **API Documentation:**

- 📍 **ETA Service**: `http://YOUR_DROPLET_IP:8005/docs`
- 📅 **Appointment Service**: `http://YOUR_DROPLET_IP:8006/docs`
- 🚛 **Yard Management**: `http://YOUR_DROPLET_IP:8007/docs`
- 🎯 **Geofence Service**: `http://YOUR_DROPLET_IP:8004/docs`

## 🔒 Security Setup

### **Step 1: Configure Firewall**

The setup script automatically configures UFW, but verify:

```bash
sudo ufw status
```

### **Step 2: SSL Certificate (Production)**

```bash
# Install SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Step 3: Regular Backups**

```bash
# Enable automated backups
sudo systemctl enable --now docker-compose-backup.timer

# Manual backup
docker-compose exec postgres pg_dump -U collab collab > backup_$(date +%Y%m%d).sql
```

## 📊 Monitoring & Maintenance

### **Service Management:**

```bash
# Restart all services
sudo systemctl restart collabdomain

# View service logs
journalctl -u collabdomain -f

# Update application (when new code is pushed)
cd /opt/collabdomain
git pull origin main
docker-compose down
docker-compose pull
docker-compose up -d
```

### **Database Management:**

```bash
# Connect to database
docker-compose exec postgres psql -U collab -d collab

# View tables
\dt

# Check C3-Hive tables
\dt *location*
\dt *appointment*
\dt *trailer*
```

### **Performance Monitoring:**

```bash
# Container stats
docker stats

# System resources
htop

# Disk usage
df -h
du -sh /opt/collabdomain/
```

## 🚀 Production Enhancements

### **Recommended DigitalOcean Services:**

1. **Managed PostgreSQL**

   - Replace local PostgreSQL with managed cluster
   - Automatic backups and scaling
   - High availability

2. **Spaces (Object Storage)**

   - For document and media storage
   - CDN-backed for global performance

3. **Load Balancer**

   - For high availability
   - SSL termination
   - Health checks

4. **Monitoring**
   - DigitalOcean Monitoring
   - Custom alerts and dashboards

### **Scaling Options:**

1. **Horizontal Scaling:**

   ```bash
   # Scale specific services
   docker-compose up -d --scale eta-service=3
   docker-compose up -d --scale appointment-service=2
   ```

2. **Vertical Scaling:**
   - Resize droplet to higher CPU/RAM
   - Update docker-compose resource limits

## 🎯 Success Verification

### **Complete Deployment Checklist:**

- ✅ Droplet created and accessible
- ✅ Repository cloned successfully
- ✅ All 12 backend services running
- ✅ Frontend applications accessible
- ✅ Database tables created (including C3-Hive models)
- ✅ Nginx reverse proxy configured
- ✅ Firewall properly configured
- ✅ Environment variables set
- ✅ SSL certificate installed (for production)
- ✅ Health checks passing

### **Test Key Features:**

1. **Landing Page:**

   - Visit `http://YOUR_DROPLET_IP`
   - Verify videos/animations work
   - Test navigation links

2. **API Endpoints:**

   ```bash
   # Test API Gateway
   curl http://YOUR_DROPLET_IP/api/health

   # Test specific services
   curl http://YOUR_DROPLET_IP:8005/health  # ETA
   curl http://YOUR_DROPLET_IP:8006/health  # Appointments
   curl http://YOUR_DROPLET_IP:8007/health  # Yard Management
   curl http://YOUR_DROPLET_IP:8004/health  # Geofencing
   ```

3. **Database:**
   ```bash
   # Verify C3-Hive tables exist
   docker-compose exec postgres psql -U collab -d collab -c "\dt"
   ```

## 🆘 Troubleshooting

### **Common Issues:**

1. **Services not starting:**

   ```bash
   docker-compose logs service-name
   sudo systemctl status collabdomain
   ```

2. **Database connection errors:**

   ```bash
   docker-compose exec postgres pg_isready
   ```

3. **Port conflicts:**

   ```bash
   netstat -tulpn | grep :8000
   ```

4. **Memory issues:**
   ```bash
   free -h
   docker system prune -a
   ```

## 🎉 Congratulations!

You now have a complete Slack-style trucking collaboration platform running on DigitalOcean with:

✅ **Slack-Style Real-Time Collaboration**
✅ **Automatic Geofencing Check-ins** 
✅ **Document Management & E-Signatures**
✅ **Fleet Communication Channels**
✅ **Enhanced Supply Chain Visibility (Bonus)**
✅ **Predictive ETA Tracking (Bonus)**
✅ **Smart Scheduling & Analytics (Bonus)**
✅ **Production-Ready Infrastructure**

**Your CollabDOMain trucking collaboration platform is now live! 🚛💬🎯**

---

**Support:**

- 📚 Documentation: Check the `/docs` folder
- 🐛 Issues: GitHub Issues
- 💬 Community: Contact support@dispatchar.com
