// Base API URL
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
