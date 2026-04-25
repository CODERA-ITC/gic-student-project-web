export interface TeacherCourseAssignment {
  id: string;
  name?: string;
  code?: string;
  description?: string;
}

export interface CourseTeacherItem {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  role?: string;
  courses?: TeacherCourseAssignment[];
}

export interface CourseTeacherDragPayload {
  teacherId: string;
  sourceCourseId?: string;
}
