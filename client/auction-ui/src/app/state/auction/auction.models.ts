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
