import { Injectable } from '@angular/core';
import { ChatMessage } from './chat-data';
import { CHATS } from './mock-chats';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private api : ApiService, private subs: SubscriptionService) { }

  getChats() : Observable<ChatMessage[]>
  {
    return this.api.sendGet<ChatMessage[]>('chat/chats');
  }
  
  sendChat(chat: ChatMessage) : Observable<ChatMessage>
  {
    return this.api.sendPost<ChatMessage>('chat/chat', chat);
  }

  subscribe()
  {
    return this.subs.subscribe<ChatMessage[]>('chat/chats', 500);
  }
}
