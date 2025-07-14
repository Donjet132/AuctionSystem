import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface BidState {
  loading: boolean;
  error: string | null;
  success: boolean;
  currentBid: {
    auctionId: string;
    amount: number;
    bidId: string;
  } | null;
  auctionBids: {
    [auctionId: string]: any[];
  };
}

export const selectBidState = createFeatureSelector<BidState>('bid');

export const selectBidLoading = createSelector(
  selectBidState,
  (state: BidState) => state.loading
);

export const selectBidError = createSelector(
  selectBidState,
  (state: BidState) => state.error
);

export const selectBidSuccess = createSelector(
  selectBidState,
  (state: BidState) => state.success
);

export const selectCurrentBid = createSelector(
  selectBidState,
  (state: BidState) => state.currentBid
);

export const selectAuctionBids = (auctionId: string) => createSelector(
  selectBidState,
  (state: BidState) => state.auctionBids[auctionId] || []
);