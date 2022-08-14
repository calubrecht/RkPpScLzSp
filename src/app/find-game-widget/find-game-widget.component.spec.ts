import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameService, GameMessage, GameListener } from '../game.service';
import { HttpClientModule } from '@angular/common/http';
import { UsersData } from '../user-data';
import { MockProvider, MockService } from 'ng-mocks';

import { FindGameWidgetComponent } from './find-game-widget.component';

let gameSpy;
let userSpy;

describe('FindGameWidgetComponent', () => {
  let component: FindGameWidgetComponent;
  let fixture: ComponentFixture<FindGameWidgetComponent>;

  beforeEach(async () => {
    gameSpy = jasmine.createSpyObj('GameService', ['seekGame', 'endSeekGame', 'onInit', 'listen'], {gameStatus: {inGame:false}});
    userSpy = jasmine.createSpyObj('UsersData', {getUser: () => {color: "red"}});
    await TestBed.configureTestingModule({
      declarations: [FindGameWidgetComponent ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        { provide:GameService, useValue:gameSpy},
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
});
