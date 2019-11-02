import { Injectable } from '@angular/core';
import { ChatMessage } from './chat-data';
import { CHATS } from './mock-chats';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private api : ApiService) { }

  getChats() : Observable<ChatMessage[]>
  {
    return this.api.sendGet<ChatMessage[]>('chat/chats');
  }
  
  sendChat(chat: ChatMessage) : Observable<ChatMessage>
  {
    return this.api.sendPost<ChatMessage>('chat/chat', chat);
  }
}
