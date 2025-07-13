import { createReducer, on } from '@ngrx/store';
import * as AuctionActions from './auction.actions';
import { AuctionState } from './auction.models';

const initialState: AuctionState = {
  auctions: [],
  selectedAuction: null,
  loading: false,
  createLoading: false,
  error: null,
  createError: null,
  lastAction: null
};

export const auctionReducer = createReducer(
  initialState,
  on(AuctionActions.loadAuctions, (state) => ({ ...state, loading: true, error: null })),
  on(AuctionActions.loadAuctionsSuccess, (state, { auctions }) => ({
    ...state,
    auctions,
    loading: false,
  })),
  on(AuctionActions.loadAuctionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Auction cases
  on(AuctionActions.createAuction, (state) => ({
    ...state,
    createLoading: true,
    createError: null,
  })),
  on(AuctionActions.createAuctionSuccess, (state, { auction }) => ({
    ...state,
    createLoading: false,
    auctions: [...state.auctions, auction],
  })),
  on(AuctionActions.createAuctionFailure, (state, { error }) => ({
    ...state,
    createLoading: false,
    createError: error,
  }))
);