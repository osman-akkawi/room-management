-- Create custom types
CREATE TYPE building_status AS ENUM ('active', 'maintenance', 'inactive');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');