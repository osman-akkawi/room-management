-- Function to check for schedule conflicts
CREATE OR REPLACE FUNCTION check_schedule_conflict(
    p_room_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_schedule_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM schedules
        WHERE room_id = p_room_id
        AND id != COALESCE(p_schedule_id, uuid_generate_v4())
        AND (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check for booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
    p_room_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM bookings
        WHERE room_id = p_room_id
        AND id != COALESCE(p_booking_id, uuid_generate_v4())
        AND status = 'confirmed'
        AND (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find available rooms
CREATE OR REPLACE FUNCTION find_available_rooms(
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_capacity INTEGER DEFAULT NULL,
    p_facilities TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    room_id UUID,
    room_name TEXT,
    building_name TEXT,
    capacity INTEGER,
    facilities TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.name,
        b.name,
        r.capacity,
        r.facilities
    FROM rooms r
    JOIN buildings b ON r.building_id = b.id
    WHERE r.status = 'available'
    AND NOT EXISTS (
        SELECT 1
        FROM schedules s
        WHERE s.room_id = r.id
        AND (s.start_time, s.end_time) OVERLAPS (p_start_time, p_end_time)
    )
    AND NOT EXISTS (
        SELECT 1
        FROM bookings bk
        WHERE bk.room_id = r.id
        AND bk.status = 'confirmed'
        AND (bk.start_time, bk.end_time) OVERLAPS (p_start_time, p_end_time)
    )
    AND (p_capacity IS NULL OR r.capacity >= p_capacity)
    AND (p_facilities IS NULL OR r.facilities @> p_facilities);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;