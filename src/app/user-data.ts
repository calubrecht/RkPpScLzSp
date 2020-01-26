import { Injectable } from '@angular/core';


export class UserData
{
  userName: string;
  color: string;
  status: string;
  system: boolean;
  wins: number;
  losses: number;

  constructor(d)
  {
    this.userName = d.userName;
    this.color = d.color;
    this.system = d.system;
    this.status = d.status;
  }
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
  userList: Array<UserData> = [];

  addUser(c: UserData)
  {
    this.userList.push(c);
  }

  addUsers(users: UserData[])
  {
    this.userList.length = 0;
    this.userList.push(new UserData({ userName: '#system#', color: 'red', system: true}));
    for (const i of Object.keys(users))
    {
      this.userList.push(users[i]);
    }
  }

  updateUser(user: UserData)
  {
    for (const i of Object.keys(this.userList))
    {
      if (this.userList[i].userName === user.userName)
      {
        this.userList[i] = user;
        return;
      }
    }
    this.userList.push(user);

  }

  createUser(userNameStr: string)
  {
    const ud = new UserData({userName: userNameStr, color: 'blue', system: false});
    this.addUser(ud);
  }

  getUsers()
  {
    return this.userList;
  }

  getActiveUsers()
  {
    return this.userList.filter(el => !el.system && el.status === 'CONNECTED');
  }

  getUser(userName: string)
  {
    for (const index of Object.keys(this.userList))
    {
      if (userName === this.userList[index].userName)
      {
        return this.userList[index];
      }
    }
    return null;
  }
}
