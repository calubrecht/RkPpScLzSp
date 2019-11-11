import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { GameService } from './game.service';
import { NeedAuthGuardService } from './need-auth-guard.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class GameActiveGuard implements CanActivate{

  constructor(private game: GameService, private router: Router, private needAuth : NeedAuthGuardService) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.needAuth.canActivate(route, state))
    {
      return false;
    }

    if (this.game.getGameStatus() == 'started' || this.game.getGameStatus() == 'finished')
    {
      return true;
    }

    this.router.navigateByUrl('/lobby');

    return false;
  }
}
