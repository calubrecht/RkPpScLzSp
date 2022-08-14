import { ComponentFixture, TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';
import { GameService, GameMessage, GameListener } from '../game.service';
import { HttpClientModule } from '@angular/common/http';
import { UsersData } from '../user-data';
import { MockProvider, MockService } from 'ng-mocks';

import { FindGameWidgetComponent } from './find-game-widget.component';

let gameSpy;
let userSpy;
let routerSpy;

describe('FindGameWidgetComponent', () => {
  let component: FindGameWidgetComponent;
  let fixture: ComponentFixture<FindGameWidgetComponent>;

  beforeEach(async () => {
    gameSpy = jasmine.createSpyObj('GameService', ['seekGame', 'endSeekGame', 'onInit', 'listen', 'startGame', 'acceptInvite', 'startAIGame'], {gameStatus: {inGame:false}});
    userSpy = jasmine.createSpyObj('UsersData', {getUser: () => {color: "red"}});
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    await TestBed.configureTestingModule({
      declarations: [FindGameWidgetComponent ],
      imports: [ HttpClientModule],
      providers: [
        { provide:GameService, useValue:gameSpy},
        { provide:Router, useValue:routerSpy},
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
});
