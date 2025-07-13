import { createAction, props } from '@ngrx/store';
import { Auction } from './auction.models';

export const loadAuctions = createAction('[Auction] Load Auctions');

export const loadAuctionsSuccess = createAction(
  '[Auction] Load Auctions Success',
  props<{ auctions: Auction[] }>()
);

export const loadAuctionsFailure = createAction(
  '[Auction] Load Auctions Failure',
  props<{ error: string }>()
);

export const createAuction = createAction(
  '[Auction] Create Auction',
  props<{ auction: Auction }>()
);

export const createAuctionSuccess = createAction(
  '[Auction] Create Auction Success',
  props<{ auction: Auction }>()
);

export const createAuctionFailure = createAction(
  '[Auction] Create Auction Failure',
  props<{ error: string }>()
);