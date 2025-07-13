import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuctionState } from './auction.models';

export const selectAuctionState = createFeatureSelector<AuctionState>('auction');

export const selectAllAuctions = createSelector(
  selectAuctionState,
  (state) => state.auctions
);

export const selectAuctionLoading = createSelector(
  selectAuctionState,
  (state) => state.loading
);

export const selectAuctionError = createSelector(
  selectAuctionState,
  (state) => state.error
);

export const selectAuctionCreateLoading = createSelector(
  selectAuctionState,
  (state) => state.createLoading
);

export const selectAuctionCreateError = createSelector(
  selectAuctionState,
  (state) => state.createError
);
