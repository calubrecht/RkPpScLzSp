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
  }
  getToken()
  {
    return localStorage.getItem('TOKEN');
  }

  clearToken()
  {
    localStorage.removeItem('TOKEN');
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
