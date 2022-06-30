import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';
import { UserLoginService } from '../user-login.service';
import { ChatService } from '../chat.service';
import { ChatMessage, ChatData } from '../chat-data';
import { MsgService } from '../msg.service';
import { UsersData, UserData } from '../user-data';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  template: '<p>Users</p>'
})
class MockUsers { @Input() user: string; }
@Component({
  selector: 'app-find-game-widget',
  template: '<p>Users</p>'
})
class MockFindGame{}

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LobbyComponent, MockHello, MockMsg, MockChat, MockUsers, MockFindGame ],
      imports: [ FormsModule ],
      providers: [
        MockProvider(UserLoginService),
        MockProvider(ChatService),
        MockProvider(ChatData),
        MockProvider(UsersData),
        MockProvider(MsgService)
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
});
