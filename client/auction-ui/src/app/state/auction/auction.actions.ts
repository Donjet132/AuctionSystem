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
