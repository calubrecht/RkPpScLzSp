import { TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';

import { of } from 'rxjs';
import { Observable, Subscription } from 'rxjs';

import { SubscriptionService } from './subscription.service';
import { ApiService } from './api.service';

import { ChatMessage, ChatData } from './chat-data';
import { UserData, UsersData } from './user-data';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  beforeEach( () =>  {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(SubscriptionService),
        MockProvider(ChatData),
        MockProvider(UsersData)
        ]
  }
  );
  }
  );

  it('should be created', () => {
    const service: ChatService = TestBed.get(ChatService);
    expect(service).toBeTruthy();
  });

  it('getChats should call api', () => {
    const service: ChatService = TestBed.get(ChatService);
    const apiService: ApiService = TestBed.get(ApiService);

    let messages :ChatMessage[] = [];

    spyOn(apiService, "sendGet").and.returnValue(of(messages));

    let obs = service.getChats();

    expect(apiService.sendGet).toHaveBeenCalledWith('chat/chats');
    expect(obs).toBeTruthy();
  });

  it('getUsers should call api', () => {
    const service: ChatService = TestBed.get(ChatService);
    const apiService: ApiService = TestBed.get(ApiService);

    let users :UserData[] = [];

    spyOn(apiService, "sendGet").and.returnValue(of(users));

    let obs = service.getUsers();

    expect(apiService.sendGet).toHaveBeenCalledWith('users/');
    expect(obs).toBeTruthy();
  });

  it('sencChat should call api', () => {
    const service: ChatService = TestBed.get(ChatService);
    const apiService: ApiService = TestBed.get(ApiService);

    let message: ChatMessage = new ChatMessage("userName", "a message");

    spyOn(apiService, "sendPost").and.returnValue(of(message));

    let obs = service.sendChat(message);

    expect(apiService.sendPost).toHaveBeenCalledWith('chat/chat', message);
    expect(obs).toBeTruthy();
  });

});
