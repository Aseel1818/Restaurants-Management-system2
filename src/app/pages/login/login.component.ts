/*import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
username: string='';
  password: string='';
  constructor(private http: HttpClient, private router: Router) { }
  

  onSubmit() {
    this.http.post('/api/authenticate', { username: this.username, password: this.password })
      .subscribe((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['/home']);
      });
  }
  /*canActivate() {
    const isUserLoggedIn = localStorage.getItem('isLoggedIn');
    if (isUserLoggedIn) {
      this.router.navigate(['/menu']);
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  hide = true;

}
*/