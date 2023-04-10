import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private tokenExpirationSubject = new BehaviorSubject<Date | null>(null);

  constructor(private router: Router) { }

  login(username: string, password: string) {
    this.checkAuthStatus();
    if (username == 'admin' && password == '123') {
      const expirationDate = new Date('2024-04-08T16:40:00Z');
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
      this.tokenExpirationSubject.next(expirationDate);
      this.loggedInSubject.next(true);
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/']);
      console.log("logged in");
    }
  }

  checkAuthStatus() {
    // const expirationDate = this.tokenExpirationSubject.getValue();
    const expirationDate = localStorage.getItem('tokenExpiration');
    if (expirationDate && new Date(expirationDate) > new Date()) {
      this.loggedInSubject.next(true);
      this.tokenExpirationSubject.next(new Date(expirationDate));
    } else {
      this.loggedInSubject.next(false);
      this.tokenExpirationSubject.next(null);
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('isLoggedIn');
    }
  }

  isTokenExpired(): boolean {
    const tokenExpirationDate = this.tokenExpirationSubject.getValue();
    if (!tokenExpirationDate) {
      return true;
    }
    return new Date() > tokenExpirationDate;
  }

  isLoggedIn(): boolean {
    const loggedIn = this.loggedInSubject.getValue();
    const tokenExpired = this.isTokenExpired();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return (loggedIn && !tokenExpired) || isLoggedIn;
  }

  logout() {
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('isLoggedIn');
    this.loggedInSubject.next(false);
    this.tokenExpirationSubject.next(null);
    this.router.navigate(['/login']);
  }
}