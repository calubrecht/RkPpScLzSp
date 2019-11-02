import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { UserLoginService } from './user-login.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class NeedAuthGuardService implements CanActivate{

  constructor(private loginService: UserLoginService, private router: Router) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];

    if (this.loginService.isLoggedIn()) {
      return true;
    }

    this.router.navigateByUrl(
      this.router.createUrlTree(
        ['/login'], {
          queryParams: {
            redirectUrl
          }
        }
      )
    );

    return false;
  }
}
