import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Crud } from 'src/app/core/helpers/Crud';
import { ModelService } from 'src/app/core/services/model.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent extends Crud implements OnInit {

  constructor(
    service: ModelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(service)
  }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id')
    this.setForms();
    this.modelDataBrand();
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  setModelData(response) {
    this.f.name.setValue(response.name)
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

    const data = {
      id: this.modelId,
      name: this.f.name.value,
      deletedAt: (this.f.status.value == "ACTIVO" ? false : true)
    };
    this.service.updateBrand(data)
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
      deletedAt: false
    };
    this.service.createBrand(data)
      .toPromise()
      .then(response => {
        this.success = true;
        this.loading = false;
        this.router.navigate(['brand-list'])
      },
        error => {
          this.loading = false;
          this.error = error.message;
        })
  }

}
