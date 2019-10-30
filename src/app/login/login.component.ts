import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private customer: CustomerService, private router: Router) {
  }

  email = 'not';
  password = 'not';

  ngOnInit() {
    if(this.customer.isLoggedIn())
    {
      this.navigateAway();
    }
  }

  navigateAway()
  {
    this.router.navigateByUrl("lobby");
  }

  tryLogin()
  {
    this.customer.logIn(this.email, this.password);
  }

}
