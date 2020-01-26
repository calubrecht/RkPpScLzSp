import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxStomp } from '@stomp/rx-stomp';
import { map } from 'rxjs/operators';


import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor(private storage: StorageService) {}

  private stompClient: RxStomp;
  private sessionID: string;

  private getAuth(): string
  {
    return 'Bearer ' + this.storage.getToken();
  }

  private getUser(): string
  {
    return 'bozo';
  }

  private makeid(length) {
     let result           = '';
     const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     const charactersLength = characters.length;
     for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  private getClientSessionID(): string
  {
    if (!this.sessionID)
    {
      this.sessionID = this.makeid(6);
    }
    return this.sessionID;
  }

  public connect(url): void  {
    if (!this.stompClient) {
      this.stompClient = this.create(url);
      console.log('Successfully connected: ' + url);
    }
  }

  public disconnect(): void
  {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.sessionID = null;
    }
  }

  private create(url): RxStomp {
    const config =
      {
        brokerURL: url,
        reconnectDelay: 200,
        connectHeaders: { Authorization: this.getAuth(), ClientSessionID: this.getClientSessionID() },
        // debug: (msg: string): void => { console.log(new Date(), msg); }
      };
    const rxStomp = new RxStomp();
    rxStomp.configure(config);
    rxStomp.activate();

    return rxStomp;
  }

  public subscribe<T>(url: string, topic: string): Observable<T>
  {
    this.connect(url);
    return this.stompClient.watch(topic).pipe(map(message => JSON.parse(message.body)));
  }

  public subscribeUserChannel<T>(url: string, topic: string): Observable<T>
  {
    this.connect(url);
    return this.stompClient.watch(topic + '-' + this.getClientSessionID()).pipe(map(message => JSON.parse(message.body) ));
  }

  public publish(topic: string, message: string)
  {
    this.stompClient.publish({destination: topic, body: message});
  }

  public publishMsg<T>(topic: string, message: T)
  {
    this.stompClient.publish({destination: topic, body: JSON.stringify(message)});
  }

}
