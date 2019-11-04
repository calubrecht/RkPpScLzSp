import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxStomp }  from '@stomp/rx-stomp';
import { map }  from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor() {}

  private stompClient : RxStomp;

  public connect(url): void  {
    if (!this.stompClient) {
      this.stompClient = this.create(url);
      console.log("Successfully connected: " + url);
    }
  }

  private create(url): RxStomp {
    let config =
      {
        brokerURL: url,
        reconnectDelay: 200,
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
