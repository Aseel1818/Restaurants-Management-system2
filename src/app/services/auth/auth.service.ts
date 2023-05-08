import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { ToastrService } from "ngx-toastr";
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

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
        this.router.navigate(['/']);
      });
  }

  checkAuth() {
    this.httpClient.get(`${environment.serverUrl}/api/auth/vtoken`).subscribe(res => {
      if (res) {
        console.log("is valid token");
      } else {
        console.log("Token is not valid");
        this.toastr.warning('Your session has expired. Please save you work you"ll need login again in 10sec.', 'Warning', {
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

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken !== null;
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/api/auth/signin']);
  }
}