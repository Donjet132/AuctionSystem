export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  lastAction?: 'login' | 'register' | 'logout' | 'editUser' | null;
  loginAttempts?: number;
}

export interface User {
  id: number;
  username: string;
  walletAmount: number;
  currentPassword?: string;
  newPassword?: string;
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