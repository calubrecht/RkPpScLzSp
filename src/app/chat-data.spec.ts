import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ChatData, ChatMessage } from './chat-data'

describe('ChatData', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [ HttpClientModule],
  }));

  it('should be created', () => {
    const service: ChatData = TestBed.inject(ChatData);
    expect(service).toBeTruthy();
  });
  
  it('should add chat', () => {
    const service: ChatData = TestBed.inject(ChatData);

    let c : ChatMessage = new ChatMessage('loser', 'loser says what?');
    service.addChat(c);
    expect(service.getChats()).toHaveSize(1);
    expect(service.getChats()[0]).toBe(c);
  });
  
  it('should clear chats', () => {
    const service: ChatData = TestBed.inject(ChatData);

    let c : ChatMessage = new ChatMessage('loser', 'loser says what?');
    c.msgID = 0;
    service.addChat(c);
    expect(service.getChats()).toHaveSize(1);
    service.clear();
    expect(service.getChats()).toHaveSize(0);
  });
  
  it('should add multiple chats', () => {
    const service: ChatData = TestBed.inject(ChatData);
    let c : ChatMessage = new ChatMessage('loser', 'loser says what?');
    c.msgID = 0;
    let c2 : ChatMessage = new ChatMessage('winner', 'bring it');
    c2.msgID = 2;
    let c3 : ChatMessage = new ChatMessage('winner', 'chicken dinner');
    c3.msgID = 3;
    service.addChat(c);
    service.addChats([c2, c3]);
    expect(service.getChats()).toHaveSize(3);
  });
  
  it('setChats should replace', () => {
    const service: ChatData = TestBed.inject(ChatData);

    let c : ChatMessage = new ChatMessage('loser', 'loser says what?');
    c.msgID = 0;
    let c2 : ChatMessage = new ChatMessage('winner', 'bring it');
    c2.msgID = 2;
    service.addChat(c);
    service.setChats([c, c2]);
    expect(service.getChats()).toHaveSize(2);
  });
  
  it('should not add duplicates', () => {
    const service: ChatData = TestBed.inject(ChatData);

    let c : ChatMessage = new ChatMessage('loser', 'loser says what?');
    c.msgID = 4;
    service.addChat(c);
    service.addChat(c);
    expect(service.getChats()).toHaveSize(1);
  });
});
