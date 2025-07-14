export interface AuctionState {
  auctions: Auction[];
  selectedAuction: Auction | null;
  auctionDetails: AuctionDetailsDto | null;
  loading: boolean;
  createLoading: boolean;
  error: string | null;
  createError: string | null;
  lastAction?: AuctionActionType | null;
}

export const initialAuctionState: AuctionState = {
  auctions: [],
  selectedAuction: null,
  auctionDetails: null,
  loading: false,
  createLoading: false,
  error: null,
  createError: null,
  lastAction: null
};

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

export interface BidDto {
  id: string;
  amount: number;
  timePlaced: Date;
  bidderName: string;
}

export interface AuctionDetailsDto {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startPrice: number;
  winnerName: string | null;
  isSeller: boolean;
  bids: BidDto[];
  highestBid?: number;
}

export enum AuctionActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  FETCH = 'fetch',
  FETCH_BY_ID = 'fetchById',
  FETCH_DETAILS = 'fetchDetails'
}