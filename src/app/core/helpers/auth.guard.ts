import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser : any = this.authenticationService.currentUserValue;
        if (currentUser) {
            // logged in so return true
            if(currentUser.employer_role == null){
                return false;
            }
            return true;
        }   

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }

    
}