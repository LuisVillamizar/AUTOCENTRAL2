import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { Crud } from 'src/app/core/helpers/Crud';
import { ClientService } from 'src/app/core/services/client.service';
import { ModelService } from 'src/app/core/services/model.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientVehicleService } from 'src/app/core/services/client-vehicle.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from 'src/app/core/services/general.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { questionCheckListService } from 'src/app/core/services/question-check-list.service';
import { questionCheckList } from 'src/app/core/models/questionCheckList';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { stringify } from '@angular/compiler/src/util';
import { quotationService } from 'src/app/core/services/quotation.service';
import { servicesService } from 'src/app/core/services/services.service';
import { NameStatus } from 'src/app/core/models/NameStatus';
import Swal from 'sweetalert2';
import { proceduresService } from 'src/app/core/services/procedures.service';
import { checklistService } from 'src/app/core/services/checklist.service';
import { historyAcceptedService } from 'src/app/core/services/history-accepted.service';
import { ModelComponent } from '../../models/model/model.component';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent extends Crud implements OnInit {

  client = null;
  closeResult = '';
  title = 'app';
  elementType = 'url';
  value = null;
  href = "";
  currentClientCar = null;
  private flagCliente: boolean = false;
  public modalRef: BsModalRef;
  bodyResponse: any;
  tmpBodyResponse: any;
  listaPreguntas: any;
  listaQuestionSave: any[];
  message: any;
  license: any;
  source = '';
  listaServicios: any;
  addServicios: any;
  tmpAddServicios: any;
  historyClientCar: any;
  nameStatus: NameStatus;
  tmpQuotation: any;
  tmpClientCar: any;
  flag: Boolean;
  flagSalida: Boolean;
  loged: any;
  orden: any;
  kilometraje: any;
  tmpCheckList: any = {
    mileage: null,
    observations: null,
    observationDetail: null,
    observationOutput: null
  };

  observations: any;
  observationDetail: any;
  timein: any;
  observationQuotation: any;
  flagButton: Boolean = true;
  observationOutput: any;
  historyClientCarId: any;
  timeOut: any;
  listEmployer: any;
  employer: any;
  listServices: any;
  listProducts: any;
  textButton = 'SERVICIOS';
  flagList: Boolean = false;
  additionalService: Boolean = false;
  idProcedure: any;
  bodyResponseTwo: any;
  sending: Boolean;
  listaImagenes: any = null;
  listaPreguntas1: any;
  listaPreguntas2: any;
  listaPreguntas3: any;
  selectEmployer: any;


  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };


  constructor(
    service: ClientVehicleService,
    private clientService: ClientService,
    private generalService: GeneralService,
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private bsModalService: BsModalService,
    private toast: ToastrService,
    private serviceQuestion: questionCheckListService,
    private serviceQuotation: quotationService,
    private serviceService: servicesService,
    private serviceProcedure: proceduresService,
    private serviceCheckList: checklistService,
    private serviceHistory: historyAcceptedService,
    private serviceUser: UserService
  ) {
    super(service);

  }

  async ngOnInit() {
    this.loged = JSON.parse(localStorage.getItem('currentUser'));
    this.nameStatus = new NameStatus();
    let current: any = this.authenticationService.currentUserValue;

    if (current.employer_role == null) {
      this.modelId = current.id;
      this.flagCliente = true;
    } else {
      this.modelId = this.route.snapshot.paramMap.get('id')
    }
    await this.getClient();
    this.list(0, this.modelId);
    this.modelForm = this.formBuilder.group({
      responses: Validators.required
    })
    this.lisEmployer();
  }

  async getClient() {
    await this.clientService.show(this.modelId)
      .subscribe(
        response => {
          this.client = response;
        },
        error => {
          this.error = "No se puede consultar la informacion"
        }
      )
  }

  /*-------------------------- VISTA PRINCIPAL -------------------------
  ----------------------------------------------------------------------*/

  /* BOTON HISTORIAL */
  viewHistory(template: TemplateRef<any>, item) {
    this.openModal(template)
    this.historyForClientCar(item.id)
    this.tmpClientCar = item;
    this.verifyMileage(item);
    this.flag = true;
    this.license = item.licensePlate;
  }

  historyForClientCar(id: any) {
    this.service.historyForClientCar(id).toPromise().then(
      (success: any) => {
        this.bodyResponse = success;
        this.tmpBodyResponse = this.bodyResponse;
       
      },
      (err: any) => {
        this.toast.error("No se obtuvieron datos", "Operacion Fallida")
      }
    )
  }

  /* BOTON VER CHECKLIST */
  async viewUltimateCheckList(template: TemplateRef<any>, item: any) {
    this.flagSalida = false;
  
    if (item.state.id == 2 || item.state.id == 7) {
      if (item.state.id == 7) {
        this.flagSalida = true;
      }
      this.openModal(template)
      this.verificarFinalLista(item.id)
      this.license = item.clientCar.licensePlate;
      this.historyClientCarId = item.id;
      if (item.lastRecord) {
        this.flagButton = true;
      } else {
        this.flagButton = false;
      }
    } else if (item.state.id == 3) {
      await this.finalQuotation(item);
      this.listaServiciosFinal(item.id);
      this.openModal(template)
      this.license = item.clientCar.licensePlate;
      if (item.lastRecord) {
        this.flagButton = true;
      } else {
        this.flagButton = false;
        this.additionalService = true;
        this.additionalServiceList();
      }

    } else if (item.state.id == 5) {
      this.router.navigate(['/procedure-list', { id: item.id }]);
      this.bsModalService.hide();
    } else if (item.state.id == 6) {
      console.log("Invoice...");
      this.router.navigate(['/invoice-list', { id: item.id }]);
      this.bsModalService.hide();
    }
  }

  async finalQuotation(item) {
    await this.serviceQuotation.ultimeQuotation(item.id).toPromise().then(
      success => {
        this.tmpQuotation = success;
        this.observationQuotation = this.tmpQuotation.observation;
        this.observationOutput = this.tmpQuotation.observationOutput;
        this.employer = this.tmpQuotation.idEmployer?.id;
        this.selectEmployer = this.tmpQuotation.idEmployer;
      },
      err => {
      
      }
    )
  }

  listaServiciosFinal(id) {
    this.service.finalList(id).subscribe(
      success => {
        this.listaServicios = success
      },
      err => {
       
        this.toast.error('Error al obtener datos', 'Operacion fallida');
      }
    )
  }

  verificarFinalLista(data: number) {
    this.service.finalList(data).toPromise().then(
      (success: any) => {
        this.listaImagenes = new Array();
        this.listaPreguntas1 = new Array();
        this.listaPreguntas2 = new Array();
        this.listaPreguntas3 = new Array();
        this.listaPreguntas = success;
        //this.orden = this.listaPreguntas[0].idCheckList.id;
        for (var i = 0; i < success.length; i++) {
          if (success[i].idQuestion.image) {
            this.source = success[i].response;
            this.listaImagenes.push(success[i]);
          }
        }
        for (var i = 0; i < success.length; i++) {
          if (i <= 18) {
            this.listaPreguntas1.push(success[i])
          } else if (i >= 19 && i <= 37) {
            this.listaPreguntas2.push(success[i])
          } else if (i >= 38) {
            this.listaPreguntas3.push(success[i])
          }
        }
      },
      (err: any) => {
       
        
        this.toast.error('Error al obtener datos', 'Operacion fallida');
      }
    )
  }



  /*--------------------------FIN VISTA PRINCIPAL -------------------------
  ----------------------------------------------------------------------*/


  /* ----------------------- INGRESO -----------------------------------
  ---------------------------------------------------------------------*/

  /* BOTON INGRESO */
  viewQuestionList(template: TemplateRef<any>, item: any) {
  
    this.openModal(template)

    /*Valida la salida del Vehiculo, actualmente 
    funciona con el Id 7 pero eventualmente se debe modificar
    Para que funcione con el flujo que se establecera*/

    if (item.idStatus == 7) { 
      this.flagSalida = true;
    }
    
     /*Este metodo se ejecuta a la hora de dar ingreso al carro*/

    this.verificarLista(item)
    this.license = item.licensePlate;
    this.tmpClientCar = item;
  }
  

  //METODO ENCARGADO DE LISTAR LA PREGUNTAS
   verificarLista(item) {
 
     this.service.listaIngreso(item.id).toPromise().then(
      success => {    
        
        this.listaImagenes    = new Array();
        this.listaPreguntas1  = new Array();
        this.listaPreguntas2  = new Array();
        this.listaPreguntas3  = new Array();
        this.listaPreguntas   = success;
        //this.orden = this.listaPreguntas[0].idCheckList.id;
        for (var i = 0; i < success.length; i++) {
          if (success[i].idQuestion.image) {
            this.source = success[i].response;
            this.listaImagenes.push(success[i]);
          }
        }
        for (var i = 0; i < success.length; i++) {
          if (i <= 18) {
            this.listaPreguntas1.push(success[i])
          } else if (i >= 19 && i <= 37) {
            this.listaPreguntas2.push(success[i])
          } else if (i >= 38) {
            this.listaPreguntas3.push(success[i])
          }
        }
        this.verifyMileage(item)
      },
      err => {
        if (item.idStatus != 7) {
            
          this.service.newIngreso(item.id).toPromise().then(
            (success: any) => {
                
              this.listaImagenes = new Array();
              this.listaPreguntas1 = new Array();
              this.listaPreguntas2 = new Array();
              this.listaPreguntas3 = new Array();
              this.listaPreguntas = success;
              for (var i = 0; i < success.length; i++) {
                if (success[i].idQuestion.image) {
                  this.source = success[i].response;
                  this.listaImagenes.push(success[i]);
                }
              }
              for (var i = 0; i < success.length; i++) {
                if (i <= 18) {
                  this.listaPreguntas1.push(success[i])
                } else if (i >= 19 && i <= 37) {
                  this.listaPreguntas2.push(success[i])
                } else if (i >= 38) {
                  this.listaPreguntas3.push(success[i])
                }
              }
              this.verifyMileage(item)
            },
            (err: any) => {
              
            }
          )
        }
      }
    )
  }

  async verifyMileage(item) {
    if (item.idStatus == 1) {
      if (item.historyClientCars.size >= 4) {
        this.findProdcedure(item.historyClientCars[item.historyClientCars.length - 4].id);
      }
    }
    if (item.idStatus == 2) {
      var id = item.historyClientCars[item.historyClientCars.length - 1].id;
      this.historyClientCarId = id;
      if (item.historyClientCars.size >= 5) {
        this.findProdcedure(item.historyClientCars[item.historyClientCars.length - 5].id);
      }
    } else if (item.idStatus == 3) {
      var id = item.historyClientCars[item.historyClientCars.length - 2].id;
      this.historyClientCarId = id;
    } else if (item.idStatus == 5) {
      var id = item.historyClientCars[item.historyClientCars.length - 3].id;
      this.findProdcedure(item.historyClientCars[item.historyClientCars.length - 1].id);
    } else if (item.idStatus == 6) {
      var id = item.historyClientCars[item.historyClientCars.length - 4].id;
      this.findProdcedure(item.historyClientCars[item.historyClientCars.length - 2].id);
    } else if (item.idStatus == 7) {
      var id = item.historyClientCars[item.historyClientCars.length - 5].id;
      this.historyClientCarId = id;
      this.findProdcedure(item.historyClientCars[item.historyClientCars.length - 3].id);
    }

     if (item.idStatus != 1) { 
     await this.serviceCheckList.getOne(id).toPromise().then(
        success => {
          this.tmpCheckList = success;
          this.kilometraje = this.tmpCheckList.mileage;
          this.observations = this.tmpCheckList.observations;
          this.observationDetail = this.tmpCheckList.observationDetail;
          this.timein = this.tmpCheckList.createdAt;
          this.timeOut = this.tmpCheckList.updatedAt;
          this.observationOutput = this.tmpCheckList.observationOutput;
          this.orden = this.tmpCheckList.numOrder;
          
        },
        err => {
          
        }
      )
    }
  }

  saveMileage() {
    
    this.tmpCheckList.mileage = this.kilometraje;
    this.tmpCheckList.observations = this.observations;
    this.tmpCheckList.observationDetail = this.observationDetail;
    this.tmpCheckList.observationOutput = this.observationOutput;

    this.serviceCheckList.save(this.tmpCheckList).subscribe(
      success => {
       
      },
      err => {
       
      }
    )
  }

  findProdcedure(id) {
    this.serviceProcedure.listProcedure(id).subscribe(
      success => {
        var procedureBody: any = success;
        this.idProcedure = procedureBody.id;
        
      },
      err => {
        
      }
    )
  }

  updateSource($event: Event, item) {
    this.projectImage($event.target['files'][0], item);
  }

  projectImage(file: File, item) {
    let reader = new FileReader;
    reader.onload = (e: any) => {
      this.source = e.target.result;
      this.onChange.emit(file);
      item.response = this.source;
    };
    reader.readAsDataURL(file);
  }

  /* BOTON ACEPTAR */
  accept(item) {
    let idClientCar = item[0].idCheckList.idHistoryClientCar.clientCar.id
    //Flujo para aceptar la salida
    if (item[0].idCheckList.idHistoryClientCar.state.id == 7) {
      this.service.endProcess(idClientCar).subscribe(
        success => {
          this.doHide();
          this.list(0, this.modelId);
          this.saveHistory();
          this.router.navigate(['user-client-list'])
        },
        err => {
         
          this.toast.error('Error al tratar de aceptar la salida', 'Operacion Fallida');
        }
      )
    } else {
      // Flujo para aceptar el ingreso
      //   y pasar a cotizacion         
      this.serviceQuotation.new(idClientCar).toPromise().then(
        success => {
          this.doHide();
          this.list(0, this.modelId);
          this.saveHistory();
        },
        err => {
         
        }
      )
    }

  }

  saveHistory() {
    this.serviceHistory.saveHistory((this.flagCliente == true ? this.loged.id : "0"), (this.flagCliente == true ? "0" : this.loged.id), this.historyClientCarId).subscribe(
      success => {

      },
      err => {
      
  
      }
    )
  }

  /* BOTON GUARDAR */
  saveQuestions(item: any[], item2: any[], item3: any[]) {
    this.listaQuestionSave = new Array();
    for (let i = 0; i < item.length; i++) {
      let obj: questionCheckList;
      obj = new questionCheckList;

      obj.id = item[i].id;
      obj.idCheckList = item[i].idCheckList.id;
      obj.idQuestion = item[i].idQuestion.id;
      obj.response = item[i].response

      this.listaQuestionSave.push(obj);
    }

    for (let i = 0; i < item2.length; i++) {
      let obj: questionCheckList;
      obj = new questionCheckList;

      obj.id = item2[i].id;
      obj.idCheckList = item2[i].idCheckList.id;
      obj.idQuestion = item2[i].idQuestion.id;
      obj.response = item2[i].response

      this.listaQuestionSave.push(obj);
    }

    for (let i = 0; i < item3.length; i++) {
      let obj: questionCheckList;
      obj = new questionCheckList;

      obj.id = item3[i].id;
      obj.idCheckList = item3[i].idCheckList.id;
      obj.idQuestion = item3[i].idQuestion.id;
      obj.response = item3[i].response

      this.listaQuestionSave.push(obj);
    }

    this.serviceQuestion.create(this.listaQuestionSave).toPromise().then(
      success => {
        this.toast.success('Respuestas guardadas satisfactoriamente', 'Operacion Exitosa')
      },
      err => {
      
      }
    )
    this.saveMileage();
  }

  /* ----------------------- FIN INGRESO --------------------------------
  ---------------------------------------------------------------------*/


  /* ----------------------- COTIZACION ---------------------------------
  ---------------------------------------------------------------------*/

  /* BOTON COTIZACION */
  async viewServiceList(template: TemplateRef<any>, item: any) {
    await this.ultimateQuotation(item);
    this.ServiceList(item);
    this.license = item.licensePlate;
    this.openModal(template);
    this.verifyMileage(item);
    this.tmpClientCar = item;
    this.flagButton = true;
  }

  ServiceList(item) {
    this.serviceQuotation.list(item.id).subscribe(
      success => {
        this.listaServicios = success;
      },
      err => {
      
      }
    )
  }



  /* BOTON ACTUALIZAR VALOR */
  modifyValue(item) {
    this.serviceQuotation.updateValue(item).subscribe(
      success => {
        this.toast.success("Valor actualizado exitosamente", "Operacion Exitosa")
        this.ServiceList(this.tmpClientCar);
        this.ultimateQuotation(this.tmpClientCar);
      },
      err => {
      
        this.toast.error("Error al editar servicio", "Operacion Fallida")
      }
    )
  }

  /* BOTON ELIMINAR */
  removeValue(item) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Se eliminara permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,eliminar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceQuotation.deleteItem(item.id).subscribe(
          success => {
            this.toast.success("Servicio eliminado exitosamente", "Operacion Exitosa")
            this.ServiceList(this.tmpClientCar);
            this.ultimateQuotation(this.tmpClientCar);
          },
          err => {
            
            this.toast.error("Error al eliminar servicio", "Operacion Fallida")
          }
        )
      }
    })
  }

  /*MODIFICAR VALOR SERVICIO ADICIONAL*/
  modifyValueAdditional(item) {
    this.serviceProcedure.saveServiceAdditional(item).subscribe(
      success => {
        this.toast.success("Valor actualizado exitosamente", "Operacion Exitosa")
        this.additionalServiceList();
      },
      err => {
        this.toast.error("Error al editar servicio", "Operacion Fallida")
      }
    )
  }

  /*ELIMINAR SERVICIO ADICIONAL*/
  removeValueAdditional(item) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Se eliminara permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,eliminar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceProcedure.delAdditionalService(item.id).subscribe(
          success => {
            this.toast.success("Servicio eliminado exitosamente", "Operacion Exitosa")
            this.additionalServiceList();
          },
          err => {
            this.toast.error("Error al eliminar servicio", "Operacion Fallida")
          }
        )
      }
    })
  }

  /* BOTON ACEPTAR */

  acceptQuotation() {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Se aceptara esta cotizacion',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceProcedure.new(this.tmpClientCar.id).subscribe(
          success => {
            this.toast.success("Cotizacion aceptada exitosamente", "Operacion Exitosa")
            this.doHide();
            this.list(0, this.modelId);
            this.saveHistory();
          },
          err => {
           
            this.toast.error("Error al eliminar servicio", "Operacion Fallida")
          }
        )
      }
    })

  }

  saveObservation() {
    this.tmpQuotation.observation = this.observationQuotation;
    this.serviceQuotation.update(this.tmpQuotation).subscribe(
      success => {
        this.ultimateQuotation(this.tmpClientCar);
      },
      err => {
        
      }
    )
  }


  findEmploye(id){
   
    return this.listEmployer.find(employer => employer.id == id);
  }

  saveEmploye() {

    let employer = this.findEmploye(this.employer);
    this.selectEmployer = employer;
    this.tmpQuotation.idEmployer = employer;

    this.serviceQuotation.update(this.tmpQuotation).subscribe(
      success => {
        this.ultimateQuotation(this.tmpClientCar);
      },
      err => {
        
      }
    )
  }

  /* ----------------------- FIN COTIZACION ---------------------------
 ---------------------------------------------------------------------*/


  /* ----------------------- LISTA SERVICIOS --------------------------
  ---------------------------------------------------------------------*/

  /* BOTON AGREGAR SERVICIO */
  addServiceList(template: TemplateRef<any>) {
    this.openModal(template);
    this.serviceService.listActive().subscribe(
      success => {
        this.addServicios = success;
        this.tmpAddServicios = this.addServicios;

        this.listServices = new Array();
        this.listProducts = new Array();
        for (var i = 0; i < this.addServicios.length; i++) {
          if (this.addServicios[i].isProduct == true) {
            this.listServices.push(this.addServicios[i]);
          } else {
            this.listProducts.push(this.addServicios[i]);
          }
        }
        
      },
      err => {
        
      }
    )
  }

  /* BOTON AÑADIR */
  addNewValues(item) {
    if (this.additionalService) {
      var idServicio = item.id;
      this.serviceProcedure.addServiceAdditional(this.idProcedure, idServicio).subscribe(
        success => {
          this.toast.success('Servicio agregado correctamente', 'Operacion Exitosa');
          this.additionalServiceList();
        },
        err => {
          this.toast.error('El servicio ya se encuentra agregado', 'Operacion Fallida');
        }
      )
    } else {
      var idService = item.id;
      var idQuotation = this.tmpQuotation.id;
      this.serviceQuotation.addService(idService, idQuotation).subscribe(
        success => {
          this.toast.success("Añadido a la cotizacion", "Operacion Exitosa")
          this.ServiceList(this.tmpClientCar);
          this.ultimateQuotation(this.tmpClientCar);
        },
        err => {
          this.toast.error("El servicio ya existe en la cotizacion", "Operacion Fallida");
         
        }
      )
    }
  }

  /*LISTA DE SERVICIOS ADICIONAL DE LA COTIZACION*/
  async additionalServiceList() {
    await this.serviceProcedure.listAdditional(this.idProcedure).toPromise().then(
      success => {
        this.bodyResponseTwo = success;
      },
      err => {
        this.toast.error('Error al obteneter servicios adicionales', 'Operacion fallida')
      }
    )
  }

  /* FILTRO DE BUSQUEDA */
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    this.addServicios = this.tmpAddServicios.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.addServicios.offset = 0;
  }

  filterHistory(event) {
    const val = event.target.value.toLowerCase();
    
    this.bodyResponse = this.tmpBodyResponse.filter(function (d) {
      return d.numOrder.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.bodyResponse.offset = 0;
  }

  changeList() {
    if (this.textButton == 'SERVICIOS') {
      this.textButton = 'PRODUCTOS';
      this.flagList = true;
    } else {
      this.textButton = 'SERVICIOS'
      this.flagList = false;
    }
  }

  /* ----------------------- FIN LISTA SERVICIOS -----------------------
  ---------------------------------------------------------------------*/

  /* ----------------------- UTILIDADES -----------------------
  ---------------------------------------------------------------------*/

  /* BOTON PDF */
  generarPDF(name, indicador) {
    window.scrollTo(0, 0);
    html2canvas(document.getElementById(indicador)).then(canvas => {
      /* const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;

      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getWidth();pdf.internal.pageSize.getWidth();
      const imgHeight = canvas.height * width / canvas.width;
      let heightLeft = imgHeight;             
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);

      heightLeft -= height;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, width, height);
        heightLeft -= height;
      }
 */
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = 295;
      const imgHeight = pdf.internal.pageSize.getWidth();
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST')
        heightLeft -= pageHeight;
      }

      var f = new Date();
      var dia = f.getDate();
      var año = f.getFullYear();
      var mes = f.getUTCMonth();
      var fecha = (dia + '_' + (mes + 1) + '_' + año)
      if (indicador == "contenido") {
        if (this.flagSalida == true) {
          pdf.save('CheckOut_' + fecha + '_' + name + '.pdf');
        } else {
          pdf.save('CheckList_' + fecha + '_' + name + '.pdf');
        }
      } else if (indicador == "cotizacion") {
        pdf.save('Cotizacion_' + fecha + '_' + name + '.pdf');
      }
    });
  }

  /* ACTIVADOR DE TEMPLATES */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsModalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }

  /* OCULTAR TEMPLATE */
  doHide() {
    this.bsModalService.hide();
    this.message = false;
    this.source = '';
    this.flag = false;
    this.flagSalida = false;
    this.list(0, this.modelId);
  }

  /* CONSULTA ULTIMA COTIZACION */
  async ultimateQuotation(item) {
    await this.serviceQuotation.quotation(item.id).toPromise().then(
      success => {
        this.tmpQuotation = success;
        this.observationQuotation = this.tmpQuotation.observation;
        this.employer = this.tmpQuotation.idEmployer?.id;
        this.selectEmployer = this.tmpQuotation.idEmployer;
      },
      err => {
        
      }
    )
  }

  /* BOTON RECHAZAR */
  rechazar() {
    this.service.rejected(this.tmpClientCar.id).subscribe(
      success => {
        this.list(0, this.modelId);
        this.doHide();
        this.refresh();
      },
      err => {
      
      }
    )
  }

  /* BOTON PROCEDIMIENTO */
  navigate(item) {
    for (var i = 0; i < item.historyClientCars.length; i++) {
      if (i == (item.historyClientCars.length - 1)) {
        if (item.idStatus == 5) {
          this.router.navigate(['/procedure-list', { id: item.historyClientCars[i].id }]);
        } else if (item.idStatus == 6) {
          console.log("ENTRE AQUI")
          this.router.navigate(['/invoice-list', { id: item.historyClientCars[i].id }]);
        }
      }
    }
  }

  refresh(): void {
    window.location.reload();
  }

  lisEmployer() {
   
    this.listEmployer = new Array();
    var tmpList: any;
    this.serviceUser.list(null).subscribe(
      success => {
        tmpList = success;
        for (var i = 0; i < tmpList.content.length; i++) {
          for (var x = 0; x < tmpList.content[i].employer_role.length; x++) {
            if (tmpList.content[i].employer_role[x].role_id.id == 2) {
              this.listEmployer.push(tmpList.content[i])
            }
          }
        }

       
      },
      err => {

        this.toast.error('Error al obtener lista de empleados', 'Operacion fallida')
      }
    )
  }

  send(id, param_name) {
    this.sending = true;
    if (id == 1) {
      //Mail Ingreso
      window.scrollTo(0, 0);
      html2canvas(document.getElementById('contenido')).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = 295;
      const imgHeight = pdf.internal.pageSize.getWidth();
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST')
        heightLeft -= pageHeight;
      }

        var f = new Date();
        var dia = f.getDate();
        var año = f.getFullYear();
        var mes = f.getUTCMonth();
        var fecha = (dia + '_' + (mes + 1) + '_' + año)

        //pdf.save('CheckList_' + fecha + '_' + name + '.pdf');
        var name = 'CheckList_' + fecha + '_' + param_name + '.pdf'
        var pdfBase64 = pdf.output('datauristring');
        var affair = 'Ingreso AutoCentral'
        this.uploadFile(pdfBase64, name, affair);
      });
    } else if (id == 2) {
      //Mail Cotizacion
      window.scrollTo(0, 0);
      html2canvas(document.getElementById('cotizacion')).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = 295;
      const imgHeight = pdf.internal.pageSize.getWidth();
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST')
        heightLeft -= pageHeight;
      }

        var f = new Date();
        var dia = f.getDate();
        var año = f.getFullYear();
        var mes = f.getUTCMonth();
        var fecha = (dia + '_' + (mes + 1) + '_' + año)
        //pdf.save('Cotizacion_' + fecha + '_' + name + '.pdf');
        var name = 'Cotizacion_' + fecha + '_' + param_name + '.pdf'
        var pdfBase64 = pdf.output('datauristring');
        var affair = 'Cotizacion AutoCentral'
        this.uploadFile(pdfBase64, name, affair);
      });
    } else if (id == 3) {
      //Mail Salida
      window.scrollTo(0, 0)
      html2canvas(document.getElementById('contenido')).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = 295;
      const imgHeight = pdf.internal.pageSize.getWidth();
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST')
        heightLeft -= pageHeight;
      }

        var f = new Date();
        var dia = f.getDate();
        var año = f.getFullYear();
        var mes = f.getUTCMonth();
        var fecha = (dia + '_' + (mes + 1) + '_' + año)
        var name = 'ChecOut_' + fecha + '_' + param_name + '.pdf'
        var pdfBase64 = pdf.output('datauristring');
        var affair = 'Salida AutoCentral'
        this.uploadFile(pdfBase64, name, affair);
      });
    }

  }

  uploadFile(base64, name, affair) {
    const data = {
      emailTo: this.tmpClientCar.client.mail,
      affair: affair,
      content: base64,
      name: name
    }
  
    this.service.sendMail(data).subscribe(
      success => {
        this.toast.success("Archivo enviado correctamente", 'Operacion Exitosa')
        this.sending = false;
      },
      err => {
        this.toast.success("Archivo enviado correctamente", 'Operacion Exitosa')
        this.sending = false;
      }
    )
  }

  /* ----------------------- FIN UTILIDADES -----------------------
  ---------------------------------------------------------------------*/
}
