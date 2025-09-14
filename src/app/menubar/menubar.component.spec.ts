import { TestBed, waitForAsync } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';
import {Router} from '@angular/router';
import { Component } from '@angular/core';
import { GameService, GameStatus } from '../game.service';

import { MenubarComponent } from './menubar.component';

class MockRouter {

  url = '#/lobby';

  navigateByUrl(newUrl : string)
  {
    this.url = '#/' + newUrl
  }
}

class MockGameService {

  gameStatus = {gameStatus:'', gameName:''};

  getGameStatus = () => this.gameStatus.gameStatus;
}

function makeGameStatus (gameStatus: string, gameName: string) : GameStatus {
  return {gameStatus, gameName, round: 0, gameID: '0', selectedName: 'Bob', opponentSelectedName: "Roger", resultText:"", roundText: "", scoreText: "", inviter: "", lastWinner: "", invited: false, inGame: false};
}

  
describe('MenubarComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MenubarComponent
      ],
      providers: [
        {provide: Router, useClass: MockRouter},
        {provide: GameService, useClass: MockGameService},
        ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MenubarComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
  
  it('should indicateIfInLobby', () => {
    const fixture = TestBed.createComponent(MenubarComponent);
    const router: Router = TestBed.inject(Router);
    const component = fixture.debugElement.componentInstance;

    expect(component.inLobby()).toBe(true);
    (router as any).url= '/somegame';
    expect(component.inLobby()).toBe(false);
  });
  
  it('to Lobby', () => {
    const fixture = TestBed.createComponent(MenubarComponent);
    const router: Router = TestBed.inject(Router);
    const component = fixture.debugElement.componentInstance;

    spyOn(router, "navigateByUrl").and.callThrough();
    (router as any).url= '/somewhere';
    expect(component.inLobby()).toBe(false);
    component.toLobby();
    expect(component.inLobby()).toBe(true);
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
   
    // Additional call does not navigate again
    component.toLobby();
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
  });

  it('to Game', () => {
    const fixture = TestBed.createComponent(MenubarComponent);
    const router: Router = TestBed.inject(Router);
    const component = fixture.debugElement.componentInstance;

    spyOn(router, "navigateByUrl").and.callThrough();
    expect(component.inLobby()).toBe(true);
    component.toGame();
    expect(component.inLobby()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
   
    // Additional call does not navigate again
    component.toGame();
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
  });

  it('to Render', () => {
    const gameService = TestBed.inject(GameService);
    gameService.gameStatus = makeGameStatus('started', 'FastGame');
    expect(gameService.getGameStatus()).toBe('started');
    const fixture = TestBed.createComponent(MenubarComponent);
    const component = fixture.debugElement.componentInstance;
    const element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(element.textContent).toEqual("Game LobbyFastGame");
    
    let activeEls = element.getElementsByClassName('active');
    expect(activeEls).toHaveSize(1);
    expect(activeEls[0].textContent).toEqual("Game Lobby");

    component.toGame();
    fixture.detectChanges();
    activeEls = element.getElementsByClassName('active');
    expect(activeEls).toHaveSize(1);
    expect(activeEls[0].textContent).toEqual("FastGame");
  });
  
  it('to not Render if no game', () => {
    const fixture = TestBed.createComponent(MenubarComponent);
    const component = fixture.debugElement.componentInstance;
    const element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(element.textContent).toEqual("");
  });
});
