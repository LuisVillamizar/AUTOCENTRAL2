import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { first } from 'rxjs/operators';
import { Crud } from 'src/app/core/helpers/Crud';
import { DocumentService } from 'src/app/core/services/document.service';
import { role } from 'src/app/core/models/role';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-system',
  templateUrl: './user-system.component.html',
  styleUrls: ['./user-system.component.scss']
})
export class UserSystemComponent implements OnInit {

  userSystemForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  success = false;
  user = null;
  userId = null;
  adminCode: boolean = true;
  tecnicoCode: boolean = false;
  typeDocuments = null;
  statePss: Boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')
    this.setForms();
    this.userData();
    this.documentService.list().toPromise()
    .then(
      response => {
        this.typeDocuments = response
        this.f.type.setValue(this.typeDocuments[0].id);
      }
    )
  }

  userData() {
    if (this.userId) {
      this.userService.show(this.userId)
        .subscribe(
          response => {
            console.log(response)
            this.user = response;
            this.f.num_document.setValue(this.user?.numDocument)
            this.f.name.setValue(this.user?.name)
            this.f.surname.setValue(this.user?.surname)
            this.f.mail.setValue(this.user?.mail)
            this.f.dateOfBirth.setValue(this.user?.dateOfBirth),
            this.f.phone.setValue(this.user?.phone),
            this.f.address.setValue(this.user?.address),
            this.f.cellphone.setValue(this.user?.cellPhone),
            this.f.city.setValue(this.user?.city)
            this.f.type.setValue(this.user?.typeDocument.id),
            this.verifyRole(this.user?.employer_role);
            this.statePss = this.user?.statePassword;
          },
          error => {
            this.error = "No se puede consultar la informacion del usuario"
          }
        )
    }
  }

  verifyRole(lista: any[]) {

    this.adminCode = false;
    this.tecnicoCode = false;
    
    if (lista.length != 0) {
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].role_id.name == "ADMINISTRADOR") {
          this.adminCode = true;
        }

        if (lista[i].role_id.name == "TECNICO") {
          this.tecnicoCode = true;
        }
      }
    }
  }

  setForms() {
    this.userSystemForm = this.formBuilder.group({
      type: ['', Validators.required],
      num_document: [this.user?.numDocument, Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      mail: ['', Validators.required],
      administrador: [true, Validators.required],
      tecnico: [false, Validators.required],
      dateOfBirth: ['', Validators.required],
      phone: ['', Validators.required],
      cellphone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
    })
  }

  get f() { return this.userSystemForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userSystemForm.invalid) {
      return;
    }
    this.loading = true;

    if (this.userId) {
      this.update();
    } else {
      this.create();
    }
  }

  update() {
    Swal.fire({
      text: 'Por favor espere',
      imageUrl: '../assets/img/brand/load.gif',
      imageWidth: 200,
      imageHeight: 200,
      showConfirmButton: false,
      allowOutsideClick: false
    })
    let idAdministrador: number = (this.adminCode == true ? 1 : 0);
    let idTecnico: number = (this.tecnicoCode == true ? 1 : 0);

    this.userService.update(this.userId, {
      typeDocument: {
        id: this.f.type.value
      },
      numDocument: this.f.num_document.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      mail: this.f.mail.value,
      dateOfBirth: this.f.dateOfBirth.value,
      phone: this.f.phone.value,
      address: this.f.address.value,
      cellPhone: this.f.cellphone.value,
      city: this.f.city.value,
      age: this.ageCalculator(),
      statePassword: this.statePss
    },idAdministrador, idTecnico).pipe(first()).subscribe(response => {
      Swal.fire({
        icon: 'success',
        text: 'Cambios guardados correctamente',
        timer: 1500,
        showConfirmButton: false
      })
      this.success = true;
      this.loading = false;
      this.router.navigate(['user-system-list'])
      

    },
      error => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al intentar guardar cambios'
        })
      })
  }


  create() {
    Swal.fire({
      text: 'Por favor espere',
      imageUrl: '../assets/img/brand/load.gif',
      imageWidth: 200,
      imageHeight: 200,
      showConfirmButton: false,
      allowOutsideClick: false
    })
    let idAdministrador: number = (this.adminCode == true ? 1 : 0);
    let idTecnico: number = (this.tecnicoCode == true ? 1 : 0);

    this.userService.create({
      numDocument: this.f.num_document.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      mail: this.f.mail.value,
      dateOfBirth: this.f.dateOfBirth.value,
      phone: this.f.phone.value,
      address: this.f.address.value,
      cellPhone: this.f.cellphone.value,
      city: this.f.city.value,
      age: this.ageCalculator()

    }, idAdministrador, idTecnico).pipe(first()).subscribe(response => {

      this.success = true;
      this.loading = false;
      this.router.navigate(['user-system-list'])
      Swal.fire({
        icon: 'success',
        text: 'Lista Actualizada',
        timer: 1500,
        showConfirmButton: false
      })
    },
      error => {
        this.loading = false;
        this.error = "Error al crear el usuario";
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al crear el usuario'
        })
      })
  }



  checkPassword() {
    if ((this.f.password.value != '') && (this.f.password_confirm.value != '')) {
      if (this.f.password.value != this.f.password_confirm.value) {
        this.error = "Las contraseñas no coinciden";
        this.loading = false;
        this.f.password.setValue("");
        this.f.password_confirm.setValue("");
        return false;
      }
      return true;
    }
    return true;
  }

  ageCalculator(){
    if(this.f.dateOfBirth.value){
      const convertAge = new Date(this.f.dateOfBirth.value);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
  }

  saveRole():any[]{
    let lista = new Array();
    var rol : role;

   

    if(this.adminCode){
      rol = new role();
      rol.id = 1;
      rol.name = "ADMINISTRADOR";
      lista.push(rol)
    }

    if(this.tecnicoCode){
      rol = new role();
      rol.id = 2;
      rol.name = "TECNICO"
      lista.push(rol)
    }

    return lista;
  }
}



