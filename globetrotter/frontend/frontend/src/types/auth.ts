export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthError {
  message: string;
  field?: string;
}
