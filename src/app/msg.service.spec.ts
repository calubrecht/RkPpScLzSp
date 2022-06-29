import { TestBed } from '@angular/core/testing';
import { MsgService} from './msg.service';

describe('MsgService', () => {

  it('should be created', () => {
    const service: MsgService = TestBed.get(MsgService);
    expect(service).toBeTruthy();
  });

  it('set/getMessage', () => {
    const service: MsgService = TestBed.get(MsgService);

    expect(service.getMessage()).toBe('')
    service.setMessage('a message');
    expect(service.getMessage()).toBe('a message')
    service.clearMsgs();
    expect(service.getMessage()).toBe('')
  });

  it('set/getError', () => {
    const service: MsgService = TestBed.get(MsgService);

    expect(service.getError()).toBe('')
    service.setError('an Error');
    expect(service.getError()).toBe('an Error')
    service.clearMsgs();
    expect(service.getError()).toBe('')
  });
});
