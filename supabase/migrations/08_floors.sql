-- Create floors table
CREATE TABLE public.floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    description TEXT,
    status building_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_floors_building_id ON public.floors(building_id);
CREATE INDEX idx_floors_status ON public.floors(status);

-- Add trigger for updated_at
CREATE TRIGGER update_floors_updated_at
    BEFORE UPDATE ON public.floors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;

-- Add floor policies
CREATE POLICY "Floors are viewable by everyone"
    ON public.floors FOR SELECT
    USING (true);

CREATE POLICY "Floors are editable by authenticated users only"
    ON public.floors FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.floors TO authenticated;
GRANT SELECT ON public.floors TO anon;