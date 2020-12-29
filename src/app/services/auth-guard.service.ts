// import { Injectable } from '@angular/core';
// import { Router, CanActivate } from '@angular/router';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanActivate {

//   constructor(public auth: AuthService, public router: Router) { }

//   canActivate(): boolean {
//     if (!this.auth.isAuthenticated()) {
//       this.router.navigate(['/login']);
//       return false;
//     }
//     return true;
//   }
// }

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService,
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      await this.keycloak.login({
        // redirectUri: window.location.origin + state.url,
        redirectUri: window.location.href,
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data.roles;

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}
