-- Create indexes for better query performance
CREATE INDEX idx_buildings_status ON public.buildings(status);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_rooms_building_id ON public.rooms(building_id);
CREATE INDEX idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX idx_schedules_room_id ON public.schedules(room_id);
CREATE INDEX idx_schedules_course_id ON public.schedules(course_id);
CREATE INDEX idx_schedules_time_range ON public.schedules USING gist (
    tstzrange(start_time, end_time)
);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX idx_bookings_instructor_id ON public.bookings(instructor_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_time_range ON public.bookings USING gist (
    tstzrange(start_time, end_time)
);