import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindGameWidgetComponent } from './find-game-widget.component';

describe('FindGameWidgetComponent', () => {
  let component: FindGameWidgetComponent;
  let fixture: ComponentFixture<FindGameWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindGameWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindGameWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
