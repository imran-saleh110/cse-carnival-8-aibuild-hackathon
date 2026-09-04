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

export interface UpdateAssignmentInput {
  course?: string;
  course_title?: string;
  title?: string;
  description?: string;
  assigned_date?: string;
  deadline?: string;
  submission_platform?: string;
  status?: string;
  marks?: number;
}

export interface AssignmentFilters {
  course?: string;
  status?: string;
}
