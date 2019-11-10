import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

import { ChatMessage, ChatData } from './chat-data';
import { UserData, UsersData } from './user-data';
import { ApiService } from './api.service';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private subscription : Subscription;
  private usersSubscription : Subscription;
  constructor(private api : ApiService, private subs: SubscriptionService,
   private chatData : ChatData, private userData : UsersData) { }

  getChats() : Observable<ChatMessage[]>
  {
    return this.api.sendGet<ChatMessage[]>('chat/chats');
  }
  
  getUsers() : Observable<UserData[]>
  {
    return this.api.sendGet<UserData[]>('users/');
  }
  
  sendChat(chat: ChatMessage) : Observable<ChatMessage>
  {
    return this.api.sendPost<ChatMessage>('chat/chat', chat);
  }

  subscribe()
  {
    return this.subs.subscribe<ChatMessage>('/topic/chat');
  }
  
  subscribeUsers()
  {
    return this.subs.subscribe<UserData>('/topic/users');
  }
 
  unsubscribe()
  {
    if (this.subscription)
    {
      this.subscription.unsubscribe();
    }
    if (this.usersSubscription)
    {
      this.usersSubscription.unsubscribe();
    }
  }

  public getAndSubscribeChats()
  {
    let thisNow = this;
    this.getChats().
      subscribe(chats => thisNow.chatData.addChats(chats));
    this.getUsers().
      subscribe(users => thisNow.userData.addUsers(users));
    this.subscription = this.subscribe().
      subscribe(chat => thisNow.chatData.addChat(chat));
    this.usersSubscription = this.subscribeUsers().
      subscribe(user => thisNow.userData.updateUser(user));
  }
}
