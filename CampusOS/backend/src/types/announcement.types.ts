export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  posted_by: string;
  expires_date: string;
  status: 'active' | 'expired';
  created_at: Date;
  updated_at: Date;
}

// Optional query filters for GET /api/announcements
export interface AnnouncementFilters {
  priority?: string;
  status?: string;
  posted_by?: string;
}

// Body types for POST/PUT /api/announcements
export interface CreateAnnouncementInput {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: string;
  posted_by: string;
  expires_date: string;
}

export interface UpdateAnnouncementInput extends Partial<CreateAnnouncementInput> {
  status?: 'active' | 'expired';
}
