import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = new FormControl('', Validators.required);
  password = new FormControl('', [Validators.required, Validators.minLength(8),
  Validators.pattern('^((?!.*[s])(?=.*[A-Z])(?=.*d).{8,99})')]);
  showErrorMessages = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit() {
    let hasError = false;
    if (this.username.invalid || this.password.invalid) {
      hasError = true;
    }
    if (!hasError) {
      this.login();
    }
    this.showErrorMessages = hasError;
  }

  login() {
    this.authService.checkAuthStatus();
    const username = this.username.value!;
    const password = this.password.value!;
    this.authService.login(username, password);
  }
}