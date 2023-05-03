import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private tokenExpirationSubject = new BehaviorSubject<Date | null>(null);

  constructor(private router: Router,
    private httpClient: HttpClient) { }

  login(username: string, password: string) {
    this.httpClient.post<User>(`${environment.serverUrl}/api/auth/signin`, { username, password })
      .subscribe((res: User) => {
        console.log("RES", res);
        localStorage.setItem('accessToken', res.accessToken);
        this.router.navigate(['/']);
      });
  }

  checkAuthStatus(){
    
  }
  //call israa service in the backedn that check if the token expird or not
  /*isTokenExpired(): boolean {
    const tokenExpirationDate = this.tokenExpirationSubject.getValue();
    if (!tokenExpirationDate) {
      return true;
    }
    return new Date() > tokenExpirationDate;
  }*/


  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken !== null;
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.loggedInSubject.next(false);
    this.tokenExpirationSubject.next(null);
    this.router.navigate(['/api/auth/signin']);
  }
}