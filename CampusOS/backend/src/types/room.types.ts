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

// A room as returned by the API: base fields + equipment array + bookings
export type RoomWithDetails = Room & { equipment: string[]; bookings: RoomBooking[] };

// Optional query filters for GET /api/rooms
export interface RoomFilters {
  type?: string;
  status?: string;
  min_capacity?: number;
  equipment?: string;
  floor?: number;
}

// Body types for POST/PUT /api/rooms
export interface CreateRoomInput {
  id: string;
  room_number: string;
  type: string;
  capacity: number;
  floor: number;
  status?: string;
  equipment?: string[];
}

export type UpdateRoomInput = Partial<Omit<CreateRoomInput, 'id'>>;

// Body types for /api/rooms/bookings
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