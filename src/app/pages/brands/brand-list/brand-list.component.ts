import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Crud } from 'src/app/core/helpers/Crud';
import { ModelService } from 'src/app/core/services/model.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent extends Crud implements OnInit {
  brands = null

  constructor(service: ModelService,
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
        }
      )
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      brand: ['', Validators.required]     
    })
  }

}
