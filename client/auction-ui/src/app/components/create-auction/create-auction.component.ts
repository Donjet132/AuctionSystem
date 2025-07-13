import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors  } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuctionState, Auction } from '../../state/auction/auction.models';
import * as AuctionActions from '../../state/auction/auction.actions';
import { selectAuctionState } from '../../state/auction/auction.selectors';
import { NotificationService } from '../../shared/services/notifications/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss']
})
export class CreateAuctionComponent implements OnInit, OnDestroy {
  auctionForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.auctionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      startPrice: [null, [Validators.required, Validators.min(0.01)]]
    }, {
      validators: [this.endDateFutureValidator.bind(this), this.startDateFutureValidator.bind(this), this.startDateValidator.bind(this), this.endDateValidator.bind(this)]
    });

    // Trigger validation on date changes
    this.auctionForm.get('startDate')?.valueChanges.subscribe(() => {
      this.auctionForm.get('endDate')?.markAsTouched();
    });

    this.auctionForm.get('endDate')?.valueChanges.subscribe(() => {
      this.auctionForm.get('startDate')?.markAsTouched();
    });
  }

  startDateFutureValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    
    if (startDate) {
      const start = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        // Mark the startDate field as having an error
        control.get('startDate')?.setErrors({ startDatePast: true });
        return { startDatePast: true };
      }
    }
    return null;
  }

  endDateFutureValidator(control: AbstractControl): ValidationErrors | null {
    const endDate = control.get('endDate')?.value;
    
    if (endDate) {
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (end < today) {
        // Mark the endDate field as having an error
        control.get('endDate')?.setErrors({ endDatePast: true });
        return { endDatePast: true };
      }
    }
    return null;
  }

  startDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value.startDate) return null;
    
    const startDate = new Date(control.value.startDate);
    const endDateControl = this.auctionForm?.get('endDate');
    const endDate = endDateControl?.value ? new Date(endDateControl.value) : null;
    
    if (endDate && startDate >= endDate) {
      control.get('startDate')?.setErrors({ startDateAfterEnd: true });
      return { startDateAfterEnd: true };
    }

    if (endDate && startDate < endDate && endDateControl?.hasError('endDateBeforeStart')) {
      const endDateErrors = { ...endDateControl.errors };
      delete endDateErrors['endDateBeforeStart'];
      const hasOtherErrors = Object.keys(endDateErrors).length > 0;
      endDateControl.setErrors(hasOtherErrors ? endDateErrors : null);
    }
    
    return null;
  }

  // End date validator - checks if end date is after start date
  endDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value.endDate) return null;
    
    const endDate = new Date(control.value.endDate);
    const startDateControl = this.auctionForm?.get('startDate');
    const startDate = startDateControl?.value ? new Date(startDateControl.value) : null;

    if (startDate && endDate <= startDate) {
      control.get('endDate')?.setErrors({ endDateBeforeStart: true });
      return { endDateBeforeStart: true };
    }
    
    if (startDate && endDate > startDate && startDateControl?.hasError('startDateAfterEnd')) {
      const startDateErrors = { ...startDateControl.errors };
      delete startDateErrors['startDateAfterEnd'];
      const hasOtherErrors = Object.keys(startDateErrors).length > 0;
      startDateControl.setErrors(hasOtherErrors ? startDateErrors : null);
    }
      
    return null;
  }

  ngOnInit(): void {
    // Subscribe to auction state changes
    this.store.select(selectAuctionState).pipe(
      takeUntil(this.destroy$)
    ).subscribe((auction: AuctionState) => {
      const wasLoading = this.isLoading;
      this.isLoading = auction.createLoading;
      
      if (wasLoading && !auction.createLoading && !auction.error) {
        this.notificationService.success('Auction created successfully!');
        this.auctionForm.reset();
        this.auctionForm.markAsUntouched();
        this.router.navigate(['/auctions']);
      }
      
      // Handle error
      if (auction.error && !auction.createLoading) {
        this.notificationService.error(auction.error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get title() {
    return this.auctionForm.get('title');
  }
  get description() {
    return this.auctionForm.get('description');
  }
  get startDate() {
    return this.auctionForm.get('startDate');
  }
  get endDate() {
    return this.auctionForm.get('endDate');
  }
  get startPrice() {
    return this.auctionForm.get('startPrice');
  }

  onSubmit() {
    if (this.auctionForm.valid) {
      const auction: Auction = this.auctionForm.value;
      this.store.dispatch(AuctionActions.createAuction({ auction }));
    } else {
      this.auctionForm.markAllAsTouched();
    }
  }

  onReset() {
    this.auctionForm.reset();
    this.auctionForm.markAsUntouched();
  }
}
