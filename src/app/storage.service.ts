import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  name_: string;

  constructor() { }
  
  setToken(token)
  {
    localStorage.setItem('TOKEN', token);
    sessionStorage.setItem('TOKEN', token);
  }

  getToken()
  {
    let token = sessionStorage.getItem('TOKEN');
    if (!token)
    {
      token = localStorage.getItem('TOKEN');
    }
    return token;
  }

  clearToken()
  {
    localStorage.removeItem('TOKEN');
    sessionStorage.removeItem('TOKEN');
  }

  setName(name: string)
  {
    this.name_ = name;
  }

  getName() : string
  {
    return this.name_;
  }

}
