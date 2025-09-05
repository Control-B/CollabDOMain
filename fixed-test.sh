#!/bin/bash

echo "🧪 Fixed Test: Notification Persistence + Success Popup"
echo "======================================================="

# Function to check notification count
check_notification_count() {
    local expected_count=$1
    local description=$2
    echo "🔍 Checking notification count ($description)..."
    
    local response=$(curl -s "http://localhost:3010/api/checkin-notifications")
    local count=$(echo "$response" | jq 'length' 2>/dev/null || echo "0")
    
    echo "📊 Current notification count: $count"
    if [ "$count" -eq "$expected_count" ]; then
        echo "✅ Notification count matches expected ($expected_count)"
        return 0
    else
        echo "❌ Expected $expected_count notifications, got $count"
        return 1
    fi
}

# Main test sequence
echo "🚀 Starting test..."

# Step 1: Check initial state
echo ""
echo "📋 Step 1: Check initial notification count"
initial_count=$(curl -s "http://localhost:3010/api/checkin-notifications" | jq 'length' 2>/dev/null || echo "0")
echo "📊 Initial notification count: $initial_count"

# Step 2: Create a test notification
echo ""
echo "📋 Step 2: Create test notification"
payload='{
    "type": "outbound",
    "driverName": "Test Driver",
    "phoneNumber": "555-0123",
    "vehicleId": "TEST-001",
    "trailerNumber": "TRL-001",
    "companyName": "Test Company",
    "deliveryAddress": "123 Test St",
    "deliveryPhone": "555-0456",
    "poNumber": "TEST-PO-001",
    "appointmentDate": "2025-09-04",
    "appointmentTime": "14:30",
    "loadType": "Test Load",
    "submittedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "location": "Test Terminal",
    "isGeofenceOverride": true,
    "overrideReason": "Testing notification persistence"
}'

echo "📤 Sending create request..."
create_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "http://localhost:3010/api/checkin-notifications")

echo "📥 Create response: $create_response"

notification_id=$(echo "$create_response" | jq -r '.notification.id' 2>/dev/null)
create_success=$(echo "$create_response" | jq -r '.success' 2>/dev/null)

if [ "$create_success" = "true" ] && [ "$notification_id" != "null" ] && [ "$notification_id" != "" ]; then
    echo "✅ Created test notification: $notification_id"
else
    echo "❌ Failed to create test notification"
    exit 1
fi

# Step 3: Verify count increased
echo ""
echo "📋 Step 3: Verify notification was added"
expected_count=$((initial_count + 1))
if ! check_notification_count $expected_count "after creation"; then
    echo "❌ Test failed at step 3"
    exit 1
fi

# Step 4: Delete the notification
echo ""
echo "📋 Step 4: Delete the test notification"
echo "🗑️ Deleting notification: $notification_id"

delete_response=$(curl -s -X DELETE \
    "http://localhost:3010/api/checkin-notifications/$notification_id")

echo "📥 Delete response: $delete_response"

delete_success=$(echo "$delete_response" | jq -r '.ok' 2>/dev/null)
deleted_id=$(echo "$delete_response" | jq -r '.deleted' 2>/dev/null)

if [ "$delete_success" = "true" ] && [ "$deleted_id" = "$notification_id" ]; then
    echo "✅ Successfully deleted notification: $deleted_id"
else
    echo "❌ Failed to delete notification"
    echo "Expected success=true and deleted=$notification_id"
    echo "Got success=$delete_success and deleted=$deleted_id"
    exit 1
fi

# Step 5: Verify count decreased
echo ""
echo "📋 Step 5: Verify notification was deleted"
if ! check_notification_count $initial_count "after deletion"; then
    echo "❌ Test failed at step 5"
    exit 1
fi

# Step 6: Wait and check again (persistence test)
echo ""
echo "📋 Step 6: Wait 3 seconds and verify deletion persists"
sleep 3
if ! check_notification_count $initial_count "after waiting (persistence test)"; then
    echo "❌ Test failed at step 6 - notification came back!"
    exit 1
fi

echo ""
echo "🎉 ALL TESTS PASSED!"
echo "✅ Notification persistence is working correctly"
echo "✅ Create/delete cycle works properly" 
echo "✅ Notifications do not reappear after deletion"
echo ""
echo "📱 To test mobile success popup:"
echo "   1. Run the mobile app (npm run dev:mobile)"
echo "   2. Go to outbound check-in"
echo "   3. Fill required fields (Driver Name, Phone, Vehicle ID, Delivery Location, Delivery Address)"
echo "   4. Click 'Override Check-In' (since geofence simulation often shows outside)"
echo "   5. Enter a reason and submit"
echo "   6. Watch console logs for: '🎉 Now showing success popup for override check-in'"
echo "   7. Verify success popup appears after modal closes (should wait 800ms)"
