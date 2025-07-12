import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuctionService } from '../../services/auction.service';
import * as AuctionActions from './auction.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

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
          catchError((error) => of(AuctionActions.loadAuctionsFailure({ error: error.message || 'Load auctions failed' })))
        )
      )
    )
  );
}
