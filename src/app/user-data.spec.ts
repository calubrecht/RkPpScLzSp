import { TestBed } from '@angular/core/testing';

import { UserData, UsersData } from './user-data'

describe('UserData', () => {
  beforeEach(() => TestBed.configureTestingModule({
  }));

  it('should be created', () => {
    const service: UsersData = TestBed.inject(UsersData);
    expect(service).toBeTruthy();
  });
  
  it('should add user', () => {
    const service: UsersData = TestBed.inject(UsersData);

    let u : UserData = {userName:'u1', color:'blue', system:false, status:'CONNECTED', wins:0, losses:0};
    service.addUser(u);

    expect(service.getUsers()).toHaveSize(1);
  });
  
  it('should get active users', () => {
    const service: UsersData = TestBed.inject(UsersData);

    expect(service.getUsers()).toHaveSize(0);
    let u : UserData = {userName:'u1', color:'blue', system:false, status:'CONNECTED', wins:0, losses:0};
    let u2 : UserData = {userName:'u2', color:'blue', system:false, status:'DISCONNECTED', wins:0, losses:0};
    service.addUsers([u, u2]);

    expect(service.getUsers()).toHaveSize(3);
    expect(service.getActiveUsers()).toHaveSize(1);
  });
  
  it('should create User', () => {
    const service: UsersData = TestBed.inject(UsersData);

    let u = service.createUser('Joey');

    expect(service.getUsers()).toHaveSize(1);
  });
  
  it('should update User', () => {
    const service: UsersData = TestBed.inject(UsersData);

    let u : UserData = {userName:'u1', color:'blue', system:false, status:'CONNECTED', wins:0, losses:0};
    let u2 : UserData = {userName:'u2', color:'blue', system:false, status:'DISCONNECTED', wins:0, losses:0};
    service.addUsers([u, u2]);

    let uNew : UserData = {userName:'u2', color:'red', system:false, status:'DISCONNECTED', wins:5, losses:0};
    service.updateUser(uNew);

    expect(service.getUsers()[2].userName).toBe('u2');
    expect(service.getUsers()[2].color).toBe('red');
    
    let uBrandNew : UserData = {userName:'u5', color:'red', system:false, status:'DISCONNECTED', wins:5, losses:0};
    service.updateUser(uBrandNew);
    expect(service.getUsers()[3].userName).toBe('u5');
  });
  
  it('should add system User', () => {
    const service: UsersData = TestBed.inject(UsersData);

    expect(service.getUsers()).toHaveSize(0);
    service.addUsers([]);
  
    expect(service.getUsers()).toHaveSize(1);
    expect(service.getUsers()[0].system).toBe(true);
  });

  it('should getUser', () => {
    const service: UsersData = TestBed.inject(UsersData);

    let u : UserData = {userName:'u1', color:'blue', system:false, status:'CONNECTED', wins:0, losses:0};
    let u2 : UserData = {userName:'u2', color:'green', system:false, status:'DISCONNECTED', wins:0, losses:0};
    service.addUsers([u, u2]);

    expect(service.getUser('u2').color).toBe('green');
    
    expect(service.getUser('u92')).toBe(null);
  });
});
