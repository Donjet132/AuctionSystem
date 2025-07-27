import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BidState } from './bid.models';

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