-- Enable Row Level Security
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Buildings policies
CREATE POLICY "Buildings are viewable by everyone"
    ON public.buildings FOR SELECT
    USING (true);

CREATE POLICY "Buildings are editable by authenticated users only"
    ON public.buildings FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Rooms policies
CREATE POLICY "Rooms are viewable by everyone"
    ON public.rooms FOR SELECT
    USING (true);

CREATE POLICY "Rooms are editable by authenticated users only"
    ON public.rooms FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Instructors policies
CREATE POLICY "Instructors are viewable by everyone"
    ON public.instructors FOR SELECT
    USING (true);

CREATE POLICY "Instructors are editable by authenticated users only"
    ON public.instructors FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Courses policies
CREATE POLICY "Courses are viewable by everyone"
    ON public.courses FOR SELECT
    USING (true);

CREATE POLICY "Courses are editable by authenticated users only"
    ON public.courses FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Schedules policies
CREATE POLICY "Schedules are viewable by everyone"
    ON public.schedules FOR SELECT
    USING (true);

CREATE POLICY "Schedules are editable by authenticated users only"
    ON public.schedules FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Bookings policies
CREATE POLICY "Bookings are viewable by everyone"
    ON public.bookings FOR SELECT
    USING (true);

CREATE POLICY "Bookings are editable by authenticated users only"
    ON public.bookings FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');