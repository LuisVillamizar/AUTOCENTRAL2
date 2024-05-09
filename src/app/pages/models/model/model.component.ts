import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { ModelService } from 'src/app/core/services/model.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent extends Crud implements OnInit {

  brands = null

  constructor(
    service : ModelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    super(service)
  }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id')
    this.setForms();
    this.modelData();

    this.service.brand().toPromise()
    .then(
      response => {
        this.brands = response
        this.f.brand.setValue(1);
      }
    )
  }


  setModelData(response) {        
    this.f.brand.setValue(response.brand.id),
    this.f.name.setValue(response.name)
  }


  setForms() {
    this.modelForm = this.formBuilder.group({
      brand: ['', Validators.required],
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
      brand: {
        id: this.f.brand.value 
      }, 
      name: this.f.name.value    
    };

    this.service.update(data)
    .toPromise()
    .then(response => {
      this.success = true;
      this.loading = false;
      //this.router.navigate(['model-list'])
    },
      error => {
        this.loading = false;
        this.error = error;
      })
  }


  create() {
    
    const data ={
      brand: {
        id: this.f.brand.value 
      }, 
      name: this.f.name.value 
    };
    this.service.create(data)
    .toPromise()
    .then(response => {
      this.success = true;
      this.loading = false;
      this.router.navigate(['model-list'])
    },
      error => {
        this.loading = false;
        this.error = error.message;
      })
  }

}
