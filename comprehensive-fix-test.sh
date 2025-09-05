#!/bin/bash

echo "🧪 Comprehensive Test: Notification Persistence + Success Popup"
echo "================================================================"

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

# Function to create a test notification
create_test_notification() {
    echo "📤 Creating test notification..."
    
    local payload='{
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
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "http://localhost:3010/api/checkin-notifications")
    
    local success=$(echo "$response" | jq -r '.success' 2>/dev/null)
    local notification_id=$(echo "$response" | jq -r '.notification.id' 2>/dev/null)
    
    if [ "$success" = "true" ] && [ "$notification_id" != "null" ] && [ "$notification_id" != "" ]; then
        echo "✅ Created test notification: $notification_id"
        # Return just the ID, not echo it with other text
        echo "$notification_id"
        return 0
    else
        echo "❌ Failed to create test notification"
        echo "Response: $response"
        return 1
    fi
}

# Function to delete a notification
delete_notification() {
    local notification_id=$1
    echo "🗑️ Deleting notification: $notification_id"
    
    local response=$(curl -s -X DELETE \
        "http://localhost:3010/api/checkin-notifications/$notification_id")
    
    local success=$(echo "$response" | jq -r '.ok' 2>/dev/null)
    local deleted_id=$(echo "$response" | jq -r '.deleted' 2>/dev/null)
    
    if [ "$success" = "true" ] && [ "$deleted_id" = "$notification_id" ]; then
        echo "✅ Successfully deleted notification: $deleted_id"
        return 0
    else
        echo "❌ Failed to delete notification"
        echo "Response: $response"
        return 1
    fi
}

# Main test sequence
echo "🚀 Starting comprehensive test..."

# Step 1: Check initial state
echo ""
echo "📋 Step 1: Check initial notification count"
initial_count=$(curl -s "http://localhost:3010/api/checkin-notifications" | jq 'length' 2>/dev/null || echo "0")
echo "📊 Initial notification count: $initial_count"

# Step 2: Create a test notification
echo ""
echo "📋 Step 2: Create test notification"
test_notification_id=$(create_test_notification)
if [ $? -ne 0 ]; then
    echo "❌ Test failed at step 2"
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
if ! delete_notification "$test_notification_id"; then
    echo "❌ Test failed at step 4"
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

# Step 7: Test multiple create/delete cycles
echo ""
echo "📋 Step 7: Test multiple create/delete cycles"
for i in {1..3}; do
    echo "🔄 Cycle $i/3"
    
    # Create
    cycle_notification_id=$(create_test_notification)
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create notification in cycle $i"
        exit 1
    fi
    
    # Verify creation
    expected_count=$((initial_count + 1))
    if ! check_notification_count $expected_count "cycle $i creation"; then
        echo "❌ Count check failed in cycle $i"
        exit 1
    fi
    
    # Delete
    if ! delete_notification "$cycle_notification_id"; then
        echo "❌ Failed to delete notification in cycle $i"
        exit 1
    fi
    
    # Verify deletion
    if ! check_notification_count $initial_count "cycle $i deletion"; then
        echo "❌ Delete check failed in cycle $i"
        exit 1
    fi
    
    echo "✅ Cycle $i completed successfully"
done

echo ""
echo "🎉 ALL TESTS PASSED!"
echo "✅ Notification persistence is working correctly"
echo "✅ Create/delete cycles work properly"
echo "✅ Notifications do not reappear after deletion"
echo ""
echo "📱 To test mobile success popup:"
echo "   1. Run the mobile app"
echo "   2. Go to outbound check-in"
echo "   3. Fill required fields"
echo "   4. Click 'Override Check-In'"
echo "   5. Enter a reason and submit"
echo "   6. Watch console logs for popup timing"
echo "   7. Verify success popup appears after modal closes"
