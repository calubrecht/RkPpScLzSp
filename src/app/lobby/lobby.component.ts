import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UserLoginService } from '../user-login.service';
import { ChatMessage, ChatData } from '../chat-data';
import { ChatService } from '../chat.service';
import { MsgService } from '../msg.service';
import { UsersData, UserData } from '../user-data';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  
  selectedUser : UserData;
  newChat: string;

  constructor(public loginService : UserLoginService, private msg : MsgService, private chatService : ChatService, private chatData : ChatData, public userData: UsersData) { }

  ngOnInit() {

		this.loginService.fetchUserName();
  }

  onSelect(user : UserData) : void {
   this.selectedUser = user; 
  }
  
  sendChat()
  {
    let msg = this.newChat;
    this.newChat = '';
    this.chatService .sendChat(new ChatMessage('', msg)).
      subscribe(cm => this.chatData.addChat(cm));
  }

}
