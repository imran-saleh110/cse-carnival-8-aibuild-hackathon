export interface Assignment {
  id: string;
  course: string;
  course_title: string;
  title: string;
  description: string;
  assigned_date: string;
  deadline: string;
  submission_platform: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  marks: number;
  created_at: Date;
  updated_at: Date;
}

// Optional query filters for GET /api/assignments
export interface AssignmentFilters {
  course?: string;
  status?: string;
}

// Body types for POST/PUT /api/assignments
export interface CreateAssignmentInput {
  id: string;
  course: string;
  course_title: string;
  title: string;
  description?: string;
  assigned_date: string;
  deadline: string;
  submission_platform?: string;
  status?: string;
  marks?: number;
}

export type UpdateAssignmentInput = Partial<Omit<CreateAssignmentInput, 'id'>>;
