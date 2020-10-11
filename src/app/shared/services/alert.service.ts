import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _snackBar: MatSnackBar) {}

  public show(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }
}
