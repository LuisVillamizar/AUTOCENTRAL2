import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from 'src/app/core/services/model.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent extends Crud implements OnInit {
 brands = null;
 models = null;
 currendBrand = null;
 currendModel = null;
  constructor(
    service : VehicleService,
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    super(service);
  }

  async ngOnInit() {
    this.setForms()
    await this.getBrand();
         
    await this.getModel()
    this.list(0, this.f.model.value);
  }

  async getModel(){
    await this.modelService.list(0, this.currendBrand ).toPromise()
    .then(
      response => {
        this.models = response       
        this.f.model.setValue(this.models[0].id);       
        this.changeModel();
      }
    )
  }

  async getBrand(){
    await this.modelService.brand().toPromise()
    .then(
      response => {
        this.brands = response
        this.f.brand.setValue(1);
        this.currendBrand = this.f.brand.value 
       
      }
    )
  }


  changeBrand(e) {   
    this.currendBrand = this.f.brand.value;
    this.getModel();
  }

  changeModel() {   
    this.currendModel = this.f.model.value;
    this.list(0, this.f.model.value);
  }


  setForms() {
    this.modelForm = this.formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required]       
    })
  }

}
