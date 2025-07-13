import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BidDto, AuctionDetailsDto } from '../../state/auction/auction.models';
import { loadAuctionDetails } from '../../state/auction/auction.actions';
import { selectAuctionDetails, selectAuctionLoading, selectAuctionError } from '../../state/auction/auction.selectors';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  // Note: You'll need to modify your state to include AuctionDetailsDto
  // or create a separate selector that transforms selectedAuction to AuctionDetailsDto
  auctionDetails$: Observable<AuctionDetailsDto | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  displayedColumns: string[] = ['bidderName', 'amount', 'timePlaced'];
  displayedColumnsForBuyer: string[] = ['amount', 'timePlaced'];

  constructor() {
    this.auctionDetails$ = this.store.select(selectAuctionDetails);
    this.loading$ = this.store.select(selectAuctionLoading);
    this.error$ = this.store.select(selectAuctionError);
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const auctionId = params['id'];
      if (auctionId) {
        // Dispatch action to load auction details
        // You'll need to create this action in your auction actions
        this.store.dispatch(loadAuctionDetails({ auctionId: +auctionId }));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isAuctionActive(auction: AuctionDetailsDto): boolean {
    const now = new Date();
    return now >= new Date(auction.startDate) && now <= new Date(auction.endDate);
  }

  isAuctionEnded(auction: AuctionDetailsDto): boolean {
    return new Date() > new Date(auction.endDate);
  }

  getAuctionStatus(auction: AuctionDetailsDto): string {
    if (this.isAuctionActive(auction)) {
      return 'ACTIVE';
    } else if (this.isAuctionEnded(auction)) {
      return 'ENDED';
    } else {
      return 'UPCOMING';
    }
  }

  getStatusColor(auction: AuctionDetailsDto): string {
    const status = this.getAuctionStatus(auction);
    switch (status) {
      case 'ACTIVE': return 'primary';
      case 'ENDED': return 'warn';
      case 'UPCOMING': return 'accent';
      default: return '';
    }
  }

  getHighestBid(bids: BidDto[]): number | null {
    if (!bids || bids.length === 0) return null;
    return Math.max(...bids.map(bid => bid.amount));
  }

  getLatestBid(bids: BidDto[]): BidDto | null {
    if (!bids || bids.length === 0) return null;
    return bids.reduce((latest, current) => 
      new Date(current.timePlaced) > new Date(latest.timePlaced) ? current : latest
    );
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  onPlaceBid(auction: AuctionDetailsDto) {
    // Implement bid placement logic
    console.log('Place bid for auction:', auction.title);
  }
}