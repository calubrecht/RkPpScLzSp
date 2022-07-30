import { TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';

import { UserLoginService } from './user-login.service'
import {Router} from '@angular/router';
import {Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';
import { GameService } from './game.service';
import { SubscriptionService } from './subscription.service';
import { ChatService } from './chat.service';
import { StorageService } from './storage.service';
import { UsersData, UserMessage } from './user-data';

const mockStorage = MockService(StorageService);
const mockApi = MockService(ApiService);
const mockSub = MockService(SubscriptionService);


describe('UserLoginService', () => {
  beforeEach( () =>  {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService, mockApi),
        MockProvider(Router),
        MockProvider(MsgService),
        MockProvider(SubscriptionService, mockSub),
        MockProvider(StorageService, mockStorage),
        MockProvider(GameService),
        MockProvider(UsersData),
        MockProvider(ChatService)
        ]
  }
  );
  }
  );

  it('should be created', () => {
    const service: UserLoginService = TestBed.get(UserLoginService);
    expect(service).toBeTruthy();
  });
  
  it('should set Name', () => {
    spyOn(mockStorage, 'setName');
    const service: UserLoginService = TestBed.get(UserLoginService);
    expect(service).toBeTruthy();

    service.setName("name");

    expect(service.userName).toBe("name");
    expect(service.getName()).toBe("name");
    expect(mockStorage.setName).toHaveBeenCalledWith("name");
  });

  it('should fetchUsername', () => {
    let callback: (name) => {};
    let mockPromise = jasmine.createSpyObj('Observable',['subscribe']);
    mockPromise.subscribe = (cb) => callback = cb;
    mockPromise.trigger = () => callback('aName');

    spyOn(mockApi, 'sendGetString').and.returnValue(mockPromise);
    const service: UserLoginService = TestBed.get(UserLoginService);

    service.fetchUserName();
    mockPromise.trigger();
    expect(service.getName()).toBe("aName");

  });
  
  it('should initSession', () => {
    let callback: (name) => {} = null;
    let wsCallback: () => void;
    let mockPromise = jasmine.createSpyObj('Observable',['subscribe']);
    mockPromise.subscribe = (cb) => callback = cb;
    mockPromise.trigger = () => callback('aName');

    spyOn(mockApi, 'sendGetString').and.returnValue(mockPromise);
    spyOn(mockSub, 'onWSDisconnect').and.callFake((cb) => {wsCallback = cb;});
    const service: UserLoginService = TestBed.get(UserLoginService);
    spyOn(service, 'logOut');
    spyOn(service, 'fetchVersion').and.callFake(() => {});

    service.initSession();
    
    expect(callback).not.toBe(null);
    
    wsCallback();
    expect(service.logOut).toHaveBeenCalledTimes(1);
    
    mockPromise.trigger();
    expect(service.fetchVersion).toHaveBeenCalledTimes(1);
    callback = null;
    
    // Second call does nothing
    service.initSession();
    
    expect(callback).toBe(null);

  });
    
});
