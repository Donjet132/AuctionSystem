export interface BidState {
  loading: boolean;
  error: string | null;
  currentBid: {
    auctionId: number;
    amount: number;
    bidId: number;
  } | null;
  auctionBids: {
    [auctionId: number]: any[];
  };
}

export const initialBidState: BidState = {
  loading: false,
  error: null,
  currentBid: null,
  auctionBids: {}
};
