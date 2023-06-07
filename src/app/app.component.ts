import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth/auth.service";
import * as _ from "angular-material";
import { Type } from "src/app/role.enum";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    private authService: AuthService
  ) {}

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

    ngOnInit() {
      setInterval(() => {
        this.authService.isAuthenticated();
      }, 200000);

    }
    
  logout() {
    this.authService.logout();
  }    
  isUserOrAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === Type.ADMIN;
  }

}