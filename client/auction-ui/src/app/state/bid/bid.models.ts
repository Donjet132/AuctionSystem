export interface BidState {
  loading: boolean;
  error: string | null;
  success: boolean;
  currentBid: {
    auctionId: number;
    amount: number;
    bidId: number;
  } | null;
  auctionBids: {
    [auctionId: string]: any[];
  };
}

export const initialBidState: BidState = {
  loading: false,
  error: null,
  currentBid: null,
  success: false,
  auctionBids: {}
};
