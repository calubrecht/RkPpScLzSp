import { Component, OnInit } from '@angular/core';
import { ChatMessage} from '../chat-data';
import { CHATS } from '../mock-chats';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  chats = CHATS;
  constructor() { }

  ngOnInit() {
  }
  
}
