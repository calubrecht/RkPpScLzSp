import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API : string;

  constructor(@Inject(DOCUMENT) private document : Document)
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
 
}
