import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {io} from "socket.io-client";
import {environment} from "../../../../environments/environment";
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private http: HttpClient, private socket: Socket) {
  }
  auth_token = localStorage.getItem('token')
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Barer ${this.auth_token}`
  })

  /** @description searchAllMessages() is used to identify the chain of the forward message list */
  searchAllMessages(data) {
    let url: any = environment.baseURL + 'room/search-message';
    // this.socket.emit('message', data);
    return this.http.post(url, data, {headers: this.headers});
  }

  /** @description deleteMessages() is used to delete the all the forwarded message from all users */
  deleteMessages(id) {
    let url: any = environment.baseURL + 'delete/messages/' + id;
    this.socket.emit('message', id);
    return this.http.delete(url, {headers: this.headers});
  }

  /** @description activeUsers() is used to active and block the user */
  activeUsers(id, payload) {
    let url: any = environment.baseURL + 'users/' + id;
    return this.http.put(url, payload, {headers: this.headers});
  }

  // /** @description createTag is used to create a new tag */
  // createTag(tag: TagInfo): Observable<any> {
  //   return this.httpService.post(`${this.CVBE_API}/cvbe/tags/create`, tag)
  //       .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  // }
}
