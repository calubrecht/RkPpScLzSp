import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {Component} from '@angular/core';
import { Injectable } from '@angular/core';
import { EnvService} from './env.service';
import { of } from 'rxjs';

import { ApiService } from './api.service';

class MockHttpClient {
  get(request: string)
  {
    return of("Something");
  }
  
  post(request: string, data: string)
  {
    return of("Something");
  }
}

var localEnv= 
  {
    localServer: false,
    basePageServer: 'basePage',
    wsServer: 'server',
    wsEntry: 'entryPoint',
    suffix: '/API',
    protocol: 'http',
    hostName: 'otherHost'
  };

@Injectable({
  providedIn: 'root'
})
class MockEnvService {
  env = localEnv;
}

describe('ApiService', () => {
  beforeEach( () =>  {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useClass: MockHttpClient
        },
        {
          provide: EnvService,
          useClass: MockEnvService
        }]
  }
  );
    localEnv.localServer = false;
    localEnv.protocol = 'http';
  }
  );

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
  
  it('should set fields', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service.API).toBe("basePage");
    expect(service.WSAPI).toBe("server");
    expect(service.WSENTRY).toBe("entryPoint");
  });
  
  it('should set fields if localServer', () => {
    localEnv.localServer = true;
    const service: ApiService = TestBed.get(ApiService);
    expect(service.API).toBe("/API");
    expect(service.WSAPI).toBe("ws://otherHost/API");
    expect(service.WSENTRY).toBe("entryPoint");
  });
  
  it('should set fields if localServer-secure', () => {
    localEnv.localServer = true;
    localEnv.protocol = 'https';
    const service: ApiService = TestBed.get(ApiService);
    expect(service.API).toBe("/API");
    expect(service.WSAPI).toBe("wss://otherHost/API");
    expect(service.WSENTRY).toBe("entryPoint");
  });
  
  it('should provide API', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service.getAPI()).toBe("basePage");
  });
  
  it('should sendGet', () => {
    const service: ApiService = TestBed.get(ApiService);
    const http = TestBed.get(HttpClient);

    spyOn(http, "get");

    let obsv = service.sendGet("bing");
    expect(http.get).toHaveBeenCalledWith("basePage/api/v1/bing");
  });
  
  it('should sendGetString', () => {
    const service: ApiService = TestBed.get(ApiService);
    const http = TestBed.get(HttpClient);

    spyOn(http, "get");

    let obsv = service.sendGetString("bing");
    expect(http.get).toHaveBeenCalledWith("basePage/api/v1/bing", {responseType: 'text'});
  });
  
  it('should sendPost', () => {
    const service: ApiService = TestBed.get(ApiService);
    const http = TestBed.get(HttpClient);

    spyOn(http, "post");

    let obsv = service.sendPost("bing", "bong");
    expect(http.post).toHaveBeenCalledWith("basePage/api/v1/bing", "bong");
  });
  
  it('should sendPost for string', () => {
    const service: ApiService = TestBed.get(ApiService);
    const http = TestBed.get(HttpClient);

    spyOn(http, "post");

    let obsv = service.sendPostForString("bing", "bong");
    expect(http.post).toHaveBeenCalledWith("basePage/api/v1/bing", "bong", {responseType: 'text'});
  });
});
