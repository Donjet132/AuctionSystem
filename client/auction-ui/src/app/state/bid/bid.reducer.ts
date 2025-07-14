import { createReducer, on } from '@ngrx/store';
import * as BidActions from './bid.actions';
import { initialBidState } from './bid.models';

export const bidReducer = createReducer(
  initialBidState,
  
  // Place Bid cases
  on(BidActions.placeBid, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(BidActions.placeBidSuccess, (state, { auctionId, amount, bidId }) => ({
    ...state,
    loading: false,
    currentBid: { auctionId, amount, bidId },
    error: null,
  })),
  
  on(BidActions.placeBidFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    currentBid: null,
  })),

  // Optional: Add cases for loading auction bids if you have these actions
  on(BidActions.loadAuctionBids, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(BidActions.loadAuctionBidsSuccess, (state, { auctionId, bids }) => ({
    ...state,
    loading: false,
    auctionBids: {
      ...state.auctionBids,
      [auctionId]: bids
    },
    error: null,
  })),
  
  on(BidActions.loadAuctionBidsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);