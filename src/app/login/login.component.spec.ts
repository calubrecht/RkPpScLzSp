import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider, MockService } from 'ng-mocks';
import {Router} from '@angular/router';
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

let routerSpy;
let loginSpy;

function configure(providers) {
    return TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      providers: providers
    })
    .overrideComponent(LoginComponent, {
      set: {imports: [MockMsg, FormsModule]}
    });
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl'])
    loginSpy = jasmine.createSpyObj('UserLoginService',['initSession', 'logIn', 'logInGuest'],  {
      'isLoggedIn': () => false});
    await configure(
      [
        { provide:UserLoginService, useValue:loginSpy},
        { provide: Router, useValue:routerSpy}
      ]
    );

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should call register', () => {
    expect(component).toBeTruthy();
    fixture.nativeElement.querySelector(".buttonPanel").children[1].click();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('register');
  });

  it('should try login', () => {
    expect(component).toBeTruthy();
    let userNameInput = fixture.nativeElement.querySelector("#userName");
    let passwordInput = fixture.nativeElement.querySelector("#password");
    userNameInput.value = "loser1";
    passwordInput.value = "pass1";
    userNameInput.dispatchEvent(new Event("input"));
    passwordInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    fixture.nativeElement.querySelector(".buttonPanel").children[0].click();
    expect(loginSpy.logIn).toHaveBeenCalledWith("loser1", "pass1");
  });
  
  it('should try loginGuest', () => {
    expect(component).toBeTruthy();
    fixture.nativeElement.querySelector(".buttonPanel").children[2].click();
    expect(loginSpy.logInGuest).toHaveBeenCalled();
  });
});

describe('LoginComponent loggedinAlready', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    loginSpy = jasmine.createSpyObj('UserLoginService', ['initSession'], {
      'isLoggedIn': () => true});
    await configure(
      [
        { provide:UserLoginService, useValue:loginSpy},
        { provide: Router, useValue: routerSpy}
      ]
    );

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to lobby', () => {
    expect(component).toBeTruthy();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('lobby');
  });
});
