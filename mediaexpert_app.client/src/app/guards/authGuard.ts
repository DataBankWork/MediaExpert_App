import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationDialogComponent } from '../components/authentication-dialog/authentication-dialog.component';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthLogIn } from '../interfaces/Authentication';

export const authGuardWithDialog: CanActivateFn = (route, state) => {
  const dialog = inject(MatDialog);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  }

  const dialogRef = dialog.open(AuthenticationDialogComponent);

  return dialogRef.afterClosed().pipe(
    map((result: AuthLogIn | undefined) => {
      if (!result) return false;

      

      if (authService.isAuthenticated()) {
        return true;
      } else {
        return false;
      }
    })
  );
};
