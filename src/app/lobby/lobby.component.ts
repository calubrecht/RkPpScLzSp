import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UserLoginService } from '../user-login.service';
import { ChatMessage, ChatData } from '../chat-data';
import { ChatService } from '../chat.service';
import { HelloComponent } from '../hello.component';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { MsgService } from '../msg.service';
import { MsgComponent } from '../msg/msg.component'
import { UsersData, UserData } from '../user-data';
import { FindGameWidgetComponent } from '../find-game-widget/find-game-widget.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports: [FindGameWidgetComponent, UserDetailComponent, ChatboxComponent, MsgComponent, HelloComponent, FormsModule]
})
export class LobbyComponent implements OnInit {

  @ViewChild("userScroll") scrollRef : ElementRef;
  private lastHeight = -1;

  selectedUser: UserData;
  newChat: string;

  constructor(
    public loginService: UserLoginService, private msg: MsgService,
    private chatService: ChatService, private chatData: ChatData,
    public userData: UsersData) { }

  ngOnInit() {
    this.loginService.initSession();
    this.loginService.fetchUserName();
  }

  onSelect(user: UserData): void {
    this.selectedUser = user;
  }

  sendChat()
  {
    const msg = this.newChat;
    this.newChat = '';
    this.chatService .sendChat(new ChatMessage('', msg)).
      subscribe(cm => this.chatData.addChat(cm));
  }
  
  ngAfterViewChecked()
  {
    if (this.lastHeight != this.scrollRef.nativeElement.scrollHeight)
    {
      this.lastHeight = this.scrollRef.nativeElement.scrollHeight;
      this.scrollRef.nativeElement.scrollTop = this.lastHeight;
    }
  }

}
