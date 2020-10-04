import { TestBed } from '@angular/core/testing';

import { UserDetailComponent } from './user-detail.component';
import { GameService } from '../game.service';
import { UserLoginService } from '../user-login.service';
import { UserData } from '../user-data';


class MockLoginService {
  getName()
  {
    return "Jojo";
  }
}

class MockGameService {
  invite(inviter: string, invitee: string)
  {
  }

}

describe('UserDetailComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
      declarations: [
        UserDetailComponent
      ],
      providers: [
        {provide:  UserLoginService, useClass: MockLoginService},
        {provide:  GameService, useClass: MockGameService},
      ],
  }));

  it('should be created', () => {
    const fixture = TestBed.createComponent(UserDetailComponent);
    expect(fixture).toBeTruthy();
  });
  
  it('should show details', () => {
    const fixture = TestBed.createComponent(UserDetailComponent);
    const element  = fixture.nativeElement;
    let userData = new UserData({userName:'Frank', color:'red', system:false, status:'ok'});
    userData.wins = 10;
    userData.losses = 2;
    fixture.componentInstance.user = userData;
    fixture.detectChanges();
    expect(element).toBeTruthy();
    expect(element.querySelector('h2').textContent).toEqual("FRANK Details");
    expect(element.querySelector('.userWinRecord').textContent).toEqual("Record W:10 L:2");
    let inviteElement = element.querySelector(".inviteWidget");
    expect(inviteElement).toBeTruthy();
  });
  
  it('shouldn\'t show invite for self', () => {
    const fixture = TestBed.createComponent(UserDetailComponent);
    const element  = fixture.nativeElement;
    let userData = new UserData({userName:'Jojo', color:'red', system:false, status:'ok'});
    userData.wins = 10;
    userData.losses = 2;
    fixture.componentInstance.user = userData;
    fixture.detectChanges();
    let inviteElement = element.querySelector("inviteWidget");
    expect(inviteElement).toBeFalsy();
  });
  
  it('should send invite', () => {
    const fixture = TestBed.createComponent(UserDetailComponent);
    const element  = fixture.nativeElement;
    let userData = new UserData({userName:'Frank', color:'red', system:false, status:'ok'});
    userData.wins = 10;
    userData.losses = 2;
    fixture.componentInstance.user = userData;

    let inviteFunc = spyOn((fixture.componentInstance as any).game, 'invite');
    fixture.detectChanges();
    let inviteElement = element.querySelector(".inviteWidget");
    expect(inviteElement).toBeTruthy();
    let status = element.querySelector(".userInviteStatus");
    expect(status.textContent).toEqual("");
    let button = element.querySelector("button");
    button.click();
    fixture.detectChanges();
    expect(status.textContent).toEqual("You invited Frank to a game");

    //expect(fixture.componentInstance.invite).toHaveBeenCalled();
    expect(inviteFunc).toHaveBeenCalled();
  });
});
