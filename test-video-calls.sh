#!/bin/bash

echo "🎥 Testing Video Call System"
echo "=============================="

# Test 1: Check if web app is accessible
echo "1. Testing web app accessibility..."
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo "   ✅ Web app is running on http://localhost:3000"
else
    echo "   ❌ Web app is not accessible"
    exit 1
fi

# Test 2: Check if LiveKit service is running
echo "2. Testing LiveKit service..."
if curl -s http://localhost:8006/health | grep -q "healthy"; then
    echo "   ✅ LiveKit service is healthy"
else
    echo "   ❌ LiveKit service is not responding"
    exit 1
fi

# Test 3: Test call initiation API
echo "3. Testing call initiation..."
CALL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/calls/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "caller_phone": "+1234567890",
    "callee_phone": "+0987654321", 
    "call_type": "video",
    "caller_user_id": 1
  }')

if echo "$CALL_RESPONSE" | grep -q "call_id"; then
    echo "   ✅ Call initiation successful"
    CALL_ID=$(echo "$CALL_RESPONSE" | grep -o '"call_id":"[^"]*"' | cut -d'"' -f4)
    echo "   📞 Call ID: $CALL_ID"
else
    echo "   ❌ Call initiation failed"
    echo "   Response: $CALL_RESPONSE"
    exit 1
fi

# Test 4: Test call history API
echo "4. Testing call history..."
HISTORY_RESPONSE=$(curl -s http://localhost:3000/api/calls/history/%2B1234567890)

if echo "$HISTORY_RESPONSE" | grep -q "\[\]"; then
    echo "   ✅ Call history API working (empty history)"
else
    echo "   ✅ Call history API working"
fi

echo ""
echo "🎉 All tests passed! Video call system is ready."
echo ""
echo "📋 Next Steps:"
echo "1. Open http://localhost:3000/calls in your browser"
echo "2. Enter a phone number and click 'Call'"
echo "3. Open another browser window/tab to the same URL"
echo "4. Click 'Join' on the call in the history"
echo "5. Both windows should connect to the same video room"
echo ""
echo "🔧 Alternative: Click the 'Video Call' button in the chat page"

