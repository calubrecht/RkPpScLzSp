import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  error = '';
  msg  = '';


  constructor() { }

  clearMsgs()
  {
    this.setMessage('');
    this.setError('');
  }

  setMessage(msg: string)
  {
    this.msg = msg;
  }

  getMessage(): string
  {
    return this.msg;
  }

  setError(err: string)
  {
    this.error = err;
  }

  getError(): string
  {
    return this.error;
  }
}
