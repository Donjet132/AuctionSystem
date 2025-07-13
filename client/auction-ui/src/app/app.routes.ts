import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuctionComponent } from './components/auction/auction.component';
import { CreateAuctionComponent } from './components/create-auction/create-auction.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  { path: 'create', component: CreateAuctionComponent, canActivate: [AuthGuard] },
  { path: 'auctions', component: AuctionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: '', redirectTo: 'auctions', pathMatch: 'full' },        // Default route
  { path: '**', redirectTo: 'auctions' }                          // Wildcard fallback
];
