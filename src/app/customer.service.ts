import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subscription } from 'rxjs';
import { ApiService } from './api.service';

 const TOKEN='TOKEN';

@Injectable({providedIn:"root"})
export class CustomerService {

  userName_ = '';
  loggedIn_ = false;
  apiHost = 'http://skeletor:8080';
  apiUrlRoot = '/api/v1/sessions/';

  constructor(private router : Router, private http : HttpClient, private api : ApiService) {}
 
  setName(name: string) : void{
    this.userName_ = name;
  }

  getName() : string 
  {
    return this.userName_;
  }

  fetchUserName()
  {
    this.http.get(
      this.apiHost + this.apiUrlRoot + 'userName', {responseType: 'text'}).
	subscribe(
           (name : string) => {this.setName(name)}, 
           (err : HttpErrorResponse) => {this.logOut(err.error)});
  }

  logIn(name: string, password : string)  {
    this.http.post(	    
       this.apiHost + this.apiUrlRoot + 'login',
       {'userName':name , 'password':password}, {responseType: 'text'}).
       subscribe( res=> {
		this.setToken(res);
                this.setLoggedIn(name);
		this.router.navigateByUrl("/lobby")});
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
    return this.loggedIn_;
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
    this.userName_ = '';
    this.loggedIn_ = false;
    localStorage.removeItm('TOKEN');
    this.router.navigateByUrl("login");
  }


}
