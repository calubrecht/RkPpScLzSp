import { Injectable } from '@angular/core';
import { ChatMessage, ChatData } from './chat-data';
import { Observable, of, Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private subscription : Subscription;
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
    return this.subs.subscribe<ChatMessage>('/topic/chat');
  }

  unsubscribe()
  {
    this.subscription.unsubscribe();
  }

  public getAndSubscribeChats()
  {
    let thisNow = this;
    this.getChats().
      subscribe(chats => thisNow.chatData.addChats(chats));
    this.subscription = this.subscribe().
      subscribe(chat => thisNow.chatData.addChat(chat));
  }
}
