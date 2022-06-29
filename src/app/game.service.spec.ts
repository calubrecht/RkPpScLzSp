import { TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';

import { of } from 'rxjs';

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

});
