export interface Announcement {
  id: string;
  title: string;
  body: string;
  announcement_date: string;
  priority: 'high' | 'medium' | 'low';
  posted_by: string;
  expires_date: string;
  status: 'active' | 'expired';
  created_at: Date;
  updated_at: Date;
}

export interface CreateAnnouncementInput {
  id: string;
  title: string;
  body: string;
  announcement_date: string;
  priority: string;
  posted_by: string;
  expires_date: string;
}

export interface UpdateAnnouncementInput {
  title?: string;
  body?: string;
  announcement_date?: string;
  priority?: string;
  posted_by?: string;
  expires_date?: string;
  status?: string;
}

export interface AnnouncementFilters {
  priority?: string;
  status?: string;
  posted_by?: string;
}
