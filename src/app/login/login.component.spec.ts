import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserLoginService } from '../user-login.service';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { LoginComponent } from './login.component';

@Component({
  selector: 'app-msg',
  template: '<p>Msg</p>'
})
class MockMsg {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent, MockMsg ],
      imports: [RouterTestingModule, HttpClientModule, FormsModule],
      providers: [MockProvider(UserLoginService) ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
