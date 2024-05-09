import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children: any;
}

export const ROUTES: RouteInfo[] = [

  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-white', class: '', children: '' },
  { path: '/user-client-list', title: 'Clientes', icon: 'ni-single-02 text-white', class: '', children: '' },
  { path: '/user-system-list', title: 'Usuarios', icon: 'ni-settings text-white', class: '', children: '' },
  
  {
    path: '/vehicle-list', title: 'Parametros', icon: 'ni-bullet-list-67 text-white', class: '', children: [
      { path: '/brand-list', title: 'Marca', icon: 'ni ni-tag text-white', class: '', children: '' },
      { path: '/model-list', title: 'Linea', icon: 'ni-bullet-list-67 text-white', class: '', children: '' },
      { path: '/vehicle-list', title: 'Versión', icon: 'ni-bus-front-12 text-white', class: '', children: '' },
      { path: '/question-list', title: 'Preguntas', icon: 'ni-collection text-white', class: '', children: '' },
      { path: '/service-list', title: 'Servicios/Productos', icon: 'ni-settings text-white', class: '', children: '' },
    ]
  }
  

  //{ path: '/tables', title: 'Configuración',  icon:'ni-settings-gear-65 text-red', class: '' }

];

export const ROUTECLIENT: RouteInfo[] = [

  
  { path: '/user-client', title: 'Mi Perfil', icon: 'ni-single-02 text-white', class: '', children: '' },
  { path: '/request-list', title: 'Mis Vehiculos', icon: 'ni-bus-front-12 text-white', class: '', children: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  public menuTwo: any[];
  public activate: Boolean = false;
  public full_name;
  constructor(private router: Router,
    private authService: AuthenticationService) {
      this.full_name = this.authService.currentUserValue;
     }


  ngOnInit() {
    let current: any = this.authService.currentUserValue;
    if (current.employer_role == null) {
      this.menuItems = ROUTECLIENT.filter(menuItem => menuItem);
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
      });
    } else {
      this.menuItems = ROUTES.filter(menuItem => menuItem);

      for (var i = 0; i < this.menuItems.length; i++) {
        if (this.menuItems[i].title == "Parametros") {
          this.menuTwo = this.menuItems[i].children
        }
      }
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
      });
    }
    
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }


  cambio(nombre: any) {
    if (nombre == "Parametros") {
      if (!this.activate) {
        this.activate = true;
      } else {
        this.activate = false;
      }
    } else {
      this.activate = false;
    }
  }
}



/**
 *
 *     { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/icons', title: 'Clientes',  icon:'ni-planet text-blue', class: '' },
    { path: '/maps', title: 'Vehiculos',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/tables', title: 'Modelos',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/tables', title: 'Departamentos',  icon:'ni-map-big', class: '' },
    { path: '/tables', title: 'Municipios',  icon:'map-big', class: '' },
    { path: '/tables', title: 'Ciudades',  icon:'map-big text-red', class: '' },
    { path: '/login', title: 'Configuración',  icon:'ni-key-25 text-info', class: '' },
    { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
 */