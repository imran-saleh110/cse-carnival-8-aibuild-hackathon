export interface Course {
  course_code: string;
  course_title: string;
  department: string | null;
  credits: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CourseFilters {
  department?: string;
}

export interface CreateCourseInput {
  course_code: string;
  course_title: string;
  department?: string;
  credits?: number;
}

export type UpdateCourseInput = Partial<CreateCourseInput>;
