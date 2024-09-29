import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/admin-dashboard']);
  }

  signUp() {
    this.router.navigate(['/admin-dashboard/admin-registration']);
  }

}
