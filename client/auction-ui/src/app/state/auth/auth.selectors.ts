import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, (state) => state.user);
export const selectToken = createSelector(selectAuthState, (state) => state.token);
export const selectLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectError = createSelector(selectAuthState, (state) => state.error);
export const selectIsLoggedIn = createSelector(selectAuthState, (state: AuthState) => !!state.user && !!state.token);
