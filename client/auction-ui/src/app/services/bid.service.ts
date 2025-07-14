import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PlaceBidRequest {
  auctionId: number;
  amount: number;
}

export interface PlaceBidResponse {
  success: boolean;
  message?: string;
  bidId: number;
  amount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private readonly apiUrl = `${environment.apiUrl}/bids`;

  constructor(private http: HttpClient) {}

  placeBid(auctionId: number, amount: number): Observable<PlaceBidResponse> {
    const request: PlaceBidRequest = { auctionId, amount };
    return this.http.post<PlaceBidResponse>(`${this.apiUrl}/place`, request);
  }
}