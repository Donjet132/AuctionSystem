import { createAction, props } from '@ngrx/store';

// Bid Actions
export const placeBid = createAction(
  '[Bid] Place Bid',
  props<{ auctionId: number; amount: number }>()
);

export const placeBidSuccess = createAction(
  '[Bid] Place Bid Success',
  props<{ 
    auctionId: number;
    amount: number;
    bidId: number;
  }>()
);

export const placeBidFailure = createAction(
  '[Bid] Place Bid Failure',
  props<{ 
    error: string;
  }>()
);

export const loadAuctionBids = createAction(
  '[Bid] Load Auction Bids',
  props<{ auctionId: number }>()
);

export const loadAuctionBidsSuccess = createAction(
  '[Bid] Load Auction Bids Success',
  props<{ auctionId: number; bids: any[] }>()
);

export const loadAuctionBidsFailure = createAction(
  '[Bid] Load Auction Bids Failure',
  props<{ error: string }>()
);

