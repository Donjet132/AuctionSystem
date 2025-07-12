import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.models';

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  lastAction: null,
  loginAttempts: 0
};

export const authReducer = createReducer(
  initialState,
  
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
    lastAction: 'login' as const
  })),
  
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
    loginAttempts: 0
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    loginAttempts: (state.loginAttempts || 0) + 1
  })),
  
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
    lastAction: 'register' as const
  })),
  
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  on(AuthActions.logout, () => ({
    ...initialState,
    lastAction: 'logout' as const
  }))
);

export const selectAuthState = (state: any) => state.auth;
export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;
export const selectLoading = (state: any) => state.auth.loading;
export const selectError = (state: any) => state.auth.error;