// Existing types...

export interface Floor {
  id: string;
  building_id: string;
  name: string;
  level: number;
  description?: string;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
}

// Update Building interface to include floors
export interface BuildingWithFloors extends Building {
  floors?: Floor[];
}