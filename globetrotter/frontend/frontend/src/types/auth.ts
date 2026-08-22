export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface AuthError {
  message: string;
  field?: string;
}
