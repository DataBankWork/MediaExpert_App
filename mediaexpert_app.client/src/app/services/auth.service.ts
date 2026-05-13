import { Injectable, signal } from '@angular/core';
import { AuthLogIn } from '../interfaces/Authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = signal<boolean>(false);

  isAuthenticated() {
    return this._isLoggedIn();
  }

  login(authLogIn: AuthLogIn) {
    if (authLogIn.email === "q@q" && authLogIn.password === "q") {
      this._isLoggedIn.set(true);
    }
  }

  logout() {
    this._isLoggedIn.set(false);
  }
}
