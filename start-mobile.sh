#!/bin/bash

# Start the mobile app from the correct directory
echo "🚀 Starting mobile app..."
cd /Users/banjahmarah/CollabAzure-1/apps/mobile

# Kill any existing Expo processes
pkill -f "expo" 2>/dev/null
sleep 2

# Start Expo with web support and clear cache
npx expo start --web --clear
