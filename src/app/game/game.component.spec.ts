import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { GameMessage, GameService } from '../game.service';

import { GameComponent } from './game.component';

import { By } from "@angular/platform-browser";

@Component({
  selector: 'app-msg',
  template: '<p>Msg</p>'
})
class MockMsg {}

let mockListen = jasmine.createSpy("listen");
let mockSend = jasmine.createSpy("sendMessage");

class MockGame {
  gameStatus = {gameStatus: 'active', gameID:"id1"};
  sendMessage = mockSend;
  listen = mockListen;
}
class MockGameFinished {
  gameStatus = {gameStatus: 'finished'};
  listen = mockListen;
}

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: GameService, useClass: MockGame}
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
