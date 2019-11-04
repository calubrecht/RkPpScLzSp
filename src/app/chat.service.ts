import { Injectable } from '@angular/core';
import { ChatMessage, ChatData } from './chat-data';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private api : ApiService, private subs: SubscriptionService,
   private chatData : ChatData) { }

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
    return this.subs.subscribe<ChatMessage>('/topic/chat')
  }

  public getAndSubscribeChats()
  {
    let thisNow = this;
    this.getChats().
      subscribe(chats => thisNow.chatData.addChats(chats));
    this.subscribe().
      subscribe(chat => thisNow.chatData.addChat(chat));
  }
}
