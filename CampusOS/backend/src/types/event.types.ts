export interface Event {
  id: string;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  venue: string;
  organizer: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'full';
  created_at: Date;
  updated_at: Date;
}

export interface EventRegistration {
  event_id: string;
  student_id: string;
  student_name: string;
  registered_at: Date;
}

// An event as returned by the API: base fields + registrations array
export type EventWithDetails = Event & { registrations: EventRegistration[] };

// Optional query filters for GET /api/events
export interface EventFilters {
  status?: string;
  venue?: string;
  organizer?: string;
  date?: string;
}

// Body types for POST/PUT /api/events
export interface CreateEventInput {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  venue: string;
  organizer: string;
  capacity: number;
  registered?: number;
  status?: string;
}

export type UpdateEventInput = Partial<Omit<CreateEventInput, 'id'>>;

// Body type for POST /api/events/:id/register
export interface CreateRegistrationInput {
  event_id: string;
  student_id: string;
  student_name: string;
}
