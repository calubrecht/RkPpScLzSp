import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { EnvService} from './env.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API: string;
  WSAPI: string;
  WSENTRY: string;
  apiUrlRoot = '/api/v1/';

  constructor(private http: HttpClient, private env : EnvService)
  {
    let environment = env.env;
    if (environment.localServer)
    {
      this.API = environment.suffix;
      const wsProtocol = environment.protocol === 'http' ? 'ws' : 'wss';
      this.WSAPI = wsProtocol + '://' + environment.hostName + environment.suffix;
    }
    else
    {
      this.API = environment.basePageServer;
      this.WSAPI = environment.wsServer;
    }
    this.WSENTRY = environment.wsEntry;
  }


  getAPI()
  {
    return this.API;
  }

  sendGet<T>(method: string): Observable<T>
  {
    return this.http.get<T>(this.getAPI() + this.apiUrlRoot + method);
  }

  sendGetString(method: string): Observable<string>
  {
    return this.http.get(
       this.getAPI() + this.apiUrlRoot + method,
      {responseType: 'text'});
  }

  sendPost<T>(method: string, data?: any): Observable<T>
  {
    return this.http.post<T>(
       this.getAPI() + this.apiUrlRoot + method,
       data);
  }

  sendPostForString(method: string, data: any, params?): Observable<string>
  {
    return this.http.post(
       this.getAPI() + this.apiUrlRoot + method,
       data,
       {responseType: 'text'});
  }

}
