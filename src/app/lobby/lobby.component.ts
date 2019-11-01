import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { CustomerService } from '../customer.service';
import { MsgService } from '../msg.service';
import { UserData } from '../user-data';
import { USERS } from '../mock-users';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  
  users = USERS;
  selectedUser : UserData;
  constructor(public customer : CustomerService, private msg : MsgService) { }

  ngOnInit() {

		this.customer.fetchUserName();
  }

  onSelect(user : UserData) : void {
   this.selectedUser = user; 
  }
  
  nonSystemUsers() {
   return this.users.filter(function(el) { return !el.system});
  }


}
