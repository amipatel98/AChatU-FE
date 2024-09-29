import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import jwtDecode from "jwt-decode";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  decodedToken;
  constructor(private http: HttpClient,
              private router: Router) { }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  /** @description getUserId() is used to decode the jwt token */
  getUserId() {
    if(localStorage.getItem('token')) {
      return jwtDecode(localStorage.getItem('token'));
    }
  }

  /** @description checkLogin() is checked that authorized user can visit the page  */
  checkLogin() {
    this.decodedToken = this.getUserId();
    if (this.decodedToken) {
      if (this.decodedToken.role === 'admin') {
        localStorage.setItem('userType', this.decodedToken.role);
        this.router.navigate(['/admin-dashboard']);
      } else if (this.decodedToken.role === 'user') {
        localStorage.setItem('userType', this.decodedToken.role);
        this.router.navigate(['/dashboard']);
      } else {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    }
  }

  setUserId(userId) {
    localStorage.setItem('userId', userId);
  }

  logout() {
    localStorage.clear();
  }

  /** @description login() is used to authenticate the user  */
  login(data) {
    let url: any = environment.baseURL + 'login';
    return this.http.post(url, data);
  }
}
