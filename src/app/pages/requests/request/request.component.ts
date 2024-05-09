import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { ClientVehicleService } from 'src/app/core/services/client-vehicle.service';
import { ClientService } from 'src/app/core/services/client.service';
import { ModelService } from 'src/app/core/services/model.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from 'src/app/core/services/vehicle.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends Crud implements OnInit {
  brands = null;
  client = null;
  models = null;
  vehicles = null;
  currendBrand = null;
  currentModel = null;
  clientId = null;

  constructor(
    service : ClientVehicleService,
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(service);
   }

  async ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id')
    this.setForms();
    await this.getBrand();
    await this.getModel();
    await this.getVehicle();
    await this.getClient();
  }

  changeBrand(e) {   
    this.currendBrand = this.f.brand.value;
    this.getModel();
  }

  changeModel() {   
    this.currentModel = this.f.model.value;
    this.getVehicle();
  }



  async getModel(){
    await this.modelService.list(0, this.currendBrand ).toPromise()
    .then(
      response => {
        this.models = response       
        this.f.model.setValue(this.models[0].id);    
        this.currentModel = this.models[0].id;
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

  async getVehicle(){
    await this.vehicleService.list(0, this.currentModel).toPromise()
    .then(
      response => {
        this.vehicles = response 
        this.f.vehicle.setValue("");
       
      }
    )
  }


  async getClient(){
    await this.clientService.show(this.clientId)
    .subscribe(
      response =>{
        this.client = response;        
      },
      error => {
        this.error="No se puede consultar la informacion"
      }
    )
  }



  setForms() {
    this.modelForm = this.formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      vehicle: ['', Validators.required],
      licensePlate: ['', Validators.required],
      numChasis: ['', Validators.required],
      color: ['', Validators.required]  
    })
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.modelForm.invalid) {
      return;
    }
    
    this.loading = true;  
    this.create();
    
  }


  create() {    
    const data ={
      idCar: this.f.vehicle.value,
      idClient: parseInt(this.clientId),
      licensePlate : this.f.licensePlate.value,
      numChasis : this.f.numChasis.value,
      color: this.f.color.value
    };
    this.service.create(data)
    .toPromise()
    .then(response => {
      this.success = true;
      this.loading = false;
      this.router.navigate(['request-list', {id:this.clientId}])
    },
      error => {
        this.loading = false;
        this.error = error.message;
      })
  }


}
