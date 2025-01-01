export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      buildings: {
        Row: {
          id: string
          name: string
          location: string
          status: 'active' | 'maintenance' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          status?: 'active' | 'maintenance' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          status?: 'active' | 'maintenance' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          building_id: string
          name: string
          capacity: number
          facilities: string[]
          status: 'available' | 'occupied' | 'maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          building_id: string
          name: string
          capacity: number
          facilities?: string[]
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          building_id?: string
          name?: string
          capacity?: number
          facilities?: string[]
          status?: 'available' | 'occupied' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      instructors: {
        Row: {
          id: string
          name: string
          email: string
          department: string
          specializations: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          department: string
          specializations?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          department?: string
          specializations?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          code: string
          name: string
          instructor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          instructor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          instructor_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          room_id: string
          course_id: string
          start_time: string
          end_time: string
          recurring: boolean
          recurrence_pattern: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          course_id: string
          start_time: string
          end_time: string
          recurring?: boolean
          recurrence_pattern?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          course_id?: string
          start_time?: string
          end_time?: string
          recurring?: boolean
          recurrence_pattern?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          instructor_id: string
          status: 'pending' | 'confirmed' | 'cancelled'
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          instructor_id: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          instructor_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      room_availability: {
        Row: {
          room_id: string
          room_name: string
          capacity: number
          facilities: string[]
          status: 'available' | 'occupied' | 'maintenance'
          building_name: string
          building_location: string
          start_time: string | null
          end_time: string | null
          course_name: string | null
          instructor_name: string | null
        }
      }
    }
    Functions: {
      check_schedule_conflict: {
        Args: {
          p_room_id: string
          p_start_time: string
          p_end_time: string
          p_schedule_id?: string
        }
        Returns: boolean
      }
      check_booking_conflict: {
        Args: {
          p_room_id: string
          p_start_time: string
          p_end_time: string
          p_booking_id?: string
        }
        Returns: boolean
      }
      find_available_rooms: {
        Args: {
          p_start_time: string
          p_end_time: string
          p_capacity?: number
          p_facilities?: string[]
        }
        Returns: {
          room_id: string
          room_name: string
          building_name: string
          capacity: number
          facilities: string[]
        }[]
      }
    }
  }
}