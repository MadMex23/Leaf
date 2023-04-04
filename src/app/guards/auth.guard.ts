import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Route,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CryptoService } from '../services/crypto.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private cryptoService: CryptoService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.cryptoService.get();

    // provides the route configuration options.
    const { routeConfig } = route;

    // provides the path of the route.
    const { path } = routeConfig as Route;

    if (path?.includes('home') && user.userId) {
      return true;
    }

    if (path?.includes('home') && !user.userId) {
      this.router.navigateByUrl('');
      return false;
    }

    if (path?.includes('') && user.userId) {
      this.router.navigateByUrl('home');
      return false;
    }

    return true;
  }
}
