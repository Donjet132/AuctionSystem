import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auction, AuctionDetailsDto } from '../state/auction/auction.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private apiUrl = `${environment.apiUrl}/auctions`;

  constructor(private http: HttpClient) {}

  // Get all auctions
  getAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl);
  }

  // Get auction by ID
  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`);
  }

  // Create a new auction
  createAuction(auction: Auction): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, auction);
  }

  // Edit/update an auction
  updateAuction(id: number, auction: Auction): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, auction);
  }

  // Delete an auction
  deleteAuction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAuctionDetails(auctionId: number): Observable<AuctionDetailsDto> {
    return this.http.get<AuctionDetailsDto>(`${this.apiUrl}/${auctionId}`);
  }
}
