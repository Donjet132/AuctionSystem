import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Auction } from '../../state/auction/auction.models';
import * as AuctionActions from '../../state/auction/auction.actions';
import * as fromAuction from '../../state/auction/auction.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule
  ],
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {
  auctions$: Observable<Auction[]>;

  constructor(private store: Store) {
    this.auctions$ = this.store.select(fromAuction.selectAllAuctions);
  }

  ngOnInit() {
    this.store.dispatch(AuctionActions.loadAuctions());
  }
}
