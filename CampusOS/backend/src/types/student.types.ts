export interface Student {
  student_id: string;
  student_name: string;
  email: string;
  phone: string | null;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateStudentInput {
  student_id: string;
  student_name: string;
  email: string;
  phone?: string;
  password: string;
}

export type UpdateStudentInput = Partial<Omit<CreateStudentInput, 'student_id'>>;

export interface RefreshToken {
  id: number;
  student_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export interface AuthPayload {
  id: string;
  student_name?: string;
  iat?: number;
  exp?: number;
}
