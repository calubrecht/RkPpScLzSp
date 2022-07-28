import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { GameMessage, GameService } from '../game.service';
import { UserLoginService } from '../user-login.service';

import { GameComponent } from './game.component';

import { By } from "@angular/platform-browser";
import {Router} from '@angular/router';

@Component({
  selector: 'app-msg',
  template: '<p>Msg</p>'
})
class MockMsg {}

let mockListen = jasmine.createSpy("listen");
let mockSend = jasmine.createSpy("sendMessage");
let mockCancel = jasmine.createSpy("cancel");
let mockRoute = jasmine.createSpy("route");
let mockStopListen = jasmine.createSpy("stopListen");

class MockGame {
  gameStatus = {gameStatus: 'started', gameID:"id1"};
  getGameStatus = () => this.gameStatus.gameStatus;
  sendMessage = mockSend;
  listen = mockListen;
  cancel = mockCancel;
  stopListen = mockStopListen;;
}
class MockGameFinished {
  gameStatus = {gameStatus: 'finished'};
  listen = mockListen;
}
class MockGameInProgress {
  gameStatus = {gameStatus: 'active', selectedName: 'scissors', opponentSelectedName: 'placeholder'};
  listen = mockListen;
}
class MockLoginUser {
  getName() {
    return "player1";
  }
}

class MockRouter {
  navigateByUrl = mockRoute;
}

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    mockSend.calls.reset();
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: GameService, useClass: MockGame},
        {provide: UserLoginService, useClass: MockLoginUser},
        {provide: Router, useClass: MockRouter}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.debugElement.nativeElement.getElementsByTagName('button')[0].innerText).toBe('Cancel Game');
    expect(mockListen).toHaveBeenCalled();
  });
  
  it('should select', () => {
    expect(component).toBeTruthy();
    
    let scissors = fixture.debugElement.query(By.css("#game_scissors"));
    scissors.nativeElement.click();
    fixture.detectChanges();
    let gm = new GameMessage();
    gm.id = "id1";
    gm.action = "makeChoice";
    gm.detail = "scissors";

    expect(mockSend).toHaveBeenCalledWith(gm);
    let root = "http://localhost:9876/assets/";
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.src).toBe(root + "placeholder.png");
  });
  
  it('should react to opponent turn', () => {
    expect(component).toBeTruthy();
    
    let scissors = fixture.debugElement.query(By.css("#game_scissors"));
    scissors.nativeElement.click();
    fixture.detectChanges();
    let gm = new GameMessage();
    gm.id = "id1";
    gm.action = "makeChoice";
    gm.detail = "scissors";

    expect(mockSend).toHaveBeenCalledWith(gm);
    let root = "http://localhost:9876/assets/";
    expect(fixture.debugElement.query(By.css("#game_scissors")).nativeElement.className).toBe("game_choice selected");
    gm = {action:'point', detail:'point for the win', players:['player1','player2'], choices:['scissors', 'paper'], scores:[1,1], winner: 'player2', round:2};
    component.onMessage(gm);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.src).toBe(root + "paper.png");
    expect(fixture.debugElement.queryAll(By.css(".results div.resultText"))[0].nativeElement.innerText).toBe("point for the win");
    expect(fixture.debugElement.queryAll(By.css(".results div.round"))[0].nativeElement.innerText).toBe("Round 2")
    expect(fixture.debugElement.queryAll(By.css(".results div.scores"))[0].nativeElement.innerText).toBe("You: 1 player2: 1");
  });
  
  it('should not select twice', () => {
    expect(component).toBeTruthy();
    
    let scissors = fixture.debugElement.query(By.css("#game_scissors"));
    scissors.nativeElement.click();
    fixture.detectChanges();
    let gm = new GameMessage();
    gm.id = "id1";
    gm.action = "makeChoice";
    gm.detail = "scissors";

    expect(mockSend).toHaveBeenCalledWith(gm);
    let root = "http://localhost:9876/assets/";
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.src).toBe(root + "placeholder.png");
    

    let rock = fixture.debugElement.query(By.css("#game_rock"));
    rock.nativeElement.click();
    fixture.detectChanges();
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.src).toBe(root + "placeholder.png");
    expect(component.msgService.getMessage()).toBe('Already selected for this round.');
  });
  
  it('should not select when finished', () => {
    expect(component).toBeTruthy();
    
    let gm = {action:'point', detail:'point for the win', players:['player1','player2'], choices:['scissors', 'paper'], scores:[3,1], winner: 'player2', round:2};
    component.onMessage(gm);
    gm = {action:'Finished', detail:'point for the win', players:['player1','player2'], choices:['scissors', 'paper'], scores:[3,1], winner: 'player2', round:3};
    component.onMessage(gm);
    fixture.detectChanges();

    let root = "http://localhost:9876/assets/";
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.src).toBe(root + "paper.png");
    

    let rock = fixture.debugElement.query(By.css("#game_rock"));
    rock.nativeElement.click();
    fixture.detectChanges();
    expect(mockSend).toHaveBeenCalledTimes(0);
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.src).toBe(root + "paper.png");
  });
  
  it('should close or cancel', () => {
    expect(component).toBeTruthy();
    
    let closeGame = fixture.debugElement.query(By.css("#closeGame"));
    closeGame.nativeElement.click();

    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockStopListen).toHaveBeenCalledTimes(1);
    expect(mockRoute).toHaveBeenCalledTimes(1);
    expect(mockRoute).toHaveBeenCalledWith("/lobby");
    
    let gm = {action:'Finished', detail:'point for the win', players:['player1','player2'], choices:['scissors', 'paper'], scores:[3,1], winner: 'player2', round:3};
    component.onMessage(gm);
    fixture.detectChanges();

    closeGame.nativeElement.click();

    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockStopListen).toHaveBeenCalledTimes(2);
    expect(mockRoute).toHaveBeenCalledTimes(2);
    expect(mockRoute).toHaveBeenCalledWith("/lobby");
  });
  
  it('should show winner class', () => {
    expect(component).toBeTruthy();
    
    let gm = {action:'point', detail:'point for the win', players:['player1','player2'], choices:['scissors', 'paper'], scores:[3,1], winner: 'player2', round:2};
    component.onMessage(gm);
    fixture.detectChanges();
    
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.className).toBe("");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.className).toBe("winner");

    gm = {action:'point', detail:'point for the win', players:['player2','player1'], choices:['scissors', 'paper'], scores:[3,1], winner: 'player1', round:3};
    component.onMessage(gm);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.className).toBe("winner");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.className).toBe("");
    
    gm = {action:'TIE', detail:'point for the win', players:['player2','player1'], choices:['scissors', 'paper'], scores:[3,1], winner: '', round:3};
    component.onMessage(gm);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.className).toBe("");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.className).toBe("");
  });
  
  it('should react to cancel', () => {
    expect(component).toBeTruthy();
    
    let scissors = fixture.debugElement.query(By.css("#game_scissors"));
    scissors.nativeElement.click();
    fixture.detectChanges();
    
    let root = "http://localhost:9876/assets/";
    expect(scissors.nativeElement.className).toBe("game_choice selected");
    
    let gm = {action:'Canceled', detail:'point for the win', players:['player2','player1'], choices:['scissors', 'paper'], scores:[3,1], winner: '', round:3};
    component.onMessage(gm);
    fixture.detectChanges();
    expect(scissors.nativeElement.className).toBe("game_choice");
  });
    
  it('should react to msg', () => {
    expect(component).toBeTruthy();
    
    let gm = {action:'Mussage', detail:'What message?'};
    component.onMessage(gm);
    fixture.detectChanges();
    expect(component.msgService.getMessage()).toBe('What message?');
  });
});

describe('GameComponent Finished', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: GameService, useClass: MockGameFinished}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.debugElement.nativeElement.getElementsByTagName('button')[0].innerText).toBe('Close Game');
  });
});

describe('GameComponent inProgress', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    mockSend.calls.reset();
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: GameService, useClass: MockGameInProgress}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with selection', () => {
    expect(component).toBeTruthy();
    let root = "http://localhost:9876/assets/";
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[1].nativeElement.src).toBe(root + "placeholder.png");
  });
  
});

describe('GameComponent Finished', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: GameService, useClass: MockGameFinished}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.debugElement.nativeElement.getElementsByTagName('button')[0].innerText).toBe('Close Game');
  });
});

describe('GameComponent inProgress', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: GameService, useClass: MockGameInProgress}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with selection', () => {
    expect(component).toBeTruthy();
    let root = "http://localhost:9876/assets/";
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
    expect(fixture.debugElement.queryAll(By.css(".results div img"))[0].nativeElement.src).toBe(root + "scissors.png");
  });
});
