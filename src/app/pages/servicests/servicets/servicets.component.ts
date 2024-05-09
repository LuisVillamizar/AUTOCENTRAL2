import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Crud } from 'src/app/core/helpers/Crud';
import { servicesService } from 'src/app/core/services/services.service';

@Component({
  selector: 'app-servicets',
  templateUrl: './servicets.component.html',
  styleUrls: ['./servicets.component.css']
})
export class ServicetsComponent extends Crud implements OnInit {

  estado : Boolean = true;
  isProduct : Boolean = true;

  constructor(service : servicesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    super(service)
   }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id')
    this.setForms();
    this.modelData();
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      name: ['', Validators.required],
      duration: ['',Validators.required],
      price: ['', Validators.required],
      estado: ['', Validators.required],
      isProduct: ['',Validators.required]
    })

    if(!this.modelId){
      this.f.estado.setValue(true);
      this.f.isProduct.setValue(true);
    }
  }

  setModelData(response) {
    this.f.name.setValue(response.name);
    this.f.duration.setValue(response.durationTime);
    this.f.price.setValue(response.price);
    this.f.estado.setValue(response.status);
    this.f.isProduct.setValue(response.isProduct);
    this.estado = response.status;
    this.isProduct = response.isProduct;
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

  changedEstado(id){
    if(id == 1){
      if(this.estado){
        this.estado = false;
      }else{
        this.estado = true;
      }
    } else {
      if(this.isProduct){
        this.isProduct = false;
      }else{
        this.isProduct = true;
      }
    }
    console.log(this.isProduct)
  }
  
  update() {
    const data = {
      id: this.modelId,
      name: this.f.name.value,
      status: this.f.estado.value,
      durationTime: this.f.duration.value,
      price: this.f.price.value,
      isProduct: this.isProduct
    };

    console.log(data)
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
    const data = {
      name: this.f.name.value,
      status: this.f.estado.value,
      durationTime: this.f.duration.value,
      price: this.f.price.value,
      isProduct: this.isProduct
    };

    console.log(data)
    this.service.create(data)
      .toPromise()
      .then(response => {
        this.success = true;
        this.loading = false;
        this.router.navigate(['service-list'])
      },
        error => {
          this.loading = false;
          this.error = error.message;
        })
  }
  

}
