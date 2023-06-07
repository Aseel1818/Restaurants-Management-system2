import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Type } from "src/app/role.enum";


@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  role!: string | null;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.role = this.auth.getUserRole();
    this.homePage();

  }
  homePage() {
    if (this.role === Type.ADMIN) {
      this.router.navigate(['/dashboard']);
    } else if (this.role === Type.USER) {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/api/auth/signin']);
    }
  }

 
}
