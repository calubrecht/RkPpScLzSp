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
let msgSpy;

function configure(providers) {
    return TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      providers: providers
    })
    .overrideComponent(RegisterComponent, {
      set: {imports: [MockMsg, FormsModule]}
    });
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    loginSpy = jasmine.createSpyObj('UserLoginService', ['register', 'isLoggedIn']);
    msgSpy = jasmine.createSpyObj('MsgService', ['setError']);
    await configure(
      [
        { provide:UserLoginService, useValue:loginSpy},
        { provide:MsgService, useValue:msgSpy},
        { provide: Router, useValue: routerSpy}
      ]
    );

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
  
  it('should cancel', () => {

    let cancelButton = fixture.nativeElement.querySelector("#cancelBtn");
    cancelButton.click();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('login');
  });
  
  it('should validate', () => {

    let userNameInput = fixture.nativeElement.querySelector("#userName");
    let passwordInput = fixture.nativeElement.querySelector("#password");
    let passwordConfirmInput = fixture.nativeElement.querySelector("#confirmPassword");
    userNameInput.value = "loser1";
    passwordInput.value = "pass1";
    passwordConfirmInput.value = "pass1";
    userNameInput.dispatchEvent(new Event("input"));
    passwordInput.dispatchEvent(new Event("input"));
    passwordConfirmInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    
    expect(component.validate()).toBe(true);
    
    component.userName = "";
    expect(component.validate()).toBe(false);
    expect(msgSpy.setError).toHaveBeenCalledWith('Please enter a username');
    msgSpy.setError.calls.reset();
    expect(msgSpy.setError).not.toHaveBeenCalled();
    component.userName = null;
    expect(component.validate()).toBe(false);
    expect(msgSpy.setError).toHaveBeenCalledWith('Please enter a username');
    msgSpy.setError.calls.reset();
    component.userName = "user";
    component.password = "";
    expect(component.validate()).toBe(false);
    expect(msgSpy.setError).toHaveBeenCalledWith('Please enter a password');
    msgSpy.setError.calls.reset();
    component.password = null;
    expect(component.validate()).toBe(false);
    expect(msgSpy.setError).toHaveBeenCalledWith('Please enter a password');
    msgSpy.setError.calls.reset();
    component.password = "pass1";
    component.confirmPassword = "pass9";
    expect(component.validate()).toBe(false);
    expect(msgSpy.setError).toHaveBeenCalledWith('Password confirmation does not match');
  });
});

describe('RegisterComponent loggedinAlready', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    loginSpy = jasmine.createSpyObj('UserLoginService', {
      'isLoggedIn': true});
    msgSpy = jasmine.createSpyObj('MsgService', ['setError']);
    await configure(
      [
        { provide:UserLoginService, useValue:loginSpy},
        { provide:MsgService, useValue:msgSpy},
        { provide: Router, useValue: routerSpy}
      ]
    );

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to lobby', () => {
    expect(component).toBeTruthy();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('lobby');
  });
});
