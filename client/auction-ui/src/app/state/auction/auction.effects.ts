import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuctionActions from './auction.actions';
import { AuctionService } from '../../services/auction.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuctionEffects {
  private actions$ = inject(Actions);
  private auctionService = inject(AuctionService);

  constructor() {}

  loadAuctions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.loadAuctions),
      mergeMap(() =>
        this.auctionService.getAuctions().pipe(
          map((auctions) => AuctionActions.loadAuctionsSuccess({ auctions })),
          catchError((error: HttpErrorResponse) => of(AuctionActions.loadAuctionsFailure({ error: error.error?.message || error?.message || 'Load auctions failed' })))
        )
      )
    )
  );

  createAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.createAuction),
      mergeMap(({ auction }) =>
        this.auctionService.createAuction(auction).pipe(
          map(({ id }) => {
            const createdAuction = { ...auction, id };
            return AuctionActions.createAuctionSuccess({ auction: createdAuction });
          }),
          catchError((error: HttpErrorResponse) => of(AuctionActions.createAuctionFailure({ error: error.error?.message || error?.message || 'Create auction failed' })))
        )
      )
    )
  );

  loadAuctionDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.loadAuctionDetails),
      mergeMap(action =>
        this.auctionService.getAuctionDetails(action.auctionId).pipe(
          map(auctionDetails => AuctionActions.loadAuctionDetailsSuccess({ auctionDetails })),
          catchError((error: HttpErrorResponse) => of(AuctionActions.loadAuctionDetailsFailure({ 
            error: error.error?.message || error?.message || 'Failed to load auction details' 
          })))
        )
      )
    )
  );
}
