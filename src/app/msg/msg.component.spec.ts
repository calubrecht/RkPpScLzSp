import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';
import { MsgService } from '../msg.service';

import { MsgComponent } from './msg.component';

describe('MsgComponent', () => {
  let component: MsgComponent;
  let fixture: ComponentFixture<MsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgComponent ],
      providers: [MockProvider(MsgService)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
