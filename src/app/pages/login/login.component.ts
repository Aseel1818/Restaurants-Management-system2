import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  username: string = '';
  password!: number;

  constructor(private authService: AuthService,private router: Router) { 
    this.authService.checkAuthStatus();
  }

  ngOnInit() {
  }
 

  login() {
    this.authService.login(this.username, this.password);
    this.router.navigate(['/']);
  }

}