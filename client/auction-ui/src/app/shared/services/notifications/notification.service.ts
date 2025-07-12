import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';

export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  show(data: NotificationData): void {
    const config = {
      duration: data.duration || 5000,
      horizontalPosition: 'center' as const,
      verticalPosition: 'top' as const,
      panelClass: [`notification-${data.type}`],
      data: data
    };

    this.snackBar.openFromComponent(NotificationComponent, config);
  }

  success(message: string, duration?: number): void {
    this.show({
      message,
      type: 'success',
      duration
    });
  }

  error(message: string, duration?: number): void {
    this.show({
      message,
      type: 'error',
      duration: duration || 7000 // Longer duration for errors
    });
  }

  warning(message: string, duration?: number): void {
    this.show({
      message,
      type: 'warning',
      duration
    });
  }

  info(message: string, duration?: number): void {
    this.show({
      message,
      type: 'info',
      duration
    });
  }
}