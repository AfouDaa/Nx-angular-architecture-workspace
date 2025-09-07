export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'Teacher' | 'Student' | 'Admin' | string;
  status: 'active' | 'inactive' | string;
  createdAt: string;
  updatedAt: string;
}
