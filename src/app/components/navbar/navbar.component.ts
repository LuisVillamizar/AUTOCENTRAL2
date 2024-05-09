import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  public full_name;
  constructor(
    location: Location,
      private element: ElementRef,
      private router: Router,
      private authenticationService: AuthenticationService
  ) {
    this.location = location;
    this.full_name = this.authenticationService.currentUserValue;
    
  }

  ngOnInit() {
    //let current: any = this.authenticationService.currentUserValue;
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }
    
    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee ){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  logOut(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    return false;
  }

}
