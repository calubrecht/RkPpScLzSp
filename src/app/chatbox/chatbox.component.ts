import { Component, OnInit } from '@angular/core';
import { ChatMessage, ChatData} from '../chat-data';
import { ChatService} from '../chat.service';
import { UsersData } from '../user-data';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  users = this.userData.userList;
  constructor(private chatService: ChatService, private chatData: ChatData, private userData: UsersData) { }

  ngOnInit() {
    this.getChats();
  }

  getChats(): void
  {
    this.chatService.getAndSubscribeChats();
  }

  chats(): ChatMessage[]
  {
    return this.chatData.getChats();
  }

  private hashCode(s) {
    let h  = 0;
    for (let i = 0; i < s.length; i++)
    {
      h = Math.imul(31, h) + s.charCodeAt(i);
    }
    return h;
  }

  getUserColor(user: string)
  {
    for (const k of Object.keys(this.users))
    {
      const thisUser = this.users[k];
      if (thisUser.userName === user)
      {
        return thisUser.color;
      }
    }
    const guestColors = ['orange', 'yellow', 'white', 'black', 'blue', 'green'];
    return guestColors[this.hashCode(user) % guestColors.length];
    return 'white';
  }

}
