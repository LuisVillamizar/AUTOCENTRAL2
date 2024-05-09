import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';
import { Crud } from 'src/app/core/helpers/Crud';
import { Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends Crud implements OnInit {

  public statuses = null;
  public currentStatus = null;

  constructor(
    service: GeneralService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private toast: ToastrService
  ) {
    super(service);
  }

  async ngOnInit() {
    let current: any = this.authenticationService.currentUserValue;
    if (current.employer_role == null) {
      this.modelId = current.id;
      this.setForms();
      this.listHistoryClientCar();
    } else {
      this.setForms();
      await this.getStatuses();
      await this.getStatusClient();
    }
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      status: ['', Validators.required]
    })
  }

  listHistoryClientCar(){
    this.service.listHistoryClient(this.modelId).toPromise().then(
      response => {
        this.model = response;
      },
      error => {
        this.toast.error("No hay resultados para mostrar","Operacion Fallida")
      }
    )
  }

  async getStatuses() {
    await this.service.statuses()
      .toPromise().then(
        response => {
          this.statuses = response;
        },
        error => {

        }
      )
  }

  async getStatusClient() {
    await this.service.dashboard(this.currentStatus)
      .toPromise().then(
        response => {
          this.model = response;
        },
        error => {
          console.log("getStatusClient");
        }
      )
  }

  changeStatus() {
    console.log(this.f.status.value)
    this.currentStatus = this.f.status.value;
    this.getStatusClient();
  }

  open(content, clientCar) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}
