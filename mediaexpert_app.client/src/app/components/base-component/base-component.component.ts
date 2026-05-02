import { inject, Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  template: ''
})
export abstract class BaseComponent {
  // We use inject() to avoid constructor problems in child classes
  protected snackBar = inject(MatSnackBar);

  private openSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  protected snackBarInfo = (msg: string) => this.openSnackBar(msg, 'blue-snackbar');
  protected snackBarSuccess = (msg: string) => this.openSnackBar(msg, 'green-snackbar');
  protected snackBarWarning = (msg: string) => this.openSnackBar(msg, 'orange-snackbar');
  protected snackBarError = (msg: string) => this.openSnackBar(msg, 'red-snackbar');
}
