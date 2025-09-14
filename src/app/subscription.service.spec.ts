import { TestBed } from '@angular/core/testing';
import { SubscriptionService} from './subscription.service';
import { ApiService } from './api.service';
import { WebsocketService } from './websocket.service';

import { MockProvider } from 'ng-mocks';

describe('SubscriptionMsgService', () => {
  beforeEach( () =>  {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService, {
          WSAPI: 'ws://server',
          WSENTRY: 'entryPoint'}),
        MockProvider(WebsocketService),
        ]
  });
  });

  it('should be created', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);
    expect(service).toBeTruthy();
  });

  it('newSubsID returns consecuctive values', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);

    expect(service.newSubsID()).toBe(0);
    expect(service.newSubsID()).toBe(1);
    expect(service.newSubsID()).toBe(2);
  });

  it('subscribe calls wsService', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);
    const wsService: WebsocketService = TestBed.inject(WebsocketService);

    spyOn(wsService, 'subscribe');
    service.subscribe('callMethod');
    expect(wsService.subscribe).toHaveBeenCalledWith('ws://server/entryPoint', 'callMethod');
  });

  it('subscribeUserChannel calls wsService', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);
    const wsService: WebsocketService = TestBed.inject(WebsocketService);

    spyOn(wsService, 'subscribeUserChannel');
    service.subscribeUserChannel('callMethod');
    expect(wsService.subscribeUserChannel).toHaveBeenCalledWith('ws://server/entryPoint', 'callMethod');
  });

  it('sendMessage calls wsService', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);
    const wsService: WebsocketService = TestBed.inject(WebsocketService);

    spyOn(wsService, 'publishMsg');
    service.sendMessage('topic','callMethod');
    expect(wsService.publishMsg).toHaveBeenCalledWith('topic', 'callMethod');
  });

  it('onConnection calls wsService', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);
    const wsService: WebsocketService = TestBed.inject(WebsocketService);

    let callback = () => {};
    spyOn(wsService, 'onConnection');
    service.onConnection(callback);
    expect(wsService.onConnection).toHaveBeenCalledWith(callback);
  });
  
  it('onWSDisconnect calls wsService', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);
    const wsService: WebsocketService = TestBed.inject(WebsocketService);

    let callback = () => {};
    spyOn(wsService, 'onWSDisconnect');
    service.onWSDisconnect(callback);
    expect(wsService.onWSDisconnect).toHaveBeenCalledWith(callback);
  });
  
  it('unsubscribeAll calls wsService', () => {
    const service: SubscriptionService = TestBed.inject(SubscriptionService);
    const wsService: WebsocketService = TestBed.inject(WebsocketService);

    spyOn(wsService, 'disconnect');
    service.unsubscribeAll();
    expect(wsService.disconnect).toHaveBeenCalled();
  });
});
