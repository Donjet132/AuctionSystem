import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromAuth from '../state/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(fromAuth.selectIsLoggedIn).pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) {
          return this.router.createUrlTree(['/test1']);
        }
        return true;
      })
    );
  }
}
