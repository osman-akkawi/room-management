import { create } from 'zustand';
import { Building, Room, Instructor, Course, Schedule, Booking, Floor } from '../types';
import { supabase } from '../lib/supabase';

interface Store {
  buildings: Building[];
  rooms: Room[];
  instructors: Instructor[];
  courses: Course[];
  schedules: Schedule[];
  bookings: Booking[];
  floors: Floor[];
  loading: boolean;
  error: string | null;
  
  // Optimistic update actions
  addBuilding: (building: Building) => void;
  updateBuilding: (building: Building) => void;
  deleteBuilding: (id: string) => void;
  
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  
  addInstructor: (instructor: Instructor) => void;
  updateInstructor: (instructor: Instructor) => void;
  deleteInstructor: (id: string) => void;
  
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (schedule: Schedule) => void;
  deleteSchedule: (id: string) => void;
  
  addFloor: (floor: Floor) => void;
  updateFloor: (floor: Floor) => void;
  deleteFloor: (id: string) => void;
  
  // Fetch actions
  fetchBuildings: () => Promise<void>;
  fetchRooms: () => Promise<void>;
  fetchInstructors: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchFloors: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  buildings: [],
  rooms: [],
  instructors: [],
  courses: [],
  schedules: [],
  bookings: [],
  floors: [],
  loading: false,
  error: null,

  // Optimistic update implementations
  addBuilding: (building: Building) => {
    set((state) => ({
      buildings: [...state.buildings, building]
    }));
  },
  
  updateBuilding: (building: Building) => {
    set((state) => ({
      buildings: state.buildings.map(b => 
        b.id === building.id ? building : b
      )
    }));
  },
  
  deleteBuilding: (id: string) => {
    set((state) => ({
      buildings: state.buildings.filter(b => b.id !== id)
    }));
  },

  addRoom: (room: Room) => {
    set((state) => ({
      rooms: [...state.rooms, room]
    }));
  },
  
  updateRoom: (room: Room) => {
    set((state) => ({
      rooms: state.rooms.map(r => 
        r.id === room.id ? room : r
      )
    }));
  },
  
  deleteRoom: (id: string) => {
    set((state) => ({
      rooms: state.rooms.filter(r => r.id !== id)
    }));
  },

  addInstructor: (instructor: Instructor) => {
    set((state) => ({
      instructors: [...state.instructors, instructor]
    }));
  },
  
  updateInstructor: (instructor: Instructor) => {
    set((state) => ({
      instructors: state.instructors.map(i => 
        i.id === instructor.id ? instructor : i
      )
    }));
  },
  
  deleteInstructor: (id: string) => {
    set((state) => ({
      instructors: state.instructors.filter(i => i.id !== id)
    }));
  },

  addCourse: (course: Course) => {
    set((state) => ({
      courses: [...state.courses, course]
    }));
  },
  
  updateCourse: (course: Course) => {
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === course.id ? course : c
      )
    }));
  },
  
  deleteCourse: (id: string) => {
    set((state) => ({
      courses: state.courses.filter(c => c.id !== id)
    }));
  },

  addSchedule: (schedule: Schedule) => {
    set((state) => ({
      schedules: [...state.schedules, schedule]
    }));
  },
  
  updateSchedule: (schedule: Schedule) => {
    set((state) => ({
      schedules: state.schedules.map(s => 
        s.id === schedule.id ? schedule : s
      )
    }));
  },
  
  deleteSchedule: (id: string) => {
    set((state) => ({
      schedules: state.schedules.filter(s => s.id !== id)
    }));
  },

  addFloor: (floor: Floor) => {
    set((state) => ({
      floors: [...state.floors, floor]
    }));
  },
  
  updateFloor: (floor: Floor) => {
    set((state) => ({
      floors: state.floors.map(f => 
        f.id === floor.id ? floor : f
      )
    }));
  },
  
  deleteFloor: (id: string) => {
    set((state) => ({
      floors: state.floors.filter(f => f.id !== id)
    }));
  },

  // Fetch implementations
  fetchBuildings: async () => {
    try {
      const { data, error } = await supabase.from('buildings').select('*');
      if (error) throw error;
      set({ buildings: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchRooms: async () => {
    try {
      const { data, error } = await supabase.from('rooms').select('*');
      if (error) throw error;
      set({ rooms: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchInstructors: async () => {
    try {
      const { data, error } = await supabase.from('instructors').select('*');
      if (error) throw error;
      set({ instructors: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchCourses: async () => {
    try {
      const { data, error } = await supabase.from('courses').select('*');
      if (error) throw error;
      set({ courses: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchSchedules: async () => {
    try {
      const { data, error } = await supabase.from('schedules').select('*');
      if (error) throw error;
      set({ schedules: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchBookings: async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*');
      if (error) throw error;
      set({ bookings: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchFloors: async () => {
    try {
      const { data, error } = await supabase.from('floors').select('*');
      if (error) throw error;
      set({ floors: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));