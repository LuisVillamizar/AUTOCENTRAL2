import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Crud } from 'src/app/core/helpers/Crud';
import { servicesService } from 'src/app/core/services/services.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent extends Crud implements OnInit {

  services = null;
  tmpServices : any;

  constructor(service: servicesService,
              private formBuilder: FormBuilder) {
    super(service)
  }

  ngOnInit(): void {
    this.setForms()
    this.service.services().toPromise()
      .then(
        response => {
          this.services = response
          this.tmpServices = this.services;
        }
      )
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      question: ['', Validators.required]     
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    
    this.services = this.tmpServices.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.services.offset = 0;
  }

}
