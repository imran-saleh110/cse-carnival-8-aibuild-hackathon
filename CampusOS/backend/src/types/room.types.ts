export interface Room {
  id: string;
  room_number: string;
  type: 'classroom' | 'lab' | 'seminar';
  capacity: number;
  floor: number;
  status: 'available' | 'unavailable';
  created_at: Date;
  updated_at: Date;
}

export interface RoomEquipment {
  room_id: string;
  equipment: string;
}

export interface RoomBooking {
  booking_id: string;
  room_id: string;
  booked_by: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: 'active' | 'cancelled' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface RoomWithDetails extends Room {
  equipment: string[];
  bookings: RoomBooking[];
}

export interface CreateRoomInput {
  id: string;
  room_number: string;
  type: string;
  capacity: number;
  floor: number;
  status?: string;
  equipment?: string[];
}

export interface UpdateRoomInput {
  room_number?: string;
  type?: string;
  capacity?: number;
  floor?: number;
  status?: string;
  equipment?: string[];
}

export interface RoomFilters {
  type?: string;
  status?: string;
  min_capacity?: number;
  equipment?: string;
  floor?: number;
}

export interface CreateBookingInput {
  booking_id: string;
  room_id: string;
  booked_by: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose?: string;
}

export interface UpdateBookingInput {
  booked_by?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  purpose?: string;
  status?: string;
}
