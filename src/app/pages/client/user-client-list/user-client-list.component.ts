import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { ClientService } from 'src/app/core/services/client.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
import { query } from '@angular/animations';

@Component({
  selector: 'app-user-client-list',
  templateUrl: './user-client-list.component.html',
  styleUrls: ['./user-client-list.component.css']
})
export class UserClientListComponent extends Crud implements OnInit {

  tmpClient : any;

  constructor(private clietService: ClientService,
    private authenticationService: AuthenticationService,
    private router: Router) {
    super(clietService);
  }

  async ngOnInit() {
    let current : any = this.authenticationService.currentUserValue;
    if(current.employer_role == null){
      this.router.navigate(['/user-client']);
    }else{
      await this.clietService.list(0).toPromise().then(
        response=>{
          this.model = response;
          this.tmpClient = this.model;
        }
      );
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    
    this.model = this.tmpClient.filter(function (d) {
      return JSON.stringify(d).toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.model.offset = 0;
  }

}
