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
    username: new FormControl('iisraa', Validators.required),
    password: new FormControl('israa@iii!', [
      Validators.required,
      //Validators.pattern('^((?=.*d).{4,99})')
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
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authService.login(username!, password!);
  }
}