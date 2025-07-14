import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { appProviders } from './app.providers';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { authReducer } from './state/auth/auth.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { auctionReducer } from './state/auction/auction.reducer';
import { AuctionEffects } from './state/auction/auction.effects';
import { bidReducer } from './state/bid/bid.reducer';
import { BidEffects } from './state/bid/bid.effects';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    ...appProviders,
    provideStore({
      auth: authReducer,
      auction: auctionReducer,
      bid: bidReducer
    }),
    provideEffects([AuthEffects, AuctionEffects, BidEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore()
  ]
};