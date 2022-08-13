import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { UserLoginService } from '../user-login.service';
import { MsgService  } from '../msg.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  colors = ['red', 'blue', 'green', 'orange', 'yellow', 'white', 'black'];

  userName: string;
  password: string;
  confirmPassword: string;
  color: string;

  constructor(private loginService: UserLoginService, private router: Router, private msg: MsgService)
  { }

  ngOnInit() {
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    if (this.loginService.isLoggedIn())
    {
      this.navigateAway();
    }
  }

  navigateAway()
  {
    this.router.navigateByUrl('lobby');
  }

  tryRegister()
  {
    console.log("Try register");
    if (this.validate())
    {
      console.log("avlidagted");
      this.loginService.register(this.userName, this.password, this.color);
    }
  }

  cancel()
  {
    this.router.navigateByUrl('login');
  }

  validate(): boolean
  {
    if (!this.userName || this.userName === '')
    {
      this.msg.setError('Please enter a username');
      return false;
    }
    if (!this.password || this.password === '')
    {
      this.msg.setError('Please enter a password');
      return false;
    }
    if (this.password !== this.confirmPassword)
    {
      this.msg.setError('Password confirmation does not match');
      return false;
    }
    return true;
  }

}
