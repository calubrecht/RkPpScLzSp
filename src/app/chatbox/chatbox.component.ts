import { Component, OnInit } from '@angular/core';
import { ChatMessage, ChatData} from '../chat-data';
import { ChatService} from '../chat.service';
import { USERS } from '../mock-users';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  users = USERS;
  constructor(private chatService : ChatService, private chatData : ChatData) { }

  ngOnInit() {
    this.getChats();
  }

  getChats(): void 
  {
    this.chatService.getAndSubscribeChats();
  }

  chats() : ChatMessage[]
  {
    return this.chatData.getChats();
  }

  getUserColor(user : string)
  {
    if (user.startsWith("Guest-"))
    {
      let guestID = user.substring(6);
      let guestInt =  parseInt(guestID);
      let guestIdx = guestInt % 6;
      let guestColors = ["orange", "yellow", "white", "black", "blue", "green"];
      return guestColors[guestIdx];
    }
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
