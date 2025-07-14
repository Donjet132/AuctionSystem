import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, filter } from 'rxjs';
import { BidModalComponent, BidModalData, AuctionDetailsDto } from '../components/bid-modal/bid-modal.component';

export interface BidModalResult {
  success: boolean;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BidModalService {
  constructor(private dialog: MatDialog) {}

  /**
   * Opens the bid modal for a specific auction
   * @param auction The auction details
   * @returns Observable that emits the result when the modal is closed
   */
  openBidModal(auction: AuctionDetailsDto): Observable<BidModalResult> {
    const dialogRef: MatDialogRef<BidModalComponent, BidModalResult> = this.dialog.open(
      BidModalComponent,
      {
        width: '600px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        disableClose: false,
        autoFocus: true,
        restoreFocus: true,
        data: { auction } as BidModalData,
        panelClass: 'bid-modal-dialog'
      }
    );

    return dialogRef.afterClosed().pipe(
        filter((result): result is BidModalResult => result !== undefined)
    );
  }

  /**
   * Closes all open bid modals
   */
  closeAllBidModals(): void {
    this.dialog.closeAll();
  }
}