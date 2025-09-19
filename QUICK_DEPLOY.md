# 🚀 Quick DigitalOcean Deployment Guide

## 📋 Current Status
✅ **GitHub Repository**: https://github.com/Control-B/CollabDOMain  
✅ **Landing Page**: Running locally on port 3011  
✅ **All Services**: Ready for deployment  
✅ **Platform Focus**: Slack-style collaboration for trucking  

## 🎯 Step 1: Create DigitalOcean Droplet

### Option A: DigitalOcean Dashboard (Recommended)

1. **Go to DigitalOcean Dashboard**
   - Login to: https://cloud.digitalocean.com/
   - Click "Create" → "Droplets"

2. **Droplet Configuration:**
   ```
   📦 Image: Docker 20.04 (LTS) x64
   💻 Plan: Basic
   🔧 CPU: Regular Intel - $24/mo (2 vCPUs, 4 GB RAM, 80 GB SSD)
   🌍 Region: New York 3 (nyc3) or closest to you
   🔐 Authentication: SSH Key (recommended) or Password
   🏷️ Tags: collabdomain, production, trucking
   ```

3. **Advanced Options:**
   - ✅ Enable Monitoring
   - ✅ Enable IPv6  
   - ✅ Enable Backups
   - ✅ Add User Data (copy from below)

4. **User Data Script:**
   ```bash
   #!/bin/bash
   # CollabDOMain Automated Setup
   
   echo "🚀 Setting up CollabDOMain on DigitalOcean..."
   
   # Update system
   apt-get update && apt-get upgrade -y
   
   # Install essential tools
   apt-get install -y curl wget git htop unzip jq nginx
   
   # Install Docker Compose
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   
   # Clone repository
   mkdir -p /opt/collabdomain
   cd /opt/collabdomain
   git clone https://github.com/Control-B/CollabDOMain.git .
   
   # Set up environment
   cp config/digitalocean.env.example .env
   
   # Configure firewall
   ufw allow OpenSSH
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 3011/tcp
   ufw --force enable
   
   echo "✅ Setup complete! Repository cloned to /opt/collabdomain"
   ```

### Option B: Using doctl CLI

If you have `doctl` installed:

```bash
# Create droplet
doctl compute droplet create collabdomain-prod \
  --image docker-20-04 \
  --size s-2vcpu-4gb \
  --region nyc3 \
  --ssh-keys YOUR_SSH_KEY_ID \
  --enable-monitoring \
  --enable-ipv6 \
  --tag-names collabdomain,production \
  --user-data-file deploy/user-data.sh
```

## 🔧 Step 2: Connect to Your Droplet

Once your droplet is created, note the IP address and connect:

```bash
# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Or with SSH key
ssh -i ~/.ssh/your_key root@YOUR_DROPLET_IP
```

## 🚀 Step 3: Deploy the Platform

Once connected to your droplet:

```bash
# Navigate to the project
cd /opt/collabdomain

# Run the setup script
chmod +x deploy/setup-server.sh
./deploy/setup-server.sh

# Configure environment variables
nano .env
```

### Environment Configuration (.env):

```env
# Database
DATABASE_URL=postgresql://collab:collab@postgres:5432/collab

# DigitalOcean Spaces (optional - for file storage)
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_ACCESS_KEY=your-access-key
DO_SPACES_SECRET_KEY=your-secret-key

# Application
JWT_SECRET=your-super-secret-jwt-key-change-this
API_BASE_URL=http://YOUR_DROPLET_IP

# Email (for notifications - optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

## 🌊 Step 4: Start All Services

```bash
# Start the entire platform
docker-compose -f docker-compose-microservices.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🌐 Step 5: Access Your Platform

Once deployed, your services will be available at:

### **Main URLs:**
- 🎨 **Landing Page**: `http://YOUR_DROPLET_IP:3011`
- 🌐 **API Gateway**: `http://YOUR_DROPLET_IP:8000`
- 📱 **Web Application**: `http://YOUR_DROPLET_IP:3000`

### **Backend Services:**
- 🔐 **Auth Service**: `http://YOUR_DROPLET_IP:8001`
- 📄 **DMS Service**: `http://YOUR_DROPLET_IP:8002`
- ✍️ **E-Sign Service**: `http://YOUR_DROPLET_IP:8003`
- 🎯 **Geofence Service**: `http://YOUR_DROPLET_IP:8004`
- 📍 **ETA Service**: `http://YOUR_DROPLET_IP:8005`
- 📅 **Appointment Service**: `http://YOUR_DROPLET_IP:8006`
- 🚛 **Yard Management**: `http://YOUR_DROPLET_IP:8007`
- 🛣️ **Trip Service**: `http://YOUR_DROPLET_IP:8008`
- 🎬 **LiveKit Service**: `http://YOUR_DROPLET_IP:8009`
- 💬 **Chat Service**: `http://YOUR_DROPLET_IP:4000`
- ⚡ **DMS Core**: `http://YOUR_DROPLET_IP:5000`

### **Health Checks:**
```bash
# Check all services
curl http://YOUR_DROPLET_IP:8000/health

# Individual service health
curl http://YOUR_DROPLET_IP:8005/docs  # ETA Service API docs
curl http://YOUR_DROPLET_IP:8006/docs  # Appointment Service API docs
curl http://YOUR_DROPLET_IP:8007/docs  # Yard Management API docs
curl http://YOUR_DROPLET_IP:8004/docs  # Geofence Service API docs
```

## 🔒 Step 6: Security & SSL (Production)

For production deployment:

```bash
# Install SSL certificate (replace with your domain)
apt-get install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com

# Set up auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

## 📊 Step 7: Monitoring & Maintenance

```bash
# Check service status
systemctl status collabdomain

# View system resources
htop

# Container stats
docker stats

# Database access
docker-compose exec postgres psql -U collab -d collab

# Update application (when new code is pushed)
git pull origin main
docker-compose down
docker-compose pull
docker-compose up -d
```

## 🎯 What You'll Have Running

### **Slack-Style Collaboration Platform for Trucking:**

✅ **Core Features:**
- 💬 Real-time chat, voice, and video communication
- 🎯 Automatic geofencing check-ins and notifications
- 📄 Document management with integrated e-signing
- 🚛 Fleet communication channels

✅ **Enhanced Features (Bonus):**
- 📍 Predictive ETA system with ML insights
- 📅 Smart appointment scheduling and dock assignment
- 🚛 Real-time asset tracking and yard management
- ⚠️ Exception management and automated alerts
- 📊 Comprehensive analytics and dashboards

## 🆘 Troubleshooting

### **Common Issues:**

1. **Services not starting:**
   ```bash
   docker-compose logs service-name
   ```

2. **Port conflicts:**
   ```bash
   netstat -tulpn | grep :8000
   ```

3. **Memory issues:**
   ```bash
   free -h
   docker system prune -a
   ```

4. **Database connection:**
   ```bash
   docker-compose exec postgres pg_isready
   ```

## 📞 Support

- **Repository**: https://github.com/Control-B/CollabDOMain
- **Documentation**: Check the `/docs` folder
- **Email**: support@dispatchar.com

---

**🎉 Your CollabDOMain trucking collaboration platform will be live and ready for operations!**
