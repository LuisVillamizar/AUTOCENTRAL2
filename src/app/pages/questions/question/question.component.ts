import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Crud } from 'src/app/core/helpers/Crud';
import { questionService } from 'src/app/core/services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent extends Crud implements OnInit {

  estado : Boolean = true;
  typeReply: any;
  type = null;

  constructor(service: questionService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    super(service);
  }

  ngOnInit(): void {
    this.modelId = this.route.snapshot.paramMap.get('id')
    this.setForms();
    this.modelData();
    this.typeReply = [{id:0, name:'TEXTO'}, {id:1, name:"IMAGEN"}]
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      name: ['', Validators.required],
      estado: ['',Validators.required],
      type: ['', Validators.required],
    })

    if(!this.modelId){
      this.f.estado.setValue(true);
    }
  }

  setModelData(response) {
    this.f.name.setValue(response.question);
    this.f.estado.setValue(response.status);
    this.f.type.setValue(this.typeReply[(response.image ? 1 : 0)].id);
    this.estado = response.status;
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

  changedEstado(){
    if(this.estado){
      this.estado = false;
    }else{
      this.estado = true;
    }
  }

  update() {
    const data = {
      id: this.modelId,
      question: this.f.name.value,
      image: (this.f.type.value == 0 ? false : true),
      status: this.f.estado.value
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
    const data = {
      question: this.f.name.value,
      image: false,
      status: this.f.estado.value
    };
    this.service.create(data)
      .toPromise()
      .then(response => {
        this.success = true;
        this.loading = false;
        this.router.navigate(['question-list'])
      },
        error => {
          this.loading = false;
          this.error = error.message;
        })
  }
  

}
