import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedInSubject = new BehaviorSubject<boolean>(false);
  public tokenExpirationSubject = new BehaviorSubject<Date | null>(null);

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  get loggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  get tokenExpiration(): Observable<Date | null> {
    return this.tokenExpirationSubject.asObservable();
  }

  /*login(username: string, password: number) {
    if (username=='admin' && password==123){
      const expirationDate = new Date('2023-04-08T15:40:00Z');
      this.tokenExpirationSubject.next(expirationDate);
      this.loggedInSubject.next(true);
      console.log("logged in");
    }
  }


  checkAuthStatus() {
    const expirationDate = this.tokenExpirationSubject.getValue();
    if (expirationDate && expirationDate > new Date()) {
      this.loggedInSubject.next(true);
    } else {
      this.loggedInSubject.next(false);
    }
  }*/

  login(username: string, password: number) {
    if (username == 'admin' && password == 123) {
      const expirationDate = new Date('2023-04-08T16:40:00Z');
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
      this.tokenExpirationSubject.next(expirationDate);
      this.loggedInSubject.next(true);
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
    return loggedIn && !tokenExpired;
  }

  logout() {
    localStorage.removeItem('tokenExpiration');
    this.loggedInSubject.next(false);
    this.tokenExpirationSubject.next(null);
    this.router.navigate(['/login']);
  }
  


}
