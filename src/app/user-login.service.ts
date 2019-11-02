import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Observable } from 'rxjs';
import {Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';
import { SubscriptionService } from './subscription.service';
import { ChatService } from './chat.service';

 const TOKEN='TOKEN';

@Injectable({providedIn:"root"})
export class UserLoginService {

  userName_ = '';
  loggedIn_ = false;

  constructor(private router : Router, private api : ApiService, private msg : MsgService, private sub : SubscriptionService) 
  {}
 
  setName(name: string) : void{
    this.userName_ = name;
  }

  getName() : string 
  {
    return this.userName_;
  }

  fetchUserName()
  {
    this.api.sendGetString('sessions/userName').
	    subscribe((name : string) => {this.setName(name)});
  }

  logIn(name: string, password : string)  {
    this.api.sendPostForString(
       'sessions/login',
       {'userName':name , 'password':password}).
    subscribe( res=> {
      this.setToken(res);
      this.setLoggedIn(name);
      this.msg.clearMsgs();
      this.fetchUserName();
		  this.router.navigateByUrl("lobby")});
  }

  setToken(token)
  {
    localStorage.setItem('TOKEN', token);
  }
  getToken()
  {
    return localStorage.getItem('TOKEN');
  }

  isLoggedIn() {
    return this.getToken() != null
  }

  setLoggedIn(name : string)
  {
    this.userName_ = name;
    this.loggedIn_ = true;
  }

  logOut(error : string)
  {
    // http logout
    this.logOutClient(error);
  }
  logOutClient(error : string)
  {
    this.sub.unsubscribeAll();
    this.userName_ = '';
    this.loggedIn_ = false;
    localStorage.removeItem('TOKEN');
    this.msg.clearMsgs();
    this.msg.setMessage(error);
    this.router.navigateByUrl("login");
  }


}
