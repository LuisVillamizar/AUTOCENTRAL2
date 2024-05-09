import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { ClientService } from 'src/app/core/services/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { Location } from '@angular/common';
import { DocumentService } from 'src/app/core/services/document.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-client',
  templateUrl: './user-client.component.html',
  styleUrls: ['./user-client.component.css']
})
export class UserClientComponent extends Crud implements OnInit {

  typeDocuments = null;
  countries = null;
  daneMunicipalities = null;
  daneDepartaments = null;
  currentDaneDepartaments = 3
  typeDefaultValue = null
  private password : string;
  private flagCliente : boolean = false;
  statePss : Boolean;


  constructor(
    clientService: ClientService,
    private documentService: DocumentService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toast: ToastrService,
    private authenticationService: AuthenticationService) {
    super(clientService);
  }

  ngOnInit(): void {
    let current : any = this.authenticationService.currentUserValue;
    if(current.employer_role == null){
        this.modelId = current.id;
        this.flagCliente = true;
    }else{
        this.modelId = this.route.snapshot.paramMap.get('id')
    }
    this.setForms();
    this.modelData();
     this.documentService.list().toPromise()
      .then(
        response => {
          this.typeDocuments = response
          this.f.type.setValue(this.typeDocuments[0].id);
        }
      )
  }

  setModelData(response) {
    console.log(response)
    this.f.num_document.setValue(response.numDocument),
    this.f.name.setValue(response.name),
    this.f.surname.setValue(response.surname),
    this.f.mail.setValue(response.mail),
    this.f.type.setValue(response.typeDocument.id),
    this.f.phone.setValue(response.phone),
    this.f.cellphone.setValue(response.cellPhone),
    this.f.address.setValue(response.direction),
    this.f.dateOfBirth.setValue(response.dateOfBirth),
    this.f.city.setValue(response.city);
    this.password = response.password;
    this.statePss = response.statePassword;
  }

  setForms() {
    this.modelForm = this.formBuilder.group({
      num_document: [this.model?.numDocument, Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      mail: ['', Validators.required],
      type: ['', Validators.required],
      phone: ['', Validators.required],
      cellphone: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['',Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.modelForm.invalid) {
      this.toast.error("Campos obligatorios", "Operacion Fallida");
      return;
    }
    this.loading = false;
    if (this.modelId) {
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
    const data ={
      id: this.modelId,
      numDocument: this.f.num_document.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      mail: this.f.mail.value,
      typeDocument: {
        id: this.f.type.value
      },
      phone: this.f.phone.value,
      cellPhone: this.f.cellphone.value,
      direction: this.f.address.value,
      dateOfBirth: this.f.dateOfBirth.value,
      city: this.f.city.value,
      age: this.ageCalculator(),
      password: this.password,
      statePassword: this.statePss
    };


    this.service.update(data)
    .toPromise()
    .then(response => {
      Swal.fire({
        icon: 'success',
        text: 'Cambios guardados correctamente',
        timer: 1500,
        showConfirmButton: false
      })
      this.success = true;
      this.loading = false;

      this.router.navigate(['user-client-list'])

    },
      error => {

        this.loading = false;
        this.error = error;
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
    const data ={
      numDocument: this.f.num_document.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      mail: this.f.mail.value,
      typeDocument: {
        id: this.f.type.value
      },
      phone: this.f.phone.value,
      cellPhone: this.f.cellphone.value,
      direction: this.f.address.value,
      dateOfBirth: this.f.dateOfBirth.value,
      city: this.f.city.value,
      age: this.ageCalculator()
    };
    this.service.create(data)
    .toPromise()
    .then(response => {
      this.success = true;
      this.loading = false;
      this.router.navigate(['user-client-list'])
      Swal.fire({
        icon: 'success',
        text: 'Lista Actualizada',
        timer: 1500,
        showConfirmButton: false
      })
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo crear el usaurio, probablemente ya exista por favor verifique los datos'
        })
        this.loading = false;
        this.error = error.message;
      })
  }

  goBack() {
    this.location.back();
  }

  ageCalculator(){
    if(this.f.dateOfBirth.value){
      const convertAge = new Date(this.f.dateOfBirth.value);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
  }

}
