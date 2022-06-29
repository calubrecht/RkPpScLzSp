import { TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';

import { of } from 'rxjs';
import { Observable, Subscription } from 'rxjs';

import { SubscriptionService } from './subscription.service';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';
import { StorageService } from './storage.service';

import { GameService, GameStatus, GameMessage, GameListener } from './game.service';

describe('GameService', () => {
  beforeEach( () =>  {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(SubscriptionService),
        MockProvider(MsgService),
        MockProvider(StorageService)
        ]
  }
  );
  }
  );

  it('should be created', () => {
    const service: GameService = TestBed.get(GameService);
    expect(service).toBeTruthy();
  });

  it('seekGame should call api', () => {
    const service: GameService = TestBed.get(GameService);
    const apiService: ApiService = TestBed.get(ApiService);

    let message = new GameMessage();

    spyOn(apiService, "sendPost").and.returnValue(of(message));

    service.seekGame("game1", null);

    expect(apiService.sendPost).toHaveBeenCalledWith('game/seek', {});
  });

  it('invite should call api and listen', () => {
    const service: GameService = TestBed.get(GameService);
    const apiService: ApiService = TestBed.get(ApiService);

    let listener = {onMessage: jasmine.createSpy() };

    let message = new GameMessage();
    spyOn(apiService, "sendPost").and.returnValue(of(message));

    service.invite("player1", "player2", listener);

    expect(apiService.sendPost).toHaveBeenCalledWith('game/invite', {action: 'invite', players: ['player1', 'player2']});

    let acceptedMessage = {action: 'accepted', players: ['player1', 'player2']};
    service.onMessage(acceptedMessage);

    expect(listener.onMessage).toHaveBeenCalledWith(acceptedMessage);
  });

  it('onInit inits subscription', () => {
    const service: GameService = TestBed.get(GameService);
    const subsService: SubscriptionService = TestBed.get(SubscriptionService);

    let subscription = MockService(Subscription);
    let message = new GameMessage();

    spyOn(subsService, "subscribeUserChannel").and.returnValue(of(subscription));
    spyOn(subsService, "onConnection");

    service.onInit();

    expect(subsService.subscribeUserChannel).toHaveBeenCalledTimes(1);
    expect(subsService.onConnection).toHaveBeenCalledTimes(1);
   
    // Subsequent calls do nothing
    service.onInit();

    expect(subsService.subscribeUserChannel).toHaveBeenCalledTimes(1);
    expect(subsService.onConnection).toHaveBeenCalledTimes(1);
  });

  it('acceptInvite should call api', () => {
    const service: GameService = TestBed.get(GameService);
    const apiService: ApiService = TestBed.get(ApiService);

    let message = new GameMessage();
    let acceptMessage: GameMessage = {action: 'acceptInvite', id: 'ID555'};

    spyOn(apiService, "sendPost").and.returnValue(of(message));

    service.acceptInvite("game1", "ID555");

    expect(apiService.sendPost).toHaveBeenCalledWith('game/acceptInvite', acceptMessage);
  });

  it('endSeekGame should call api', () => {
    const service: GameService = TestBed.get(GameService);
    const apiService: ApiService = TestBed.get(ApiService);

    let message = new GameMessage();

    spyOn(apiService, "sendPost").and.returnValue(of(message));

    service.endSeekGame("game1");

    expect(apiService.sendPost).toHaveBeenCalledWith('game/endSeek', {});
  });

  it('startAIGame should call api', () => {
    const service: GameService = TestBed.get(GameService);
    const apiService: ApiService = TestBed.get(ApiService);

    let listener = {onMessage: jasmine.createSpy() };

    let message = new GameMessage();
    spyOn(apiService, "sendPost").and.returnValue(of(message));

    service.startAIGame("key6", listener);

    expect(apiService.sendPost).toHaveBeenCalledWith('game/startAIGame', {});
  });

  it('cancel should call api', () => {
    const service: GameService = TestBed.get(GameService);
    const apiService: ApiService = TestBed.get(ApiService);

    service.gameStatus.gameID= 'GAME1';

    let message = new GameMessage();

    spyOn(apiService, "sendPost").and.returnValue(of(message));

    service.cancel();

    expect(apiService.sendPost).toHaveBeenCalledWith('game/cancel', {id: 'GAME1'});
  });

  it('sendMessage should call subs service', () => {
    const service: GameService = TestBed.get(GameService);
    const subsService: SubscriptionService = TestBed.get(SubscriptionService);

    let message = new GameMessage();

    spyOn(subsService, "sendMessage");

    service.sendMessage(message);

    expect(subsService.sendMessage).toHaveBeenCalledWith('/send/gameMessage', message);
  });

  it('unsubscribe unsubs subscription', () => {
    const service: GameService = TestBed.get(GameService);
    const subsService: SubscriptionService = TestBed.get(SubscriptionService);

    let subscription = MockService(Subscription);
    service.subscription = subscription;
    let message = new GameMessage();

    spyOn(subscription, "unsubscribe");

    service.unsubscribe();

    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
   
    // Subsequent calls do nothing
    service.unsubscribe();

    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  it('onMessage to alert listeners', () => {
    const service: GameService = TestBed.get(GameService);

    let message = new GameMessage();
    let listener1 = {onMessage: jasmine.createSpy() };
    let listener2 = {onMessage: jasmine.createSpy() };

    service.listen("listen1", listener1);
    service.listen("listen1", listener2);

    service.onMessage(message);

    expect(listener1.onMessage).toHaveBeenCalledTimes(1);
    expect(listener2.onMessage).toHaveBeenCalledTimes(0);
   
    // Subsequent calls do nothing
    service.stopListen("listen1");

    expect(listener1.onMessage).toHaveBeenCalledTimes(1);
  });

  it('start/end game', () => {
    const service: GameService = TestBed.get(GameService);

    service.startGame("This game", "GAME123");

    expect(service.gameStatus.gameName).toBe("This game");
    expect(service.getGameStatus()).toBe("started");
    expect(service.gameStatus.gameID).toBe("GAME123");
    
    service.endGame("This game", "GAME123");
    
    expect(service.gameStatus.gameName).toBe(null);
    expect(service.getGameStatus()).toBe(null);
    expect(service.gameStatus.gameID).toBe(null);
  });
});
