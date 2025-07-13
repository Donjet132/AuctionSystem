import { createReducer, on } from '@ngrx/store';
import * as AuctionActions from './auction.actions';
import { initialAuctionState, AuctionActionType } from './auction.models';

export const auctionReducer = createReducer(
  initialAuctionState,
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
  })),
   on(AuctionActions.loadAuctionDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
    lastAction: AuctionActionType.FETCH_DETAILS
  })),
  
  on(AuctionActions.loadAuctionDetailsSuccess, (state, { auctionDetails }) => ({
    ...state,
    auctionDetails,
    loading: false,
    error: null,
    lastAction: AuctionActionType.FETCH_DETAILS
  })),
  
  on(AuctionActions.loadAuctionDetailsFailure, (state, { error }) => ({
    ...state,
    auctionDetails: null,
    loading: false,
    error,
    lastAction: AuctionActionType.FETCH_DETAILS
  }))
);