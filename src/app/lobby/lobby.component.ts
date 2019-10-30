import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { MsgService } from '../msg.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private customer : CustomerService, private msg : MsgService) { }

  ngOnInit() {
    this.msg.clearMsgs();
    this.customer.fetchUserName();
  }

}
