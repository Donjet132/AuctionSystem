import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuctionComponent } from './pages/auction/auction.component';
import { CreateAuctionComponent } from './pages/create-auction/create-auction.component';
import {  AuctionDetailComponent } from './pages/auction-detail/auction-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  { path: 'create-auction', component: CreateAuctionComponent, canActivate: [AuthGuard] },
  { path: 'auctions', component: AuctionComponent, canActivate: [AuthGuard] },
  { path: 'detail/:id', component: AuctionDetailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: '', redirectTo: 'auctions', pathMatch: 'full' },
  { path: '**', redirectTo: 'auctions' }
];
