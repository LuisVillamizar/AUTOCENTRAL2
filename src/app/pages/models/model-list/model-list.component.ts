import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { ModelService } from 'src/app/core/services/model.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent extends Crud implements OnInit {
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
    this.setForms()
    this.service.brand().toPromise()
    .then(
      response => {
        this.brands = response
        this.f.brand.setValue(1);
        this.list(0, this.f.brand.value);
      }
    )
    
    
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      brand: ['', Validators.required]     
    })
  }

  listModel(){
    this.list(0, this.f.brand.value);
  }

}
