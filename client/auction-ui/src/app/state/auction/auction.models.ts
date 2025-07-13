export interface AuctionState {
  auctions: Auction[];
  selectedAuction: Auction | null;
  loading: boolean;
  createLoading: boolean;
  error: string | null;
  createError: string | null;
  lastAction?: 'create' | 'update' | 'delete' | 'fetch' | 'fetchById' | null;
}

export interface Auction {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startPrice: number;
  currentPrice?: number;
  sellerId: number;
  isPaidOut?: boolean;
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startPrice: number;
}

export interface UpdateAuctionRequest {
  id: number;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  startPrice?: number;
}

export interface AuctionResponse {
  auction: Auction;
}

export interface AuctionsResponse {
  auctions: Auction[];
}