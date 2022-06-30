import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MockProvider, MockService } from 'ng-mocks';

import { FindGameWidgetComponent } from './find-game-widget.component';

describe('FindGameWidgetComponent', () => {
  let component: FindGameWidgetComponent;
  let fixture: ComponentFixture<FindGameWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindGameWidgetComponent ],
      imports: [RouterTestingModule, HttpClientModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindGameWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
