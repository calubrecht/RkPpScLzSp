import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';
import { ChatMessage, ChatData} from '../chat-data';
import { ChatService} from '../chat.service';
import { UsersData } from '../user-data';

import { ChatboxComponent } from './chatbox.component';

describe('ChatboxComponent', () => {
  let component: ChatboxComponent;
  let fixture: ComponentFixture<ChatboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChatboxComponent ],
      providers: [
        MockProvider(ChatData),
        MockProvider(ChatService),
        MockProvider(UsersData)
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getUserColor for db user', () => {
    expect(component).toBeTruthy();

    component.users = [{userName: 'user1', color: 'red', status:'online', system:false, wins:0, losses:0}]

    expect(component.getUserColor('user1')).toBe('red');
  });

  it('getUserColor for guest user', () => {
    component.users = [{userName: 'user1', color: 'red', status:'online', system:false, wins:0, losses:0}]

    // Hash the user and look up
    expect(component.getUserColor('Guest User')).toBe('black');
  });

  it('render 2 chats', () => {
    let chatData = TestBed.inject(ChatData);
    spyOn(chatData, 'getChats').and.returnValue([
      {userName:'user1', chatText:'Hi', msgID: 1},
      {userName:'user2', chatText:'Hi yourself', msgID: 2}]);
    component.users = [{userName: 'user1', color: 'red', status:'online', system:false, wins:0, losses:0}]
    fixture.detectChanges();


    const element = fixture.debugElement.nativeElement;
    let userEls = element.getElementsByClassName('chatline');
    expect(userEls.length).toBe(2);
  });
});
