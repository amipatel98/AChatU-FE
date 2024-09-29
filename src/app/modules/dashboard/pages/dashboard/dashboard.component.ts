import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {DashboardService} from "../../service/dashboard.service";
import {LoginService} from "../../../login/services/login.service";
import {WebSocketService} from "../../../../core/web-socket/web-socket.service";
import * as moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {ForwardMessageComponent} from "../forward-message/forward-message.component";
import {AllUserModel} from "../../model/all-user.model";
import {
  ParticularConversationModel,
  RoomConversionModel,
  SendMessageConversationModel
} from "../../model/room-conversion.model";
import {InitiateRoomModel} from "../../model/initiate-room.model";
import {DeleteMessageModel} from "../../model/delete-message.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, AfterContentChecked, OnChanges  {
  dashboardForm: FormGroup;
  sendMessageForm: FormGroup
  chatList = [];
  currentUser:string = '';
  tempChatList = [];
  chatMessage = [];
  imagePath: string;
  imgData = [];
  format: string;
  initiateUserId = [];
  roomId: string;
  displayConversationMsg = [];
  decodedToken;
  usersList = [];
  currentDate;
  createdAt;
  userName: string;
  forwardMessageSend: boolean = false;
  forwardMessageList = [];
  replyTextMessage: boolean = false;
  showReplyMessage: string = '';
  selectedUserId;
  replyId: string = '';
  showEmojiPicker = false;
  formData;

  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'apple';
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  chatWithUser: string;
  chatId: any;
  forwardMessageId;
  conversationChatId;
  emojis;
  activeUser = [];
  uploadFiles;
  tempArray = [];
  replyImagePath;
  constructor(
      fb: FormBuilder,
      private router: Router,
      private dashboardService: DashboardService,
      private loginService: LoginService,
      public webSocketService: WebSocketService,
      public dialog: MatDialog,
      private _el: ElementRef,
      private cdRef:ChangeDetectorRef) {
    this.dashboardForm = fb.group({

    });
    this.sendMessageForm = fb.group({
      attachment: [''],
      messageText: ['']
    });
  }

  ngOnInit(): void {
    this.loginService.checkLogin();
    this.decodedToken = this.loginService.getUserId();

    /** @description getAllUsers() is used to get all users lists  */
    this.dashboardService.getAllUsers().subscribe((data: AllUserModel) => {
      console.log('data', data);
      data.users.forEach((userName) => {
        if (this.decodedToken.userId === userName._id) {
          this.userName = userName.firstName + ' ' + userName.lastName;
        }
        if (this.decodedToken.userId !== userName._id && userName.role === 'user' && userName.isActive) {
          this.usersList.push(userName);
          this.initiateUserId.push(userName._id);
          this.chatList.push(userName.firstName + ' ' + userName.lastName);
          this.tempChatList.push(userName.firstName + ' ' + userName.lastName);
          this.activeUser.push(userName._id);
        }
      })
    });
      this.getMessage();
      this.webSocketService.getMessages().subscribe((message) => {
      this.getRoomConversation();
      this.displayConversationMsg.push(message);
    });
  }

  getMessage() {
    this.dashboardService.getMessage().subscribe((res: RoomConversionModel) => {
      if(res && res?.conversation) {
        this.chatMessage.push(res.conversation[0]?.message.messageText);
      }
    });
  }

  particularChat(list, i) {
    this.currentUser = list;
    this.initiateRoom(i);
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  /** @description search() is used to search the user list  */
  search(value) {
    this.tempChatList = this.chatList.filter((element) => {
        return element.toUpperCase().indexOf(value.toUpperCase()) != -1
    });
  }

  /** @description upload() is used to upload the image and video in chat  */
  upload(event) {
    this.uploadFiles = event.target.files;
    let files = event.target.files;
    if (files.length === 0)
      return;
    const temp = Object.entries(event.target.files);
    this.tempArray = [];
    temp.forEach((item: any) => {
      this.tempArray.push(item[1]);
    });
    this.tempArray.forEach((item, i) => {
      let format = '';
      let mimeType = item.type;
      let reader = new FileReader();
      reader.readAsDataURL(item);
      if(mimeType.indexOf('image')> -1){
        format = 'image';
      } else if(mimeType.indexOf('video')> -1){
        format = 'video';
      }
      reader.onload = (_event) => {
        this.imgData.push({format: format, url: reader.result});
      }
    })
  }

  /** @description sendMessage() is used to send the message  */
  sendMessage() {
    this.showEmojiPicker = false;
    const formData: any = new FormData();
    const files: Array<File> = this.tempArray;
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }


    if(this.sendMessageForm.controls['messageText']?.value?.length || this.tempArray) {
      formData.append('messageText', this.sendMessageForm.controls['messageText'].value ? this.sendMessageForm.controls['messageText'].value : '');
      formData.append('replyMessageText', this.showReplyMessage);
      formData.append('replyMessageId', this.replyId);
      this.replyTextMessage = false;
      // const payload = {
      //   messageText: this.sendMessageForm.controls['messageText'].value,
      //   replyMessageText: this.showReplyMessage ? this.showReplyMessage : '',
      //   replyMessageId: this.replyId,
      // }
      this.dashboardService.sendMessage(formData, this.roomId).subscribe((res: SendMessageConversationModel) => {
        if (res) {
          this.imgData = [];
          this.tempArray = [];
          this.showReplyMessage = '';
          this.replyImagePath = '';
          this.getRoomConversation();
          this.cdRef.detectChanges();
        }
      });
      this.sendMessageForm.reset();
    }
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    this.scrollToBottom();
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
    this.scrollToBottom();
  }

  ngOnChanges() {
    this.cdRef.detectChanges();
    this.scrollToBottom();
  }

  public scrollToBottom() {
     const el: HTMLDivElement = this._el.nativeElement;
      el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }

  /** @description initiateRoom() is used to initiate the particular room of the user  */
  initiateRoom(index) {
    const payload = {
      userIds: [this.initiateUserId[index]]
    }
    this.selectedUserId = this.initiateUserId[index];
    this.dashboardService.initiateRooms(payload).subscribe((res: InitiateRoomModel) => {
      if(res) {
        this.roomId = res.chatRoom.chatRoomId;
        this.getRoomConversation();
      }
    })
  }

  /** @description getRoomConversation() is used to get the particular room conversations  */
  getRoomConversation() {
    this.dashboardService.getRoomConversation(this.roomId).subscribe((res: ParticularConversationModel) => {
      res.users.forEach(item => {
        if(item._id !== this.decodedToken.userId) {
          this.chatId = item._id;
          this.chatWithUser = item.firstName + ' ' + item.lastName;
        } else {
          this.chatWithUser = 'You';
        }
      })
      this.displayConversationMsg = [];
      this.currentDate = moment(new Date()).format('L');
      const rgularExp = {
        containsAlphabet:  /[a-zA-Z]/,
      };

      let imageArray = ['.jpg', '.png', '.jpeg', '.png', '.gif', '.tiff', '.psd', '.pdf', '.eps', '.raw', '.indd', '.svg' ];
      let videoArray = ['.mp3', '.mp4', '.webm', '.mpv', '.ogg', 'mp2', 'mpeg', '.mpv', 'mpe', 'm4v'];
      res.conversation.forEach((chat, index) => {
        this.imagePath = '';
        if(chat && chat.image && chat.image.length > 0) {
          chat.image.forEach((imagePath) => {
            if(imagePath && imagePath.imagePath) {
              this.imagePath = imagePath.imagePath;
              imageArray.forEach((itemImage) => {
                if(imagePath.imagePath.includes(itemImage)) {
                  imagePath.photo = true;
                }
              })
              videoArray.forEach((itemVideo) => {
                if (imagePath.imagePath.includes(itemVideo)) {
                  imagePath.video = true;
                }
              })
            }
          });
        }
        this.conversationChatId = chat._id;
        this.createdAt = moment(chat.createdAt).format('L');
        if(chat.message.messageText || (!chat.message.messageText && chat.image)) {
          this.displayConversationMsg.push({
            'checked': false,
            'messageId': chat.messageId,
            'message': chat.message.messageText,
            'replyText': chat.message.replyMessageText,
            'userId': chat.postedByUser?._id,
            'createdAt': moment(chat.createdAt).format('LT'),
            'createdDate': moment(chat.createdAt).format('L'),
            'forwarded': false,
            'emojiInclude': !rgularExp.containsAlphabet.test(chat.message.messageText) ? true : false,
            'imagePath': this.imagePath ? this.imagePath : '',
            'image': chat.image,
            '_id': chat?._id
          })
        } else {
          this.displayConversationMsg.push({
                'checked': false,
                'message': chat.message,
                'messageId': chat.messageId,
                'userId': chat.forwardByUser?._id,
                'createdAt': moment(chat.createdAt).format('LT'),
                'createdDate': moment(chat.createdAt).format('L'),
                'forwarded': true,
                'forwardedToUser': chat.forwardToUser,
                'emojiInclude': !rgularExp.containsAlphabet.test(chat.message) ? true : false,
                'imagePath': this.imagePath ? this.imagePath : '',
                '_id': chat?._id
              })
        }
        this.cdRef.detectChanges();
      })
    });
  }

  /** @description replyMessage() is used to reply of the message  */
  replyMessage(message) {
    this.replyId = message.messageId ? message.messageId : message._id;
    this.replyImagePath = message.imagePath;
    this.replyTextMessage = true;
    this.forwardMessageSend = false;
    this.showReplyMessage = message.message;

  }

  /** @description forwardMessage() is used to store the selected forward message list  */
  forwardMessage(message) {
    message.checked = true;
    this.forwardMessageList.push(message);
    this.replyTextMessage = false;
    this.forwardMessageSend = true;
  }

  /** @description deleteMessage() is used to delete the particular message  */
  deleteMessage(message) {
    this.dashboardService.deleteMessage(message._id, message.message).subscribe((res: DeleteMessageModel) => {
      console.log('res', res);
    })
  }

  /** @description forwardList() is used to add or remove the forward message from selected list  */
  forwardList(event, msg) {
    if(event.target.checked) {
      this.forwardMessageList.push(msg);
    } else {
      this.forwardMessageList.forEach((item, index) => {
        if(msg._id === item._id) {
          this.forwardMessageList.splice(index, 1);
        }
      });
    }

  }

  /** @description openForwardPopup() is used to open the forward popup  */
  openForwardPopup() {
    const dialogRef = this.dialog.open(ForwardMessageComponent, {
      width: '500px',
      panelClass: 'userlist',
      data: {msg: this.forwardMessageList, userList: this.usersList, roomId: this.roomId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        this.forwardMessageSend = false;
        this.forwardMessageList = [];
      }
    });
  }

  close() {
    this.showReplyMessage = '';
    this.forwardMessageSend = false;
    this.replyTextMessage = false;
    this.replyImagePath = '';
  }

  removeImage(index, image) {
    this.tempArray.splice(index, 1);
    this.imgData.forEach((item, index) => {
      if(item.url === image.url) {
        this.imgData.splice(index, 1);
      }
    });
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    let text = '';
    if(this.sendMessageForm.controls['messageText'].value) {
      text = this.sendMessageForm.controls['messageText'].value + event.emoji.native;
    } else {
      text = event.emoji.native;
      this.emojis = event.emoji.native;
    }

    this.sendMessageForm.controls['messageText'].setValue(text);
    // this.showEmojiPicker = false;
  }
}
