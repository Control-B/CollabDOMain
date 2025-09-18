#!/bin/bash

# Create DigitalOcean Droplet for CollabDOMain
echo "🚀 Creating DigitalOcean droplet for CollabDOMain..."

# Check if DIGITALOCEAN_TOKEN is set
if [ -z "$DIGITALOCEAN_TOKEN" ]; then
    echo "❌ Error: DIGITALOCEAN_TOKEN environment variable is not set"
    echo "Please set it with: export DIGITALOCEAN_TOKEN=your_token_here"
    exit 1
fi

# Create the droplet
RESPONSE=$(curl -s -X POST "https://api.digitalocean.com/v2/droplets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DIGITALOCEAN_TOKEN" \
  -d '{
    "name": "collabdomain-prod",
    "region": "nyc3",
    "size": "s-2vcpu-4gb",
    "image": "docker-20-04",
    "ssh_keys": [],
    "backups": true,
    "ipv6": true,
    "monitoring": true,
    "tags": ["collabdomain", "logistics", "production"],
    "user_data": "#!/bin/bash\napt-get update\napt-get install -y git curl wget\nmkdir -p /opt/collabdomain\ncd /opt/collabdomain\ngit clone https://github.com/Control-B/CollabDOMain.git .\necho \"Repository cloned successfully\" > /var/log/setup.log"
  }')

echo "Response: $RESPONSE"

# Extract droplet ID and IP
DROPLET_ID=$(echo $RESPONSE | jq -r '.droplet.id // empty')
DROPLET_IP=$(echo $RESPONSE | jq -r '.droplet.networks.v4[0].ip_address // empty')

if [ ! -z "$DROPLET_ID" ]; then
    echo "✅ Droplet created successfully!"
    echo "📍 Droplet ID: $DROPLET_ID"
    echo "🌐 IP Address: $DROPLET_IP (may take a few minutes to be assigned)"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Wait 2-3 minutes for droplet to boot"
    echo "2. SSH into the server: ssh root@$DROPLET_IP"
    echo "3. Run the setup script: cd /opt/collabdomain && ./deploy/setup-server.sh"
    echo "4. Configure environment: nano .env"
    echo "5. Start services: sudo systemctl start collabdomain"
else
    echo "❌ Failed to create droplet"
    echo "Response: $RESPONSE"
fi
