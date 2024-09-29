import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  /** @description signUp() is used registered the users */
  signUp(data) {
    let url: any = environment.baseURL + 'users';
    return this.http.post(url, data);
  }
}
