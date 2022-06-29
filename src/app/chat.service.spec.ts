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

  it('subscibe chats calls api', () => {
    const service: ChatService = TestBed.get(ChatService);
    const subService: SubscriptionService = TestBed.get(SubscriptionService);

    let message: ChatMessage = new ChatMessage("userName", "a message");

    spyOn(subService, "subscribe").and.returnValue(of(message));

    let obs : Observable<ChatMessage> = service.subscribe();

    expect(subService.subscribe).toHaveBeenCalledWith('/topic/chat');
    expect(obs).toBeTruthy();
  });

  it('subscibe users calls api', () => {
    const service: ChatService = TestBed.get(ChatService);
    const subService: SubscriptionService = TestBed.get(SubscriptionService);

    let user = new UserData({userName: 'user', color:'blue', system:false, status:'ok'});

    spyOn(subService, "subscribe").and.returnValue(of(user));
    
    let obsUser : Observable<UserData> = service.subscribeUsers();

    expect(subService.subscribe).toHaveBeenCalledWith('/topic/users');
    expect(obsUser).toBeTruthy();
  });
  
  it('subscibe/unsubscribe', () => {
    const service: ChatService = TestBed.get(ChatService);
    const apiService: ApiService = TestBed.get(ApiService);
    const subService: SubscriptionService = TestBed.get(SubscriptionService);
    const chatData: ChatData = TestBed.get(ChatData);
    const userData: UsersData = TestBed.get(UsersData);

    let chatMessages : ChatMessage[] = [];
    let userMessages : UserData[] = [];
    let subChat = of(new ChatMessage("user1", "Hellp"));
    let subUser = of(new UserData("loser"));

    spyOn(service, "getChats").and.returnValue(of(chatMessages));
    spyOn(service, "getUsers").and.returnValue(of(userMessages));
    spyOn(service, "subscribe").and.returnValue(subChat);
    spyOn(service, "subscribeUsers").and.returnValue(subUser);
    spyOn(chatData, "addChats");
    spyOn(userData, "addUsers");
    spyOn(chatData, "addChat");
    spyOn(userData, "updateUser");
    
    service.getAndSubscribeChats();

    expect(chatData.addChats).toHaveBeenCalled();
    expect(userData.addUsers).toHaveBeenCalled();
    expect(chatData.addChat).toHaveBeenCalled();
    expect(userData.updateUser).toHaveBeenCalled();
    
    let serviceA = service as any;
    spyOn(serviceA.subscription, "unsubscribe");
    spyOn(serviceA.usersSubscription, "unsubscribe");
    let localSub = serviceA.subscription;
    let localSubUser = serviceA.usersSubscription;

    service.unsubscribe();
    expect(serviceA.subscription).toBe(null);
    expect(serviceA.usersSubscription).toBe(null);
    expect(localSub.unsubscribe).toHaveBeenCalled();
    expect(localSubUser.unsubscribe).toHaveBeenCalled();

    // Calling second time doesn't crash;
    service.unsubscribe();
  });
  
});
