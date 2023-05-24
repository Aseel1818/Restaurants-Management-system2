import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent {
  role!: string | null;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.role = this.auth.getUserRole();
    this.navigateToRolePage();

  }
  navigateToRolePage() {
    if (this.role === 'ROLE_ADMIN') {
      this.router.navigate(['/dashboard']);
    } else if (this.role === 'ROLE_USER') {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/api/auth/signin']);
    }
  }

}
