import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../../login/services/login.service";
import {Router} from "@angular/router";
import {AdminDashboardService} from "../../service/admin-dashboard.service";
import * as moment from 'moment';
import {DashboardService} from "../../../dashboard/service/dashboard.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {ParticularConversationModel} from "../../../dashboard/model/room-conversion.model";
import {activeUser, DeleteMessageModel} from "../../../dashboard/model/delete-message.model";
import {AllUserModel} from "../../../dashboard/model/all-user.model";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  decodedToken;
  searchResult;
  chatId;
  userList = [];
  receiver;
  searchInputMessage;
  // ab;
  tempUserList = [];
  constructor(private loginService: LoginService,
              private router: Router,
              private adminDashboardService: AdminDashboardService,
              private dashboardService: DashboardService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginService.checkLogin();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /** @description searchMessage() is used to identify the chain of the forwarded message */
  searchMessage(message) {
    this.searchInputMessage = message;
    const payload = {
      message: message
    }
    if(message) {
      this.adminDashboardService.searchAllMessages(payload).subscribe((res: ParticularConversationModel) => {
        if (res?.conversation && res?.conversation[0] && res?.conversation[0]._id) {
          this.chatId = res.conversation[0]._id;
        }
        res.conversation.forEach((item) => {
          res.conversation.forEach((item1) => {
            if (item1.messageId && item._id === item1.messageId) {
              this.chatId = item._id;
            }
          })
        })
        this.searchResult = res.conversation;
        res.conversation.forEach((item) => {
          if (item && item.Users) {
            this.receiver = item.Users.filter((user) => user._id != item.postedByUser._id);
          }
        })
      })
    } else {
      this.searchResult = [];
    }
  }

  /** @description deleteMessages() is used to delete all the forwarded message from all users */
  deleteMessages() {
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'Delete nuisance message from all users',
      icon: 'warning',
      showCloseButton: true,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value && this.searchInputMessage.length) {
        this.adminDashboardService.deleteMessages(this.chatId).subscribe((res: DeleteMessageModel) => {
          if(res) {
            this.searchMessage(this.searchInputMessage);
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  /** @description getAllUserList() is used to get all users list */
  getAllUserList() {
    this.dashboardService.getAllUsers().subscribe((res: AllUserModel) => {
      this.tempUserList = [];
      this.userList = [];
        res.users.forEach((item) => {
          if(item.role !== 'admin') {
            item.fullName = item.firstName + ' ' + item.lastName;
            this.tempUserList.push(item);
            this.userList.push(item);
          }
        })
    })
  }

  /** @description activeUser() is used to active and block the user */
  activeUser(event, users) {
    const payload = {
      'isActive': event.checked
    }
    this.adminDashboardService.activeUsers(users._id, payload).subscribe((res: activeUser) => {
      users.isActive = !users.isActive;
    });
  }

  /** @description searchUserList() is used to search the user */
  searchUserList(value) {
    this.tempUserList = this.userList.filter((element: any) => {
      return element.fullName.toUpperCase().indexOf(value.toUpperCase()) != -1
    });
  }

}
