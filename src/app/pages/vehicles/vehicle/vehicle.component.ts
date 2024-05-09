import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { ModelService } from 'src/app/core/services/model.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent extends Crud implements OnInit {
  brands = null;
  models = null;
  currendBrand = null;
  constructor(
    service : VehicleService,
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(service);
   }

  async ngOnInit(){
    this.modelId = this.route.snapshot.paramMap.get('id')
    this.setForms();    
    await this.getBrand();
    await this.getModel();
    this.modelData();
  }

  async getModel(){
    await this.modelService.list(0, this.currendBrand ).toPromise()
    .then(
      response => {
        this.models = response       
        this.f.model.setValue(this.models[0].id);       
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
  
  changeModel(){
    this.currendBrand = this.f.brand.value;
    this.getModel();
  }

  setModelData(response) {        
    this.f.brand.setValue(response.model.brand.id),
    this.f.model.setValue(response.model.id)
    //this.f.modelYear.setValue(response.modelYear)
    this.f.name.setValue(response.name)
  }


  modelData(){
    if(this.modelId){
      this.service.show(this.modelId)
      .subscribe(
        response =>{
          this.model = response;
          this.setModelData(response);
        },
        error => {
          this.error="No se puede consultar la informacion"
        }
      )
    }
  }


  setForms() {
    this.modelForm = this.formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      //modelYear: ['', Validators.required],
      name: ['', Validators.required]    
    })
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.modelForm.invalid) {
      return;
    }
    
    this.loading = true;
    if (this.modelId) {
      this.update();
    } else {      
      this.create();
    }
  }

  update() {
 
    const data ={
      id: this.modelId,
      model: {
        id: this.f.model.value,
        brand:{
          id: this.f.brand.value
        }
      },
      modelYear: null, //this.f.modelYear.value,
      name:this.f.name.value
    };


    this.service.update(data)
    .toPromise()
    .then(response => {

      this.success = true;
      this.loading = false;
    },
      error => {

        this.loading = false;
        this.error = error;
      })
  }


  create() {    
    const data ={
      model: {
        id: this.f.model.value,
        brand:{
          id: this.f.brand.value
        }
      },
      modelYear: null, //this.f.modelYear.value,
      name:this.f.name.value
    };
    this.service.create(data)
    .toPromise()
    .then(response => {
      this.success = true;
      this.loading = false;
      this.router.navigate(['vehicle-list'])
    },
      error => {
        this.loading = false;
        this.error = error.message;
      })
  }

}
