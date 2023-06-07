import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Type } from '../role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      const role = localStorage.getItem('role');
      const isAdmin = role === Type.ADMIN;
      console.log(isAdmin);
      if (!isAdmin && route.url[0]?.path === "dashboard") {
        return this.router.navigate(['/menu']);
      }
     
      return true;
    } else {
      return this.router.navigate(['/api/auth/signin']);
    }
  }
}