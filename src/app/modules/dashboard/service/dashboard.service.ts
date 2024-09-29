import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient, private socket: Socket) {
  }
  auth_token = localStorage.getItem('token')
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Barer ${this.auth_token}`
  })
  headersNew = new HttpHeaders({
    'enctype': 'multipart/form-data',
    'Authorization': `Barer ${this.auth_token}`
  })

  /** @description getAllUsers() is used to get the all user lists  */
  getAllUsers() {
    let url: any = environment.baseURL + 'users';
    return this.http.get(url);
  }

  /** @description initiateRooms() is used to initiate the particular rooms for the user  */
  initiateRooms(data) {
    let url: any = environment.baseURL + 'room/initiate';
    return this.http.post(url, data, {headers: this.headers});
  }

  /** @description sendMessage() is used to send the message  */
  sendMessage(message ,id) {
    let url: any = environment.baseURL + 'room/' + id + '/message';
    this.socket.emit('message', message);
    return this.http.post(url, message, {headers: this.headersNew});
  }

  getMessage () {
    let url: any = environment.baseURL + 'room';
    return this.http.get(url, {headers: this.headers});
  }

  /** @description getRoomConversation() is used to get the particular room conversations based on id */
  getRoomConversation(id) {
    let url: any = environment.baseURL + 'room/' + id;
    return this.http.get(url, {headers: this.headers});
  }

  /** @description forwardedMessage() is used to forward the message */
  forwardedMessage(id, data) {
    let url: any = environment.baseURL + `room/${id}/forward-message`;
    this.socket.emit('forward-message', data);
    return this.http.post(url, data, {headers: this.headers});
  }

  replyMessage(id, data) {
    let url: any = environment.baseURL + `room/${id}/reply-message`;
    return this.http.put(url, data, {headers: this.headers});
  }

  /** @description deleteMessage() is used to delete the message between both the users */
  deleteMessage(id, message) {
    let url: any = environment.baseURL + `delete/message/${id}`;
    this.socket.emit('message', id);
    return this.http.delete(url, {headers: this.headers});
  }
}
