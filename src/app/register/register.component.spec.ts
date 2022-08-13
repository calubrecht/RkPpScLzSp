import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockProvider, MockService } from 'ng-mocks';
import { UserLoginService } from '../user-login.service';
import { MsgService  } from '../msg.service';
import {Router} from '@angular/router';
    

import { RegisterComponent } from './register.component';

@Component({
  selector: 'app-msg',
  template: '<p>Msg</p>'
})
class MockMsg {}

let routerSpy;
let loginSpy;

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    loginSpy = jasmine.createSpyObj('UserLoginService', ['register', 'isLoggedIn']);
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [ RegisterComponent, MockMsg ],
      providers: [
        { provide:UserLoginService, useValue:loginSpy},
        MockProvider(MsgService),
        { provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register', () => {

    let userNameInput = fixture.nativeElement.querySelector("#userName");
    let passwordInput = fixture.nativeElement.querySelector("#password");
    let passwordConfirmInput = fixture.nativeElement.querySelector("#confirmPassword");
    userNameInput.value = "loser1";
    passwordInput.value = "pass1";
    passwordConfirmInput.value = "pass1";
    userNameInput.dispatchEvent(new Event("input"));
    passwordInput.dispatchEvent(new Event("input"));
    passwordConfirmInput.dispatchEvent(new Event("input"));
    component.color = 'red';
    fixture.detectChanges();
    let registerButton = fixture.nativeElement.querySelector(".defButton");
    registerButton.click();

    expect(loginSpy.register).toHaveBeenCalled();
    expect(loginSpy.register).toHaveBeenCalledWith('loser1', 'pass1', 'red');
  });
});
