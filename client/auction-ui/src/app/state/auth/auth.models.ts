export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  lastAction?: 'login' | 'register' | 'logout' | null;
  loginAttempts?: number;
}

export interface User {
  id: number;
  username: string;
  walletAmount: number;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}