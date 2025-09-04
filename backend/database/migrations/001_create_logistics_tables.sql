-- Logistics and Trucking Database Schema
-- Optimized for 30M DAU with proper indexing and partitioning

-- Companies/Organizations table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    company_type VARCHAR(50) CHECK (company_type IN ('warehouse', 'shipping_office', 'store', 'distribution_center')),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexing for performance
    CONSTRAINT companies_name_key UNIQUE (name)
);

-- Create indexes for companies
CREATE INDEX idx_companies_type ON companies(company_type);
CREATE INDEX idx_companies_created_at ON companies(created_at);

-- Locations/Warehouses/Stores table with geospatial support
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    
    -- Geospatial coordinates
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geofence_radius INTEGER DEFAULT 200, -- meters
    
    -- PostGIS geometry column for advanced geospatial queries
    geom GEOMETRY(POINT, 4326),
    
    -- Location metadata
    location_type VARCHAR(50) CHECK (location_type IN ('warehouse', 'store', 'distribution_center', 'truck_stop')),
    operating_hours JSONB, -- Store operating hours as JSON
    special_instructions TEXT,
    dock_doors INTEGER DEFAULT 1,
    
    -- Status and tracking
    is_active BOOLEAN DEFAULT true,
    requires_appointment BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geospatial index and other indexes
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
CREATE INDEX idx_locations_company_id ON locations(company_id);
CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_active ON locations(is_active) WHERE is_active = true;

-- Function to automatically populate geometry from lat/lng
CREATE OR REPLACE FUNCTION update_location_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update geometry when lat/lng changes
CREATE TRIGGER trigger_update_location_geom
    BEFORE INSERT OR UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_location_geom();

-- Drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Reference to users table
    driver_license VARCHAR(50) NOT NULL UNIQUE,
    cdl_number VARCHAR(50),
    phone VARCHAR(20) NOT NULL,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Current status
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'on_trip', 'off_duty', 'break')),
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    last_location_update TIMESTAMP WITH TIME ZONE,
    
    -- Driver ratings and metrics
    rating DECIMAL(3, 2) DEFAULT 5.0,
    total_trips INTEGER DEFAULT 0,
    total_miles INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for drivers
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_license ON drivers(driver_license);
CREATE INDEX idx_drivers_location_update ON drivers(last_location_update);

-- Vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(50) NOT NULL,
    trailer_number VARCHAR(50),
    make VARCHAR(50),
    model VARCHAR(50),
    year INTEGER,
    vin VARCHAR(50),
    license_plate VARCHAR(20),
    
    -- Vehicle specifications
    max_weight INTEGER, -- in pounds
    max_volume INTEGER, -- in cubic feet
    vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('truck', 'trailer', 'van', 'pickup')),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
    current_driver_id UUID REFERENCES drivers(id),
    
    -- Maintenance and inspection
    last_inspection DATE,
    next_inspection DATE,
    insurance_expiry DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT vehicles_number_company_unique UNIQUE (vehicle_number, company_id)
);

-- Indexes for vehicles
CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_driver_id ON vehicles(current_driver_id);
CREATE INDEX idx_vehicles_number ON vehicles(vehicle_number);

-- Trip sheets table (partitioned by date for performance)
CREATE TABLE trip_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES drivers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    -- Trip basic information
    trip_number VARCHAR(50) NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    trailer_number VARCHAR(50),
    
    -- Pickup information
    pickup_location_id UUID REFERENCES locations(id),
    pickup_location_name VARCHAR(255) NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_phone VARCHAR(20),
    pickup_po_number VARCHAR(100),
    pickup_appointment_date DATE,
    pickup_appointment_time TIME,
    pickup_special_instructions TEXT,
    
    -- Delivery information
    delivery_location_id UUID REFERENCES locations(id),
    delivery_location_name VARCHAR(255),
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    delivery_appointment_date DATE,
    delivery_appointment_time TIME,
    delivery_special_instructions TEXT,
    
    -- Load information
    load_description TEXT,
    load_weight INTEGER, -- in pounds
    load_pieces INTEGER,
    load_value DECIMAL(12, 2),
    hazmat BOOLEAN DEFAULT false,
    
    -- Trip status and tracking
    status VARCHAR(30) DEFAULT 'created' CHECK (status IN (
        'created', 'en_route_pickup', 'arrived_pickup', 'loading', 'loaded',
        'en_route_delivery', 'arrived_delivery', 'unloading', 'completed', 'cancelled'
    )),
    
    -- Timestamps for trip lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    pickup_arrived_at TIMESTAMP WITH TIME ZONE,
    pickup_completed_at TIMESTAMP WITH TIME ZONE,
    delivery_arrived_at TIMESTAMP WITH TIME ZONE,
    delivery_completed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Calculated fields
    estimated_distance INTEGER, -- in miles
    estimated_duration INTEGER, -- in minutes
    actual_distance INTEGER,
    actual_duration INTEGER,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for trip_sheets (for performance at scale)
CREATE TABLE trip_sheets_2024_01 PARTITION OF trip_sheets
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE trip_sheets_2024_02 PARTITION OF trip_sheets
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE trip_sheets_2024_03 PARTITION OF trip_sheets
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
-- Add more partitions as needed

-- Indexes for trip_sheets
CREATE INDEX idx_trip_sheets_driver_id ON trip_sheets(driver_id);
CREATE INDEX idx_trip_sheets_vehicle_id ON trip_sheets(vehicle_id);
CREATE INDEX idx_trip_sheets_status ON trip_sheets(status);
CREATE INDEX idx_trip_sheets_pickup_location_id ON trip_sheets(pickup_location_id);
CREATE INDEX idx_trip_sheets_delivery_location_id ON trip_sheets(delivery_location_id);
CREATE INDEX idx_trip_sheets_trip_number ON trip_sheets(trip_number);
CREATE INDEX idx_trip_sheets_pickup_date ON trip_sheets(pickup_appointment_date);

-- Geofence check-ins table (high-volume table, partitioned)
CREATE TABLE geofence_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_sheet_id UUID NOT NULL REFERENCES trip_sheets(id),
    driver_id UUID NOT NULL REFERENCES drivers(id),
    location_id UUID NOT NULL REFERENCES locations(id),
    
    -- Check-in details
    checkin_type VARCHAR(20) CHECK (checkin_type IN ('pickup_arrival', 'pickup_departure', 'delivery_arrival', 'delivery_departure')),
    
    -- Location data at check-in
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geofence_radius_used INTEGER NOT NULL,
    distance_from_center DECIMAL(8, 2), -- meters
    
    -- Device and accuracy information
    location_accuracy DECIMAL(6, 2), -- GPS accuracy in meters
    device_id VARCHAR(255),
    app_version VARCHAR(20),
    
    -- Automatic vs manual check-in
    is_automatic BOOLEAN DEFAULT true,
    manual_reason TEXT, -- if manually triggered
    
    -- Notification tracking
    notification_sent BOOLEAN DEFAULT false,
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    notification_recipients JSONB, -- Array of recipient IDs
    
    -- Channel creation tracking
    channel_created BOOLEAN DEFAULT false,
    channel_id UUID, -- Reference to the created channel
    channel_created_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create daily partitions for geofence_checkins (high volume)
CREATE TABLE geofence_checkins_2024_01_01 PARTITION OF geofence_checkins
    FOR VALUES FROM ('2024-01-01') TO ('2024-01-02');
-- Add more daily partitions as needed

-- Indexes for geofence_checkins
CREATE INDEX idx_geofence_checkins_trip_id ON geofence_checkins(trip_sheet_id);
CREATE INDEX idx_geofence_checkins_driver_id ON geofence_checkins(driver_id);
CREATE INDEX idx_geofence_checkins_location_id ON geofence_checkins(location_id);
CREATE INDEX idx_geofence_checkins_type ON geofence_checkins(checkin_type);
CREATE INDEX idx_geofence_checkins_notification ON geofence_checkins(notification_sent);
CREATE INDEX idx_geofence_checkins_channel ON geofence_checkins(channel_created);

-- Driver location history (for tracking and analytics)
CREATE TABLE driver_location_history (
    id BIGSERIAL PRIMARY KEY,
    driver_id UUID NOT NULL REFERENCES drivers(id),
    trip_sheet_id UUID REFERENCES trip_sheets(id),
    
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    heading DECIMAL(5, 2), -- degrees
    speed DECIMAL(6, 2), -- mph
    altitude DECIMAL(8, 2), -- meters
    
    accuracy DECIMAL(6, 2), -- GPS accuracy in meters
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    device_id VARCHAR(255),
    
    -- Calculated fields
    distance_from_previous DECIMAL(8, 2), -- meters
    time_since_previous INTEGER, -- seconds
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (timestamp);

-- Create hourly partitions for location history (very high volume)
CREATE TABLE driver_location_history_2024_01_01_00 PARTITION OF driver_location_history
    FOR VALUES FROM ('2024-01-01 00:00:00') TO ('2024-01-01 01:00:00');
-- Add more hourly partitions as needed

-- Indexes for location history
CREATE INDEX idx_driver_location_history_driver_id ON driver_location_history(driver_id);
CREATE INDEX idx_driver_location_history_trip_id ON driver_location_history(trip_sheet_id);
CREATE INDEX idx_driver_location_history_timestamp ON driver_location_history(timestamp);

-- Shipping office configurations
CREATE TABLE shipping_office_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- Notification preferences
    notification_types JSONB DEFAULT '["pickup_arrival", "delivery_arrival"]'::jsonb,
    notification_channels JSONB DEFAULT '["in_app", "email"]'::jsonb,
    
    -- Auto-channel creation settings
    auto_create_channels BOOLEAN DEFAULT true,
    channel_naming_pattern VARCHAR(255) DEFAULT 'Trip-{trip_number}-{location_name}',
    default_channel_members JSONB, -- Array of user IDs to add to channels
    
    -- Geofence settings
    default_geofence_radius INTEGER DEFAULT 200, -- meters
    require_photo_confirmation BOOLEAN DEFAULT false,
    require_signature_confirmation BOOLEAN DEFAULT false,
    
    -- Business hours
    business_hours JSONB, -- Store business hours
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT shipping_office_configs_company_unique UNIQUE (company_id)
);

-- Performance views for common queries
CREATE VIEW active_trips AS
SELECT 
    ts.id,
    ts.trip_number,
    ts.status,
    ts.driver_name,
    ts.vehicle_number,
    ts.pickup_location_name,
    ts.delivery_location_name,
    ts.pickup_appointment_date,
    ts.delivery_appointment_date,
    d.current_location_lat,
    d.current_location_lng,
    d.last_location_update,
    ts.created_at
FROM trip_sheets ts
JOIN drivers d ON ts.driver_id = d.id
WHERE ts.status NOT IN ('completed', 'cancelled');

-- View for recent check-ins
CREATE VIEW recent_checkins AS
SELECT 
    gc.id,
    gc.checkin_type,
    gc.created_at,
    ts.trip_number,
    ts.driver_name,
    l.name as location_name,
    l.address as location_address,
    gc.notification_sent,
    gc.channel_created
FROM geofence_checkins gc
JOIN trip_sheets ts ON gc.trip_sheet_id = ts.id
JOIN locations l ON gc.location_id = l.id
WHERE gc.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY gc.created_at DESC;

-- Functions for geofence calculations
CREATE OR REPLACE FUNCTION is_within_geofence(
    point_lat DECIMAL(10, 8),
    point_lng DECIMAL(11, 8),
    center_lat DECIMAL(10, 8),
    center_lng DECIMAL(11, 8),
    radius_meters INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN ST_DWithin(
        ST_SetSRID(ST_MakePoint(point_lng, point_lat), 4326)::geography,
        ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography,
        radius_meters
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance_meters(
    lat1 DECIMAL(10, 8),
    lng1 DECIMAL(11, 8),
    lat2 DECIMAL(10, 8),
    lng2 DECIMAL(11, 8)
) RETURNS DECIMAL(8, 2) AS $$
BEGIN
    RETURN ST_Distance(
        ST_SetSRID(ST_MakePoint(lng1, lat1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(lng2, lat2), 4326)::geography
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update driver's current location
CREATE OR REPLACE FUNCTION update_driver_current_location()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE drivers 
    SET 
        current_location_lat = NEW.latitude,
        current_location_lng = NEW.longitude,
        last_location_update = NEW.timestamp
    WHERE id = NEW.driver_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_driver_location
    AFTER INSERT ON driver_location_history
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_current_location();

-- Performance optimization: Update table statistics
ANALYZE companies;
ANALYZE locations;
ANALYZE drivers;
ANALYZE vehicles;
ANALYZE trip_sheets;
ANALYZE geofence_checkins;
ANALYZE driver_location_history;



