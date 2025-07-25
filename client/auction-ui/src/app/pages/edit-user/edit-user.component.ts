import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../state/auth/auth.models';
import * as AuthActions from '../../state/auth/auth.actions';
import { selectAuthState } from '../../state/auth/auth.selectors';
import { AuthState } from '../../state/auth/auth.models';
import { NotificationService } from '../../shared/services/notifications/notification.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  editUserForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  hideOldPassword = true;
  hideNewPassword = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private notificationService: NotificationService
  ) {
    this.editUserForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserFromStorage();
    this.subscribeToAuthState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required,  Validators.minLength(3), Validators.maxLength(20)]],
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        if (this.currentUser) {
          this.editUserForm.patchValue({
            username: this.currentUser.username
          });
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }

  private subscribeToAuthState(): void {
    this.store.select(selectAuthState).pipe(
      takeUntil(this.destroy$)
    ).subscribe((authState: AuthState) => {
      const wasLoading = this.isLoading;
      this.isLoading = authState.loading;
      
      // Handle successful edit (loading finished without error)
      if (wasLoading && !authState.loading && !authState.error) {
        this.notificationService.success('Profile updated successfully!');
        // Update current user from localStorage
        this.loadUserFromStorage();
        // Reset only password fields, keep username
        this.editUserForm.patchValue({
          oldPassword: '',
          newPassword: ''
        });
      }
      
      // Handle error
      if (authState.error && !authState.loading) {
        this.notificationService.error(authState.error);
      }
    });
  }

  onSubmit(): void {
    if (!this.currentUser) {
      return;
    }

    const formValue = this.editUserForm.value;
    const hasUsernameChanged = formValue.username !== this.currentUser.username;
    const hasPasswordData = formValue.newPassword && formValue.oldPassword;

    // Check if there are any changes to submit
    if (!hasUsernameChanged && !hasPasswordData) {
      this.editUserForm.get('username')?.markAsTouched();
      if (formValue.newPassword && !formValue.oldPassword) {
        this.editUserForm.get('oldPassword')?.markAsTouched();
      }
      if (formValue.oldPassword && !formValue.newPassword) {
        this.editUserForm.get('newPassword')?.markAsTouched();
      }
      return;
    }

    // Validate based on what's being changed
    let isFormValid = true;

    // Username validation (always required if present)
    if (this.editUserForm.get('username')?.invalid) {
      this.editUserForm.get('username')?.markAsTouched();
      isFormValid = false;
    }

    // Password validation (both fields required if changing password)
    if (hasPasswordData) {
      if (!formValue.oldPassword) {
        this.editUserForm.get('oldPassword')?.setErrors({ required: true });
        this.editUserForm.get('oldPassword')?.markAsTouched();
        isFormValid = false;
      }
      if (!formValue.newPassword || formValue.newPassword.length < 6) {
        this.editUserForm.get('newPassword')?.setErrors({ 
          required: !formValue.newPassword, 
          minlength: formValue.newPassword && formValue.newPassword.length < 6 ? { requiredLength: 6, actualLength: formValue.newPassword.length } : null 
        });
        this.editUserForm.get('newPassword')?.markAsTouched();
        isFormValid = false;
      }
    } else if (formValue.newPassword || formValue.oldPassword) {
      // If only one password field is filled, show error on the empty one
      if (formValue.newPassword && !formValue.oldPassword) {
        this.editUserForm.get('oldPassword')?.setErrors({ required: true });
        this.editUserForm.get('oldPassword')?.markAsTouched();
        isFormValid = false;
      }
      if (formValue.oldPassword && !formValue.newPassword) {
        this.editUserForm.get('newPassword')?.setErrors({ required: true });
        this.editUserForm.get('newPassword')?.markAsTouched();
        isFormValid = false;
      }
    }

    if (!isFormValid) {
      return;
    }
    const updatedUser: any = {
      id: this.currentUser.id
    };

    if (hasUsernameChanged) {
      updatedUser.username = formValue.username;
    }

    if (hasPasswordData) {
      updatedUser.currentPassword = formValue.oldPassword;
      updatedUser.newPassword = formValue.newPassword;
    }

    this.store.dispatch(AuthActions.editUser({ user: updatedUser }));
  }

   onCancel(): void {
    if (this.currentUser) {
      this.editUserForm.patchValue({
        username: this.currentUser.username,
        currentPassword: '',
        newPassword: ''
      });
    }
    
    // Clear validation errors
    Object.keys(this.editUserForm.controls).forEach(key => {
      this.editUserForm.get(key)?.markAsUntouched();
    });
  }

  // Helper methods for template
  getErrorMessage(fieldName: string): string {
    const control = this.editUserForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${minLength} characters`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    switch (fieldName) {
      case 'username': return 'Username';
      case 'oldPassword': return 'Current Password';
      case 'newPassword': return 'New Password';
      default: return fieldName;
    }
  }

  hasError(fieldName: string): boolean {
    const control = this.editUserForm.get(fieldName);
    return !!(control?.errors && control.touched);
  }

  hasChanges(): boolean {
    if (!this.currentUser) return false;
    
    const formValue = this.editUserForm.value;
    const hasUsernameChanged = formValue.username !== this.currentUser.username;
    const hasPasswordData = formValue.newPassword && formValue.oldPassword;
    
    return hasUsernameChanged || hasPasswordData;
  }
}