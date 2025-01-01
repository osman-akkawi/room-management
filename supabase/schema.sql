-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create custom types
CREATE TYPE building_status AS ENUM ('active', 'maintenance', 'inactive');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create tables
CREATE TABLE public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    status building_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    facilities TEXT[] DEFAULT '{}',
    status room_status DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE,
    status booking_status DEFAULT 'pending',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_booking_time_range CHECK (end_time > start_time)
);

-- Create indexes for better query performance
CREATE INDEX idx_buildings_status ON public.buildings(status);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_rooms_building_id ON public.rooms(building_id);
CREATE INDEX idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX idx_schedules_room_id ON public.schedules(room_id);
CREATE INDEX idx_schedules_course_id ON public.schedules(course_id);
CREATE INDEX idx_schedules_time_range ON public.schedules USING gist (
    tstzrange(start_time, end_time) WITH &&
);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX idx_bookings_instructor_id ON public.bookings(instructor_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_time_range ON public.bookings USING gist (
    tstzrange(start_time, end_time) WITH &&
);

-- Create update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_buildings_updated_at
    BEFORE UPDATE ON public.buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at
    BEFORE UPDATE ON public.instructors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON public.schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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
        AND id != COALESCE(p_schedule_id, uuid_generate_v4()) -- Exclude current schedule when updating
        AND (
            (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
        )
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
        AND id != COALESCE(p_booking_id, uuid_generate_v4()) -- Exclude current booking when updating
        AND status = 'confirmed'
        AND (
            (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Buildings
CREATE POLICY "Buildings are viewable by everyone"
    ON public.buildings FOR SELECT
    USING (true);

CREATE POLICY "Buildings are editable by authenticated users only"
    ON public.buildings FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Rooms
CREATE POLICY "Rooms are viewable by everyone"
    ON public.rooms FOR SELECT
    USING (true);

CREATE POLICY "Rooms are editable by authenticated users only"
    ON public.rooms FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Instructors
CREATE POLICY "Instructors are viewable by everyone"
    ON public.instructors FOR SELECT
    USING (true);

CREATE POLICY "Instructors are editable by authenticated users only"
    ON public.instructors FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Courses
CREATE POLICY "Courses are viewable by everyone"
    ON public.courses FOR SELECT
    USING (true);

CREATE POLICY "Courses are editable by authenticated users only"
    ON public.courses FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Schedules
CREATE POLICY "Schedules are viewable by everyone"
    ON public.schedules FOR SELECT
    USING (true);

CREATE POLICY "Schedules are editable by authenticated users only"
    ON public.schedules FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Bookings
CREATE POLICY "Bookings are viewable by everyone"
    ON public.bookings FOR SELECT
    USING (true);

CREATE POLICY "Bookings are editable by authenticated users only"
    ON public.bookings FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create views for common queries
CREATE OR REPLACE VIEW public.room_availability AS
SELECT 
    r.id AS room_id,
    r.name AS room_name,
    r.capacity,
    r.facilities,
    r.status,
    b.name AS building_name,
    b.location AS building_location,
    s.start_time,
    s.end_time,
    c.name AS course_name,
    i.name AS instructor_name
FROM rooms r
LEFT JOIN buildings b ON r.building_id = b.id
LEFT JOIN schedules s ON r.id = s.room_id
LEFT JOIN courses c ON s.course_id = c.id
LEFT JOIN instructors i ON c.instructor_id = i.id
WHERE r.status = 'available';

-- Create function to find available rooms
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