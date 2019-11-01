import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { MsgService } from '../msg.service';
import { USERS } from '../mock-users.ts';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  
  users = USERS;
  constructor(public customer : CustomerService, private msg : MsgService) { }

  ngOnInit() {

		this.customer.fetchUserName();
  }



}
