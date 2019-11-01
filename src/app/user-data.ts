export class UserData
{
  userName : string;
  color : string;
  system: boolean;
}

export class UsersData
{
  userList : Array<UserData> = [];

  addUser(c : UserData)
  {
    this.userList.push(c);
  }

  getUsers()
  {
    return this.userList;
  } 

}
