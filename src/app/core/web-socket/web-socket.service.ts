import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {Observable} from "rxjs";
import {Socket} from "ngx-socket-io";


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  webSocket: WebSocket;
  chatMessage = [];
  // socket;

  constructor(private socket: Socket) {
    // this.socket = io('http://localhost:3200');
  }

  // setupSocketConnection() {
  //   this.socket = io('wss://echo.websocket.org/');
  //   this.socket.on('message-broadcast', (data: string) => {
  //     if (data) {
  //       this.chatMessage.push(data);
  //      // const element = document.createElement('li');
  //       // element.innerHTML = data;
  //       // element.style.background = 'white';
  //       // element.style.padding =  '15px 30px';
  //       // element.style.margin = '10px';
  //       // document.getElementById('message-list').appendChild(element);
  //     }
  //   });
  // }

  sendMessage(message ) {
    this.socket.emit('message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }

  // public openWebSocket() {
  //   this.webSocket = new WebSocket('wss://echo.websocket.org/');
  //   this.webSocket.onopen = (event) => {
  //     console.log('Open', event);
  //   }
  //   this.webSocket.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     this.chatMessage.push(message);
  //     console.log('this.chatMessage', this.chatMessage);
  //   }
  //   this.webSocket.onclose = (event) => {
  //     console.log('Close', event);
  //   }
  // }
  //
  // public sendMessage(chatMessage) {
  //   console.log('chatMessage', chatMessage);
  //   this.webSocket.send(JSON.stringify(chatMessage));
  // }
  //
  // public closeWebSocket() {
  //   this.webSocket.close()
  // }
}
