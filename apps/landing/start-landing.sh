#!/bin/bash
# Landing page startup script

# Navigate to the landing directory
cd "$(dirname "$0")"

echo "🚀 Starting CollabAzure Landing Page..."
echo "📂 Working directory: $(pwd)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting Next.js development server on port 3011 (bound to 0.0.0.0)..."
./node_modules/.bin/next dev --port 3011 --hostname 0.0.0.0
