import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('adminN', Validators.required),
    password: new FormControl('Admin1!', [
      Validators.required,
      Validators.pattern('^((?!.*[s])(?=.*[A-Z])(?=.*d).{4,99})')
    ])
  });

  showErrorMessages = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.showErrorMessages = true;
    });
  }

  login() {
    //this.authService.checkAuthStatus();
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authService.login(username!, password!);
  }
}