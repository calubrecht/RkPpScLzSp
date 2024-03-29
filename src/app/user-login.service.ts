import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Observable } from 'rxjs';
import {Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';
import { GameService } from './game.service';
import { SubscriptionService } from './subscription.service';
import { ChatService } from './chat.service';
import { StorageService } from './storage.service';
import { UsersData, UserMessage } from './user-data';

const TOKEN = 'TOKEN';

@Injectable({providedIn: 'root'})
export class UserLoginService {

  userName = '';
  loggedIn = false;
  initted = false;
  versionFetched = false;

  constructor(
    private router: Router, private api: ApiService, private msg: MsgService,
    private sub: SubscriptionService, private storage: StorageService,
    private game: GameService, private userData: UsersData, private chat: ChatService)
  {}

  setName(name: string): void{
    this.userName = name;
    this.storage.setName(name);
  }

  getName(): string
  {
    return this.userName;
  }

  fetchUserName()
  {
    this.api.sendGetString('sessions/userName').
      subscribe((name: string) => {this.setName(name); });
  }

  initSession()
  {
    if (this.initted)
    {
      return;
    }
    this.api.sendGetString('sessions/init').
      subscribe((name: string) => { this.fetchVersion(); this.initted = true; });
    this.sub.onWSDisconnect(() => this.logOut("Stomp Error"));
  }
  
  fetchVersion()
  {
    if (this.versionFetched)
    {
      return;
    }
    this.api.sendGetString('version').
      subscribe( (version: string) => { console.log('Server-version:' +version); this.versionFetched = true; });
  }

  logIn(name: string, userPassword: string)  {
    this.api.sendPost<UserMessage>(
       'sessions/login',
       {userName: name , password: userPassword}).
    subscribe( res => {
      this.storage.setToken(res.token);
      this.setLoggedIn(name);
      this.msg.clearMsgs();
      this.fetchUserName();
      this.router.navigateByUrl('lobby'); });
  }

  register(name: string, userPassword: string, userColor: string)  {
    this.api.sendPost<UserMessage>(
       'sessions/register',
       {userName: name , password: userPassword, color: userColor}).
    subscribe( res => {
      this.storage.setToken(res.token);
      this.setLoggedIn(name);
      this.msg.clearMsgs();
      this.fetchUserName();
      this.router.navigateByUrl('lobby'); });
  }

  logInGuest()  {
    this.api.sendPost<UserMessage>(
       'sessions/loginGuest',
       {}).
    subscribe( res => {
      this.storage.setToken(res.token);
      this.setLoggedIn(res.userName);
      this.userData.createUser(res.userName);
      this.msg.clearMsgs();
      this.fetchUserName();
      this.router.navigateByUrl('lobby'); });
  }

  isLoggedIn() {
    return this.storage.getToken() != null;
  }

  setLoggedIn(name: string)
  {
    this.userName = name;
    this.loggedIn = true;
  }

  logOut(error: string)
  {
    // http logout
    this.logOutClient(error);
    this.api.sendPost<UserMessage>(
       'sessions/logout').
    subscribe( res => { });
  }
  logOutClient(error: string)
  {
    this.initted = false;
    this.logOutClientLocal(error);
    // Send logout message to server?
  }

  parseMsg(error: string)
  {
    if (error.startsWith("<html>"))
    {
      return "Unable to authenticate. Please login";
    }
    return error;
  }

  logOutClientLocal(error: string)
  {
    this.game.unsubscribe();
    this.chat.unsubscribe();
    this.sub.unsubscribeAll();
    this.userName = '';
    this.loggedIn = false;
    this.storage.clearToken();
    this.msg.clearMsgs();
    this.msg.setMessage(this.parseMsg(error));
    this.router.navigateByUrl('login');
  }


}
