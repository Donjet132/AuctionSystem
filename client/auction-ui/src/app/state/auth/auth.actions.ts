import { createAction, props } from '@ngrx/store';
import { User } from './auth.models';

// Login
export const login = createAction('[Auth] Login', props<{ username: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User; token: string }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Register
export const register = createAction('[Auth] Register', props<{ username: string; password: string }>());
export const registerSuccess = createAction('[Auth] Register Success');
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

// Logout
export const logout = createAction('[Auth] Logout');

// Clear Auth Error
export const clearAuthError = createAction('[Auth] Clear Error');


// Edit User
export const editUser = createAction('[User] Edit User', props<{ user: Partial<User> }>());
export const editUserSuccess = createAction('[User] Edit User Success', props<{ message: string }>());
export const editUserFailure = createAction('[User] Edit User Failure', props<{ error: string }>());