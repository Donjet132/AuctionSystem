import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Auction } from '../../state/auction/auction.models';
import * as AuctionActions from '../../state/auction/auction.actions';
import * as fromAuction from '../../state/auction/auction.selectors';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auction.component.html'
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
