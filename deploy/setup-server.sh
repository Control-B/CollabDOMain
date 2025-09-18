#!/bin/bash

# CollabDOMain Server Setup Script
# This script sets up the server environment for deployment

echo "🚀 Setting up CollabDOMain on DigitalOcean..."

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install essential tools
sudo apt-get install -y curl wget git htop unzip jq nginx certbot python3-certbot-nginx

# Install Docker Compose (latest version)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify Docker is running
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Create deployment directory
sudo mkdir -p /opt/collabdomain
cd /opt/collabdomain

# Clone the repository
echo "📥 Cloning CollabDOMain repository..."
sudo git clone https://github.com/Control-B/CollabDOMain.git .

# Set up environment file
sudo cp config/digitalocean.env.example .env

# Create necessary directories
sudo mkdir -p logs uploads data

# Set correct permissions
sudo chown -R $USER:docker /opt/collabdomain
sudo chmod +x deploy/*.sh

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # Next.js Landing
sudo ufw allow 4000/tcp  # Chat Service
sudo ufw allow 5000/tcp  # DMS Core
sudo ufw allow 8000/tcp  # API Gateway
sudo ufw --force enable

# Set up Nginx reverse proxy configuration
sudo tee /etc/nginx/sites-available/collabdomain > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    # Landing page
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API Gateway
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # WebSocket for chat
    location /socket/ {
        proxy_pass http://localhost:4000/socket/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/collabdomain /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Create systemd service for auto-start
sudo tee /etc/systemd/system/collabdomain.service > /dev/null <<EOF
[Unit]
Description=CollabDOMain Logistics Platform
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/collabdomain
ExecStart=/usr/local/bin/docker-compose -f docker-compose-microservices.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose-microservices.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable collabdomain

echo "✅ Server setup complete!"
echo "📍 Repository cloned to: /opt/collabdomain"
echo "🔧 Next steps:"
echo "   1. Edit /opt/collabdomain/.env with your DigitalOcean credentials"
echo "   2. Run: sudo systemctl start collabdomain"
echo "   3. Check status: sudo systemctl status collabdomain"
echo "   4. View logs: docker-compose logs -f"
echo ""
echo "🌐 Services will be available on:"
echo "   - Landing Page: http://your-droplet-ip"
echo "   - API Gateway: http://your-droplet-ip/api"
echo "   - Individual services on their respective ports"
echo ""
echo "🚀 CollabDOMain is ready for deployment!"
