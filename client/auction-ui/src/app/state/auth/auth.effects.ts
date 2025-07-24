import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((res) => AuthActions.loginSuccess({ user: res.user, token: res.token })),
          catchError((error: HttpErrorResponse) =>
            of(AuthActions.loginFailure({ error: error.error?.message || error?.message || 'Login failed' }))
          )
        )
      )
    )
  );


  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ username, password }) =>
        this.authService.register(username, password).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error: HttpErrorResponse) => of(AuthActions.registerFailure({ error: error.error?.message || error?.message || 'Register failed' })))
        )
      )
    )
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, user }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
          return AuthActions.loginSuccess({
            token,
            user: JSON.parse(user)
          });
        }

        return AuthActions.logout();
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}