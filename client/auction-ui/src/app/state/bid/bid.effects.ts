import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { BidService } from '../../services/bid.service';
import * as BidActions from './bid.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface PlaceBidResponse {
  success: boolean;
  message?: string;
  bidId?: number;
  amount?: number;
}

@Injectable()
export class BidEffects {
  private actions$ = inject(Actions);
  private bidService = inject(BidService);
  constructor() {}

  placeBid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BidActions.placeBid),
      mergeMap(action =>
        this.bidService.placeBid(action.auctionId, action.amount).pipe(
          map(response => 
            BidActions.placeBidSuccess({ 
              auctionId: action.auctionId,
              amount: action.amount,
              bidId: response.bidId
            })
          ),
          catchError((error: HttpErrorResponse) => 
            of(BidActions.placeBidFailure({ 
              error: error.error?.message || error?.message || 'Failed to place bid'
            }))
          )
        )
      )
    )
  );
}