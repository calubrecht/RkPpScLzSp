import { Component, OnInit } from '@angular/core';
import { ChatMessage} from '../chat-data';
import { ChatService} from '../chat.service';
import { USERS } from '../mock-users';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  chats : ChatMessage[];
  users = USERS;
  constructor(private chatService : ChatService) { }

  ngOnInit() {
    this.getChats();
  }

  getChats(): void 
  {
    this.chatService.getChats().
      subscribe(chats => this.chats = chats);
  }

  getUserColor(user : string)
  {
    for (let i in this.users)
    {
      let thisUser = this.users[i];
      if (thisUser.userName == user)
      {
        return thisUser.color;
      }
    }
    return 'white';
  }
  
}
