import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API : string;
  apiUrlRoot = '/api/v1/sessions/';

  constructor(@Inject(DOCUMENT) private document : Document, private http: HttpClient)
  {
    if (environment.localServer)
    {
      this.API = document.location.protocol + '//' + document.location.hostname + environment.suffix;
    }
    else
    {
      this.API = environment.basePageServer;
    }
  }


  getAPI()
  {
    return this.API;
  }

  sendGet(method : string) : Observable<string>
  {
    return this.http.get(
       this.getAPI() + this.apiUrlRoot + method,
       {responseType: 'text'});
  }
  
  sendPost(method : string, data : any) : Observable<string>
  {
    return this.http.post(
       this.getAPI() + this.apiUrlRoot + method,
       data,
       {responseType: 'text'});
  }
 
}
