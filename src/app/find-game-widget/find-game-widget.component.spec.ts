import { ComponentFixture, TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';
import { GameService, GameMessage, GameListener } from '../game.service';
import { HttpClientModule } from '@angular/common/http';
import { UsersData } from '../user-data';
import { UserLoginService } from '../user-login.service';
import { MockProvider, MockService } from 'ng-mocks';

import { FindGameWidgetComponent } from './find-game-widget.component';

let gameSpy;
let userSpy;
let routerSpy;
let loginSpy;

describe('FindGameWidgetComponent', () => {
  let component: FindGameWidgetComponent;
  let fixture: ComponentFixture<FindGameWidgetComponent>;

  beforeEach(async () => {
    gameSpy = jasmine.createSpyObj('GameService', ['seekGame', 'endSeekGame', 'onInit', 'listen', 'startGame', 'acceptInvite', 'startAIGame'], {gameStatus: {inGame:false}});
    userSpy = jasmine.createSpyObj('UsersData', {getUser: {color: "red"}});
    loginSpy = jasmine.createSpyObj('UserLoginService', {getName: "you"});
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    await TestBed.configureTestingModule({
      declarations: [FindGameWidgetComponent ],
      imports: [ HttpClientModule],
      providers: [
        { provide:GameService, useValue:gameSpy},
        { provide:Router, useValue:routerSpy},
        { provide:UserLoginService, useValue:loginSpy},
        { provide:UsersData, useValue:userSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindGameWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does Seek', () => {
    jasmine.clock().install();
    let seekButton = fixture.nativeElement.querySelector("#seekGameBtn");
    seekButton.click();

    expect(component.isSeeking).toBe(true);
    expect(component.seekingLongTime).toBe(false);
    expect(gameSpy.seekGame).toHaveBeenCalled();
    let seekingTimer = component.seekingTimer;

    // Second seek resets timer
    component.longTime = 100;
    seekButton.click();
    expect(component.seekingTimer).not.toBe(seekingTimer)
    jasmine.clock().tick(120);
    expect(component.seekingLongTime).toBe(true);


    jasmine.clock().uninstall();
  });

  it('does end Seek', () => {

    component.isSeeking = true;
    component.game.gameStatus.invited = true;
    fixture.detectChanges();
    let endSeekButton = fixture.nativeElement.querySelector("#endSeekBtn");

    endSeekButton.click();
    expect(component.isSeeking).toBe(false);
    expect(component.seekingLongTime).toBe(false);
    expect(component.game.gameStatus.invited).toBe(false);
    expect(gameSpy.endSeekGame).toHaveBeenCalled();
  });
  
  it('does canceGame', () => {

    component.game.gameStatus.inGame = true;
    component.game.gameStatus.gameName = "Fun Game"
    fixture.detectChanges();
    let cancelButton = fixture.nativeElement.querySelector("#cancelBtn");
    let gameName = fixture.nativeElement.querySelector(".gameName");
    expect(gameName.innerText).toBe("Fun Game");

    cancelButton.click();
    expect(component.game.gameStatus.inGame).toBe(false);
    expect(component.game.gameStatus.gameName).toBe('');
  });

  it('does acceptInvite', () => {

    component.game.gameStatus.inGame = false;
    component.game.gameStatus.invited = true;
    component.game.gameStatus.inviter = "Bob";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".inviter").innerText).toBe("Bob");
    let acceptButton = fixture.nativeElement.querySelector("#acceptBtn");

    acceptButton.click();
    expect(component.game.gameStatus.inGame).toBe(true);
    expect(gameSpy.startGame).toHaveBeenCalled();
    expect(gameSpy.acceptInvite).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
  });
  
  it('does ai game', () => {

    component.isSeeking = true;
    let aiButton = fixture.nativeElement.querySelector("#aiBtn");

    aiButton.click();
    expect(component.isSeeking).toBe(false);
    expect(gameSpy.endSeekGame).toHaveBeenCalled();
    expect(gameSpy.startAIGame).toHaveBeenCalled();
  });

  it('accept startGame message', () => {
    component.game.gameStatus.inGame = false;
    component.isSeeking = true;
    let msg : GameMessage = { action: 'startGame', detail: 'quick game', id:'55'};
    component.onMessage(msg);
    fixture.detectChanges();

    expect(component.isSeeking).toBe(false);
    expect(component.game.gameStatus.inGame).toBe(true);
    expect(component.game.gameStatus.gameName).toBe('quick game');
    expect(gameSpy.startGame).toHaveBeenCalledWith('quick game', '55');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('game');
  });
  
  it('invite message', () => {
    component.game.gameStatus.inGame = false;
    component.isSeeking = true;
    let msg : GameMessage = { action: 'invite', detail: 'quick game', id:'55', players:['you', 'some guy']};
    component.onMessage(msg);
    fixture.detectChanges();

    expect(component.game.gameStatus.invited).toBe(true);
    expect(component.game.gameStatus.gameName).toBe('quick game');
    expect(component.game.gameStatus.gameID).toBe('55');
    expect(component.game.gameStatus.inviter).toBe('some guy');
    expect(fixture.nativeElement.querySelector(".inviter").innerText).toBe("some guy");
   
    // Message while already invited does nothing.
    let msg2 : GameMessage = { action: 'invite', detail: 'quick game', id:'58', players:['you', 'some other guy']};
    component.onMessage(msg2);
    fixture.detectChanges();
    expect(component.game.gameStatus.invited).toBe(true);
    expect(component.game.gameStatus.gameName).toBe('quick game');
    expect(component.game.gameStatus.gameID).toBe('55');
    expect(component.game.gameStatus.inviter).toBe('some guy');
    expect(fixture.nativeElement.querySelector(".inviter").innerText).toBe("some guy");
    
    // Message while already in in game does nothing
    component.game.gameStatus.inGame = true;
    component.game.gameStatus.invited = false;
    fixture.detectChanges();
    expect(component.game.gameStatus.gameName).toBe('quick game');
    expect(component.game.gameStatus.gameID).toBe('55');
    expect(component.game.gameStatus.inviter).toBe('some guy');
  });
  
  it('accepted invite message', () => {
    component.game.gameStatus.inGame = false;
    component.game.gameStatus.invited = true;
    component.isSeeking = true;
    let msg : GameMessage = { action: 'acceptedInvite', detail: 'quick game', id:'55', players:['you', 'some guy']};
    component.onMessage(msg);
    fixture.detectChanges();

    expect(component.game.gameStatus.invited).toBe(false);
    expect(component.game.gameStatus.inGame).toBe(true);
    expect(component.game.gameStatus.gameName).toBe('quick game');
    expect(component.game.gameStatus.inviter).toBe('');
    expect(gameSpy.startGame).toHaveBeenCalledWith('quick game', '55');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('game');
   
    // Message while already invited does nothing.
    let msg2 : GameMessage = { action: 'invite', detail: 'quicker game', id:'58'};
    gameSpy.startGame.calls.reset();
    routerSpy.navigateByUrl.calls.reset();
    component.onMessage(msg2);
    fixture.detectChanges();
    expect(component.game.gameStatus.gameName).toBe('quick game');
    expect(gameSpy.startGame).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('resend game', () => {
    // Does nothing if already in game
    component.game.gameStatus.inGame = true;
    let msg : GameMessage = { action: 'resendGame', detail: 'quick game', id:'55', players:['you', 'some guy'], choices:['rock', 'paper']};
    component.onMessage(msg);
    expect(gameSpy.startGame).not.toHaveBeenCalled();


    component.game.gameStatus.inGame = false;
    component.onMessage(msg);
    expect(gameSpy.startGame).toHaveBeenCalledWith('quick game', '55');
    expect(component.game.gameStatus.selectedName).toBe("rock");
    expect(component.game.gameStatus.opponentSelectedName).toBe("paper");
   
    // Set placholders
    component.game.gameStatus.inGame = false;
    let msg2 : GameMessage = { action: 'resendGame', detail: 'quick game', id:'55', players:['you', 'some guy'], choices:[null, null]};
    component.onMessage(msg2);
    expect(gameSpy.startGame).toHaveBeenCalledWith('quick game', '55');
    expect(component.game.gameStatus.selectedName).toBe("placeholder");
    expect(component.game.gameStatus.opponentSelectedName).toBe("placeholder");
    
    // Set winner, result, round score
    component.game.gameStatus.inGame = false;
    let msg3 : GameMessage = { action: 'resendGame', detail: 'quick game', id:'55', players:['some guy', 'you'], choices:[null, null], winner:'Bob', detail2: 'Bomb destroys Everything', round:2, scores:[10,23]};
    component.onMessage(msg3);
    expect(gameSpy.startGame).toHaveBeenCalledWith('quick game', '55');
    expect(component.game.gameStatus.lastWinner).toBe("Bob");
    expect(component.game.gameStatus.resultText).toBe("Bomb destroys Everything");
    expect(component.game.gameStatus.roundText).toBe("Round 2");
    expect(component.game.gameStatus.scoreText).toBe("You: 23 some guy: 10");



  });
});
