import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import { Crud } from 'src/app/core/helpers/Crud';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { proceduresService } from 'src/app/core/services/procedures.service';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {

  ngOnInit() {
    
  }

}
