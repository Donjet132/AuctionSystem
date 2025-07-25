import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../state/auth/auth.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ user: User; token: string }> {
    return this.http
      .post<{ token: string; id: number; username: string; walletAmount: number }>(`${this.baseUrl}/login`, {
        username,
        password
      })
      .pipe(
        map(res => ({
          token: res.token,
          user: {
            id: res.id,
            username: res.username,
            walletAmount: res.walletAmount
          }
        }))
      );
  }

  register(username: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, { username, password });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {});
  }

  editUser(user: Partial<User>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/edit`, user);
  }
}