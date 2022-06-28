import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {Component} from '@angular/core';
import { Injectable } from '@angular/core';
import {MockComponent} from 'ng-mocks';
import { EnvService} from './env.service';

import { ApiService } from './api.service';

@Component({
  selector: "document",
  template: "",
})
class MockDocument {
  location = {protocol : 'http'};
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
      imports: [ HttpClientModule],
      providers: [
        {
          provide: Document,
          useClass: MockDocument
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
});
