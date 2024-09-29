import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DashboardService} from "../../service/dashboard.service";
import {LoginService} from "../../../login/services/login.service";

@Component({
  selector: 'app-forward-message',
  templateUrl: './forward-message.component.html',
  styleUrls: ['./forward-message.component.scss']
})
export class ForwardMessageComponent implements OnInit {
  forwardMessageList = [];
  listOfIds = [];
  decodedToken;
  tempUserList = [];
  userList: [];
  constructor(
      public dialogRef: MatDialogRef<ForwardMessageComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dashboardService: DashboardService,
      private loginService: LoginService) {}

  ngOnInit(): void {
    this.decodedToken = this.loginService.getUserId();
    this.tempUserList = this.data.userList;
    this.tempUserList.forEach((item) => {
      item.fullName = item.firstName + ' ' + item.lastName;
    })
  }

  /** @description forwardMessageToUser() is used to add or remove user form selected forward message list  */
  forwardMessageToUser(event, user) {
    if(event.target.checked) {
      this.initiateRoom(user);
    } else {
      this.listOfIds.forEach((item, index) => {
        if(user._id === item.userId) {
          this.listOfIds.splice(index, 1);
        }
      })
    }
    // if(event.target.checked) {
    //    this.forwardMessageList.push(user._id);
    // } else {
    //   this.forwardMessageList.forEach((item, index) => {
    //     console.log('item', item,index);
    //     if(user._id === item) {
    //       this.forwardMessageList.splice(index, 1);
    //     }
    //   });
    // }
  }

  /** @description sendMessage() is used to send the selected forward message to users  */
  sendMessage() {
    let payloadList = [];
    this.data.msg.forEach((item, id) => {
      const payload = {
        'message': item.message,
        'messageId': item.messageId ? item.messageId : item._id,
        'roomId': this.data.roomId,
        'forwardByUser': this.decodedToken.userId,
        'forwardToUser': this.listOfIds ,
      }
      payloadList.push(payload)
    })
    this.dashboardService.forwardedMessage(this.data.roomId, payloadList ).subscribe((res: any) => {
      if(res) {
        this.close();
      }
    })
  }

  /** @description initiateRoom() is used to initiate the room of the user  */
  initiateRoom(user) {
    const payload = {
      userIds: [user._id]
    }
    this.dashboardService.initiateRooms(payload).subscribe((res: any) => {
      console.log('res', res);
      if (res) {
        this.listOfIds.push({
          'userId' : user._id,
          'chatRoomId': res.chatRoom.chatRoomId
        })
      }

    })
  }

  close() {
    this.dialogRef.close(true);
  }

  /** @description search() is used to search the users  */
  search(value) {
    this.userList = this.data.userList;
    this.tempUserList = this.userList.filter((element: any) => {
      return element.fullName.toUpperCase().indexOf(value.toUpperCase()) != -1
    });
  }

}
