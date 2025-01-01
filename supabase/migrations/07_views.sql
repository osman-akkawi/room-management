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