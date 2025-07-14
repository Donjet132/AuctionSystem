import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

export interface AuctionDetailsDto {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startPrice: number;
  winnerName?: string | null;
  isSeller: boolean;
  highestBid?: number;
  bids: BidDto[];
}

export interface BidDto {
  id: string;
  amount: number;
  timePlaced: Date;
  bidderName: string;
}

export interface BidModalData {
  auction: AuctionDetailsDto;
}

@Component({
  selector: 'app-bid-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './bid-modal.component.html',
  styleUrls: ['./bid-modal.component.scss']
})
export class BidModalComponent implements OnInit, OnDestroy {
  bidForm: FormGroup;
  isLoading = false;
  minBidAmount: number;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public dialogRef: MatDialogRef<BidModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BidModalData
  ) {
    this.minBidAmount = this.calculateMinBidAmount();
    this.bidForm = this.createBidForm();
  }

  ngOnInit(): void {
    // Subscribe to any relevant store selectors here if needed
    // Example: this.store.select(selectBidLoading).pipe(takeUntil(this.destroy$)).subscribe(...)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateMinBidAmount(): number {
    const { auction } = this.data;
    const currentHighest = auction.highestBid || 0;
    const startPrice = auction.startPrice;
    
    // Minimum bid should be higher than both starting price and current highest bid
    return Math.max(currentHighest, startPrice) + 0.01;
  }

  private createBidForm(): FormGroup {
    return this.fb.group({
      amount: [
        this.minBidAmount,
        [
          Validators.required,
          Validators.min(this.minBidAmount),
          Validators.pattern(/^\d+(\.\d{1,2})?$/) // Allow up to 2 decimal places
        ]
      ]
    });
  }

  get amountControl() {
    return this.bidForm.get('amount');
  }

  getAmountErrorMessage(): string {
    const control = this.amountControl;
    if (control?.hasError('required')) {
      return 'Bid amount is required';
    }
    if (control?.hasError('min')) {
      return `Bid must be at least $${this.minBidAmount.toFixed(2)}`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid amount (max 2 decimal places)';
    }
    return '';
  }

  onSubmit(): void {
    if (this.bidForm.valid && !this.isLoading) {
      this.isLoading = true;
      const bidAmount = this.bidForm.value.amount;
      
      this.dialogRef.close({ success: true, amount: bidAmount });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  isAuctionActive(): boolean {
    const now = new Date();
    const endDate = new Date(this.data.auction.endDate);
    return now < endDate;
  }
}