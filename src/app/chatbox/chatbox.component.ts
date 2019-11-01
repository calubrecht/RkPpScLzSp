import { Component, OnInit } from '@angular/core';
import { ChatMessage} from '../chat-data';
import { CHATS } from '../mock-chats';
import { USERS } from '../mock-users';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  chats = CHATS;
  users = USERS;
  constructor() { }

  ngOnInit() {
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
