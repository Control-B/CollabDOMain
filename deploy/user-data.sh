#!/bin/bash

# CollabDOMain DigitalOcean Droplet Setup Script
# This script automatically sets up the server environment

echo "🚀 CollabDOMain: Starting automated setup on DigitalOcean..."

# Update system packages
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
apt-get install -y curl wget git htop unzip jq nginx certbot python3-certbot-nginx

# Verify Docker is installed (should be present on Docker 20.04 image)
echo "🐳 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose (latest version)
echo "🐙 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installations
echo "✅ Verifying installations..."
docker --version
docker-compose --version

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p /opt/collabdomain
cd /opt/collabdomain

# Clone the CollabDOMain repository
echo "📥 Cloning CollabDOMain repository..."
git clone https://github.com/Control-B/CollabDOMain.git .

# Set up environment file
echo "⚙️ Setting up environment configuration..."
cp config/digitalocean.env.example .env

# Create necessary directories
mkdir -p logs uploads data backups

# Set permissions
echo "🔒 Setting proper permissions..."
chown -R root:docker /opt/collabdomain
chmod +x deploy/*.sh

# Configure firewall
echo "🔥 Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw allow 3011/tcp   # Landing Page
ufw allow 3000/tcp   # Web App
ufw allow 8000/tcp   # API Gateway
ufw allow 4000/tcp   # Chat Service
ufw allow 5000/tcp   # DMS Core
ufw --force enable

# Set up systemd service for auto-start
echo "🔄 Setting up system service..."
cat > /etc/systemd/system/collabdomain.service << 'EOF'
[Unit]
Description=CollabDOMain Platform
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/collabdomain
ExecStart=/usr/local/bin/docker-compose -f docker-compose-microservices.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose-microservices.yml down
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl daemon-reload
systemctl enable collabdomain

# Set up Nginx reverse proxy configuration
echo "🌐 Configuring Nginx reverse proxy..."
cat > /etc/nginx/sites-available/collabdomain << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Landing page (main site)
    location / {
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API Gateway
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Web App
    location /app/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket for chat
    location /socket/ {
        proxy_pass http://localhost:4000/socket/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/collabdomain /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t && systemctl reload nginx

# Create deployment info file
echo "📋 Creating deployment info..."
cat > /opt/collabdomain/DEPLOYMENT_INFO.txt << EOF
==========================================
CollabDOMain Deployment Information
==========================================

🎯 Platform: Slack-style collaboration for trucking
📅 Deployed: $(date)
🌐 Server IP: $(curl -s https://api.ipify.org)
📍 Location: /opt/collabdomain

🚀 Next Steps:
1. Edit environment: nano /opt/collabdomain/.env
2. Start services: systemctl start collabdomain
3. Check status: systemctl status collabdomain
4. View logs: docker-compose logs -f

🌐 Service URLs:
- Landing Page: http://$(curl -s https://api.ipify.org)
- API Gateway: http://$(curl -s https://api.ipify.org)/api
- Web App: http://$(curl -s https://api.ipify.org)/app

📊 Health Checks:
- curl http://$(curl -s https://api.ipify.org)/api/health
- docker-compose ps

🔧 Management:
- Update: cd /opt/collabdomain && git pull && docker-compose down && docker-compose up -d
- Logs: docker-compose logs -f
- Shell: docker-compose exec SERVICE_NAME bash

✅ Setup Complete!
==========================================
EOF

# Display completion message
echo ""
echo "🎉 ============================================="
echo "   CollabDOMain Setup Complete!"
echo "============================================="
echo ""
echo "✅ Repository cloned to: /opt/collabdomain"
echo "✅ Services configured and ready"
echo "✅ Nginx reverse proxy configured"
echo "✅ Firewall configured"
echo "✅ System service created"
echo ""
echo "🔧 Next Steps:"
echo "1. Edit environment: nano /opt/collabdomain/.env"
echo "2. Start services: systemctl start collabdomain"
echo "3. Check status: systemctl status collabdomain"
echo ""
echo "🌐 Your platform will be available at:"
echo "   http://$(curl -s https://api.ipify.org)"
echo ""
echo "📋 Full deployment info: /opt/collabdomain/DEPLOYMENT_INFO.txt"
echo "🚀 Happy trucking with CollabDOMain!"
echo ""
