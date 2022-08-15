import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';
import { UserLoginService } from '../user-login.service';
import { ChatService } from '../chat.service';
import { ChatMessage, ChatData } from '../chat-data';
import { MsgService } from '../msg.service';
import { UsersData, UserData } from '../user-data';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';

import { LobbyComponent } from './lobby.component';

@Component({
  selector: 'app-hello',
  template: '<p>Hello U!</p>'
})
class MockHello { @Input() name: string; }
@Component({
  selector: 'app-msg',
  template: '<p>Msg</p>'
})
class MockMsg {}
@Component({
  selector: 'app-chatbox',
  template: '<p>Chat</p>'
})
class MockChat{}
@Component({
  selector: 'app-user-detail',
  template: '<p class="userDetail">{{user && user.userName}}</p>'
})
class MockUsers { @Input() user: string; }
@Component({
  selector: 'app-find-game-widget',
  template: '<p>Find Game</p>'
})
class MockFindGame{}


let userDataSpy;
let chatSpy;
let chatDataSpy;

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;

  beforeEach(async () => {
    userDataSpy = jasmine.createSpyObj('UsersData', {getUser: {color: "red"}, getActiveUsers: [{userName:'Bob', color:'red'},{userName:'Fred', color:'blue'}]});
    chatSpy = {sendChat: (m) => of(m)};
    chatDataSpy = jasmine.createSpyObj('ChatData', ['addChat']);
    await TestBed.configureTestingModule({
      declarations: [ LobbyComponent, MockHello, MockMsg, MockChat, MockUsers, MockFindGame ],
      imports: [ FormsModule ],
      providers: [
        MockProvider(UserLoginService),
        { provide:ChatData, useValue:chatDataSpy  },
        { provide:ChatService, useValue:chatSpy  },
        MockProvider(MsgService),
        { provide:UsersData, useValue:userDataSpy }
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should showUsers', () => {
    expect(component).toBeTruthy();
    let userBox = fixture.nativeElement.querySelector(".userbox");
    expect(userBox.children.length).toBe(2);
    expect(userBox.children[0].className).toBe('red user');
    expect(userBox.children[1].className).toBe('blue user');
    expect(userBox.children[0].innerText).toBe('Bob');
    expect(userBox.children[1].innerText).toBe('Fred');
  });
  
  it('should select User', () => {
    expect(component).toBeTruthy();
    let userBox = fixture.nativeElement.querySelector(".userbox");
    userBox.children[0].click();
    fixture.detectChanges();
    let detail = fixture.nativeElement.querySelector(".userDetail");
    expect(detail.innerText).toBe('Bob');
  });
  
  it('should send Chat', () => {
    component.newChat = 'Hi';
    component.sendChat();
    fixture.detectChanges();

    expect(component.newChat).toBe('');
    expect(chatDataSpy.addChat).toHaveBeenCalledWith(new ChatMessage('', 'Hi'));
  });
});
