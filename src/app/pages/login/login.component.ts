import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { first } from 'rxjs/operators';
import { User } from 'src/app/core/models/user';
import { ClientService } from 'src/app/core/services/client.service';
import { Crud } from 'src/app/core/helpers/Crud';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { role } from 'src/app/core/models/role';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Crud implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  stateOptions: any[];
  user: User;
  urlTree: any;
  idUrl: string;
  public modalRef: BsModalRef;
  updateForm: FormGroup;
  message: any;
  alert: boolean = false;
  pss1: string = "";
  pss2: string = "";
  private body: any;
  welcome : any;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    clientService: ClientService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private toast: ToastrService
  ) {
    super(clientService);
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }

    this.urlTree = this.router.parseUrl(this.router.url);
    this.idUrl = this.urlTree.queryParams['id'];
    if (this.idUrl == undefined) {
      this.idUrl = "1";
      this.welcome = "CLIENTE";
    }else {
      this.welcome = "ADMINISTRADOR"
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.updateForm = this.formBuilder.group({
      pass1: ['', Validators.required],
      pass2: ['', Validators.required]
    })

    this.returnUrl = '/dashboard';
  }
  ngOnDestroy() {
  }

  get f() { return this.loginForm.controls; }


  //Metodo que se ejecuta al Ingresar
  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;

    //stop here if form is invalid
    if (this.loginForm.invalid) {
      this.toast.error("Datos requeridos", "Operacion Fallida")
      return;
    }
    this.loading = true;
    this.user = new User();
    this.user.user = this.f.username.value;
    this.user.password = this.f.password.value;
    //this.user.user = "luisV@gmail.com"
    //this.user.password = "12345678"
      this.authenticationService.login(this.user, this.idUrl).subscribe(
      success => {
               if (this.idUrl == "35") {
          if (this.checkRol(success.employer_role)) {
            if (success.statePassword) {
              this.body = success;
              this.openModal(template);
            } else {
              this.router.navigate([this.returnUrl])
            }
          }else{
            this.loading = false;
            Swal.fire({
              title: 'Error!',
              text: 'Acceso no autorizado',
              icon: 'error',
              confirmButtonText: 'OK'
            })
            localStorage.removeItem('currentUser');
           
          }
        } else {
        
          if (success.statePassword) {
            this.body = success;
            this.openModal(template);
          } else {
            this.router.navigate(['/request-list'])
          }
        }
      },
      err => {
       
        this.toast.error("Usuario y/o Contraseña Incorrectos", "Operacion Fallida")
        //this.error = error;
        this.loading = false;
      }
    )

  }

  checkRol(list:any[]): boolean {
    let listRole = list;
    for (let i of listRole) {
      if (i.role_id.name == "ADMINISTRADOR" || "Administrador") {
        return true;
      } else {
        return false;
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }

  checkPasswords() {
    if (this.updateForm.valid) {
      if (this.pss1 != this.pss2) {
        this.alert = true;
        this.message = "Los campos no coinciden, verificar";
      } else {
        if(this.idUrl == "35"){
          this.service.updateEmployerPss(this.body.id, this.pss1)
          .toPromise()
          .then(response => {

            this.success = true;
            this.loading = false;
            this.router.navigate([this.returnUrl])
            this.modalRef.hide();
          },
            error => {

              this.loading = false;
              this.error = error;
            })
        }else{
          this.service.updatePss(this.body.id, this.pss1)
          .toPromise()
          .then(response => {
            this.success = true;
            this.loading = false;
            this.router.navigate(['/request-list'])
            this.modalRef.hide();
          },
            error => {

              this.loading = false;
              this.error = error;
            })
        }
        
      }
    } else {
      this.alert = true;
      this.message = "Diligencie el formulario completamente";
    }
  }

}
