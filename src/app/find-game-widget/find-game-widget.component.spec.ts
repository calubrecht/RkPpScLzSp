import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameService, GameMessage, GameListener } from '../game.service';
import { HttpClientModule } from '@angular/common/http';
import { MockProvider, MockService } from 'ng-mocks';

import { FindGameWidgetComponent } from './find-game-widget.component';

let gameSpy;

describe('FindGameWidgetComponent', () => {
  let component: FindGameWidgetComponent;
  let fixture: ComponentFixture<FindGameWidgetComponent>;

  beforeEach(async () => {
    gameSpy = jasmine.createSpyObj('GameService', ['seekGame', 'onInit', 'listen'], {gameStatus: {inGame:false}});
    await TestBed.configureTestingModule({
      declarations: [FindGameWidgetComponent ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        { provide:GameService, useValue:gameSpy}]
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
    let seekButton = fixture.nativeElement.querySelector("#seekGameBtn");
    seekButton.click();

    expect(component.isSeeking).toBe(true);
    expect(component.seekingLongTime).toBe(false);
    expect(gameSpy.seekGame).toHaveBeenCalled();
    let seekingTimer = component.seekingTimer;

    // Second seek resets timer
    seekButton.click();
    expect(component.seekingTimer).not.toBe(seekingTimer)

  });
});
