import { Input, Component, OnInit } from '@angular/core';
import { UserData } from '../user-data';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() user : UserData;

}
