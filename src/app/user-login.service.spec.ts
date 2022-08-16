import { TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';

import { UserLoginService } from './user-login.service'
import {Router} from '@angular/router';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';
import { GameService } from './game.service';
import { SubscriptionService } from './subscription.service';
import { ChatService } from './chat.service';
import { StorageService } from './storage.service';
import { UsersData, UserMessage } from './user-data';
import { Observable, of, Subscription } from 'rxjs';

const mockStorage = MockService(StorageService);
const mockApi = MockService(ApiService);
const mockSub = MockService(SubscriptionService);
const mockUsers = MockService(UsersData);


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
        MockProvider(UsersData, mockUsers),
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
  
  it('should fetch Version', () => {
    let callback: (name) => {} = null;
    let mockPromise = jasmine.createSpyObj('Observable',['subscribe']);
    let oldLog = console.log;
    console.log = jasmine.createSpy();
    mockPromise.subscribe = (cb) => callback = cb;

    spyOn(mockApi, 'sendGetString').and.returnValue(mockPromise);
    const service: UserLoginService = TestBed.get(UserLoginService);

    service.fetchVersion();
    
    expect(callback).not.toBe(null);
    expect(console.log).not.toHaveBeenCalled();
    callback('whaha');
    expect(console.log).toHaveBeenCalled();
    console.log = oldLog;

    callback = null;
    
    // Second call does nothing
    service.fetchVersion();
    
    expect(callback).toBe(null);

  });
  
  it('should logIn', () => {
    let result = of({token:'abcd'});

    spyOn(mockApi, 'sendPost').and.returnValue(result);
    spyOn(mockStorage, 'setToken');
    // for fetchUser
    spyOn(mockApi, 'sendGetString').and.returnValue(of("Joe"));
    const service: UserLoginService = TestBed.get(UserLoginService);

    service.logIn("Joe", "Blow");
    
    expect(mockStorage.setToken).toHaveBeenCalledWith("abcd");
    expect(mockApi.sendPost).toHaveBeenCalledWith('sessions/login', {userName:"Joe", password:"Blow"});
    expect(service.userName).toBe("Joe");
    expect(service.loggedIn).toBe(true);
  });
  
  it('should register', () => {
    let result = of({token:'abcd'});

    spyOn(mockApi, 'sendPost').and.returnValue(result);
    spyOn(mockStorage, 'setToken');
    // for fetchUser
    spyOn(mockApi, 'sendGetString').and.returnValue(of("Joe"));
    const service: UserLoginService = TestBed.get(UserLoginService);

    service.register("Joe", "Blow", "green");
    
    expect(mockStorage.setToken).toHaveBeenCalledWith("abcd");
    expect(mockApi.sendPost).toHaveBeenCalledWith('sessions/register', {userName:"Joe", password:"Blow", color:"green"});
    expect(service.userName).toBe("Joe");
    expect(service.loggedIn).toBe(true);
  });
  
  it('should loginGuest', () => {
    let result = of({token:'abcd', userName:"Guest 1"});

    spyOn(mockApi, 'sendPost').and.returnValue(result);
    spyOn(mockStorage, 'setToken');
    spyOn(mockUsers, 'createUser');
    // for fetchUser
    spyOn(mockApi, 'sendGetString').and.returnValue(of("Guest 1"));
    const service: UserLoginService = TestBed.get(UserLoginService);

    service.logInGuest();
    
    expect(mockStorage.setToken).toHaveBeenCalledWith("abcd");
    expect(mockUsers.createUser).toHaveBeenCalledWith("Guest 1");
    expect(mockApi.sendPost).toHaveBeenCalledWith('sessions/loginGuest', {});
    expect(service.userName).toBe("Guest 1");
    expect(service.loggedIn).toBe(true);
  });
    
});
