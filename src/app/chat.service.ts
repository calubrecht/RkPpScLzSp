import { Injectable } from '@angular/core';
import { ChatMessage } from './chat-data';
import { CHATS } from './mock-chats';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private api : ApiService) { }

  getChats() : Observable<ChatMessage[]>
  {
    return of(CHATS);
  }
}
