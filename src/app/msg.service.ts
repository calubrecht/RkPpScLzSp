import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  error_ : string = '';
  msg_  : string = '';


  constructor() { }

  clearMsgs()
  {
    this.setMessage('');
    this.setError('');
  }

  setMessage(msg : string)
  {
    this.msg_ = msg;
  }

  getMessage() : string
  {
    return this.msg_;
  }

  setError(err : string)
  {
    this.error_ = err;
  }
  
  getError() : string
  {
    return this.error_;
  }
}
