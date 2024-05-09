import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Crud } from 'src/app/core/helpers/Crud';
import { questionService } from 'src/app/core/services/question.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent extends Crud implements OnInit {

  questions = null;
 

  constructor(service : questionService,private formBuilder: FormBuilder) {
      super(service)
   }

  ngOnInit(): void {
    this.setForms()
    this.service.question().toPromise()
      .then(
        response => {
          this.questions = response
        }
      )
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      question: ['', Validators.required]     
    })
  }


}
