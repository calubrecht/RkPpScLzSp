import { Injectable } from '@angular/core';


export class UserData
{
  userName : string;
  color : string;
  system: boolean;
}

export class UserMessage
{
  userName: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersData
{
  userList : Array<UserData> = [];

  addUser(c : UserData)
  {
    this.userList.push(c);
  }

  createUser(userName: string)
  {
    let ud = new UserData();
    ud.userName = userName;
    ud.color = 'blue';
    ud.system = false;
    this.addUser(ud);
  }

  getUsers()
  {
    return this.userList;
  } 

}
