import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EnvService {
  env = {...environment, protocol: document.location.protocol, hostName:document.location.hostname};
}
