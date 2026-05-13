import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { AuthLogIn } from '../../interfaces/Authentication';


@Component({
  selector: 'app-authentication-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './authentication-dialog.component.html',
  styleUrl: './authentication-dialog.component.css'
})
export class AuthenticationDialogComponent {

  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthenticationDialogComponent>,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['q@q', [Validators.required, Validators.email]],
      password: ['q', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const authLogIn = this.loginForm.value as AuthLogIn;
    this.authService.login(authLogIn)
    if (authLogIn && this.authService.isAuthenticated()) {
      this.dialogRef.close(this.loginForm.value);
    }
    else {
      this.loginError = 'Incorrect login details';
    }
  }
}
