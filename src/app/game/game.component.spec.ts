import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { GameMessage, GameService } from '../game.service';

import { GameComponent } from './game.component';

@Component({
  selector: 'app-msg',
  template: '<p>Msg</p>'
})
class MockMsg {}

let mockListen = jasmine.createSpy("listen");

class MockGame {
  gameStatus = {gameStatus: 'active'};
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
