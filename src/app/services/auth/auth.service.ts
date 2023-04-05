import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private isAuthenticated = false;

  login() {
  //  check token in local storage and it's expire date
  }

  public isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  public setAuthenticated(authenticated: boolean): void {
    this.isAuthenticated = authenticated;
  }
  
}
