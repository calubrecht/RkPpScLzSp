import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxStomp }  from '@stomp/rx-stomp';
import { map }  from 'rxjs/operators';


import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor(private storage : StorageService) {}

  private stompClient : RxStomp;

  private getAuth() : string
  {
    return "Bearer " + this.storage.getToken();
  }
  
  private getUser() : string
  {
    return "bozo";
  }
  private getPass() : string
  {
    return this.storage.getToken();
  }

  public connect(url): void  {
    if (!this.stompClient) {
      this.stompClient = this.create(url);
      console.log("Successfully connected: " + url);
    }
  }

  public disconnect() : void 
  {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  private create(url): RxStomp {
    let config =
      {
        brokerURL: url,
        reconnectDelay: 200,
        connectHeaders: { Authorization: this.getAuth() }, 
        //debug: (msg: string): void => { console.log(new Date(), msg); }
      };
    let rxStomp = new RxStomp();
    rxStomp.configure(config);
    rxStomp.activate();

    return rxStomp;
  }

  public subscribe<T>(url: string, topic:string)  : Observable<T>
  {
    this.connect(url);
    return this.stompClient.watch(topic).pipe(map(function(message) { return JSON.parse(message.body) }));
  }

  public publish(topic: string, message : string)
  {
    this.stompClient.publish({destination: topic, body:message});
  }
    
}
