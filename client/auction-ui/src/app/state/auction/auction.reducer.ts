import { createReducer, on } from '@ngrx/store';
import * as AuctionActions from './auction.actions';
import { Auction } from './auction.models';

export interface AuctionState {
  auctions: Auction[];
  loading: boolean;
  error: string | null;
}

export const initialState: AuctionState = {
  auctions: [],
  loading: false,
  error: null
};

export const auctionReducer = createReducer(
  initialState,
  on(AuctionActions.loadAuctions, (state) => ({ ...state, loading: true, error: null })),
  on(AuctionActions.loadAuctionsSuccess, (state, { auctions }) => ({
    ...state,
    auctions,
    loading: false
  })),
  on(AuctionActions.loadAuctionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
