export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null; // 'YYYY-MM-DD'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}