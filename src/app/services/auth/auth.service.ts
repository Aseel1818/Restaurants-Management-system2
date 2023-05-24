import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { ToastrService } from "ngx-toastr";
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) { }

  login(username: string, password: string) {
    this.httpClient.post<User>(`${environment.serverUrl}/api/auth/signin`, { username, password })
      .subscribe((res: User) => {
        console.log("RES", res);
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('role', res.roles[0]);

        this.router.navigate(['/']);
      });
  }

  checkAuth() {

    this.httpClient.get(`${environment.serverUrl}/api/auth/vtoken`).subscribe(res  => {
      if (res) {
        console.log("is valid token");
      } else {
        console.log("Token is not valid");
        this.toastr.warning('Your session has expired. Please save your work, you\'ll need to log in again in 10 seconds.', 'Warning', {
          timeOut: 10000,
          progressBar: true,
        });
        const delayObservable = of('').pipe(delay(10000));
        delayObservable.subscribe(() => {
          this.logout();
        });
      }
    });
  } 

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken){
      this.checkAuth();
      return accessToken !== null;
    }
    else {
      this.logout();
      return false;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/api/auth/signin']);
  }
  getUserRole(): string| null  {
    const role = localStorage.getItem('role');
    return role;
}
}