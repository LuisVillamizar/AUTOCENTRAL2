import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Crud } from 'src/app/core/helpers/Crud';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { proceduresService } from 'src/app/core/services/procedures.service';
import { servicesService } from 'src/app/core/services/services.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.css']
})
export class ProcedureListComponent extends Crud implements OnInit {


  public modalRef: BsModalRef;
  procedureList: any;
  bodyResponse: any;
  estado: Boolean = true;
  listEmployer: any[];
  flagEmployer: boolean;
  employer: any;
  observations: any;
  flagEndProccess: Boolean = false;
  addServicios: any;
  tmpAddServicios: any;
  bodyResponseTwo: any;
  listComplete: any;
  flagCliente: Boolean;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(service: proceduresService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private bsModalService: BsModalService,
    private serviceUser: UserService,
    private serviceService: servicesService,
    private router: Router) {
    super(service)
  }

  async ngOnInit() {
    this.modelId = this.route.snapshot.paramMap.get('id')
    await this.procedureById();
    this.lisEmployer();
    let current: any = this.authenticationService.currentUserValue;
    if (current.employer_role == null) {
      this.flagCliente = true;
    } 
  }

  async procedureById() {
    if (this.modelId) {
      await this.service.listProcedure(this.modelId).toPromise().then(
        success => {
          this.procedureList = success;
          this.estado = this.procedureList.status
          this.observations = this.procedureList.observation;
          if (this.procedureList.idEmployerProcedure != null) {
            this.flagEmployer = true;
          }
        },
        err => {
          this.toast.error('Error al consultar datos', 'Operacion fallida');
        }
      )
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsModalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }

  async openProcedure(template: TemplateRef<any>) {
    if (this.procedureList.idEmployerProcedure == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Antes de inicar asigne un empleado'
      })
    } else {
      this.openModal(template);
      await this.procedureQuotationList();
      await this.additionalServiceList();
      this.changeFlag();
    }
  }

  async procedureQuotationList() {
    await this.service.listProcedureService(this.procedureList.id).toPromise().then(
      success => {
        this.bodyResponse = success;
        console.log(this.bodyResponse)
      },
      err => {
        this.toast.error('Error al consultar informacion', 'Operacion fallida');
      }
    )
  }

  async additionalServiceList() {
    await this.service.listAdditional(this.procedureList.id).toPromise().then(
      success => {
        this.bodyResponseTwo = success;

      },
      err => {
        this.toast.error('Error al obteneter servicios adicionales', 'Operacion fallida')
      }
    )
  }

  changeFlag() {
    for (var i = 0; i < this.bodyResponse.length; i++) {
      if (!this.bodyResponse[i].state) {
        this.flagEndProccess = false;
        break;
      } else {
        this.flagEndProccess = true;
      }
    }

    if (this.bodyResponseTwo != null) {
      for (var i = 0; i < this.bodyResponseTwo.length; i++) {
        if (!this.bodyResponseTwo[i].state) {
          this.flagEndProccess = false;
          break;
        } else {
          this.flagEndProccess = true;
        }
      }
    }
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

  saveEmployer() {
    this.serviceUser.show(this.employer).subscribe(
      success => {
        this.procedureList.idEmployerProcedure = success;
      },
      err => {
        this.toast.error('Error al guardar empleado', 'Operacion fallida')
      }
    )

    if (this.employer == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Seleccione un empleado para continuar'
      })
    } else {
      Swal.fire({
        title: 'Esta seguro?',
        text: "Se asignara el empleado a este procedimiento",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.addEployer(this.procedureList).subscribe(
            success => {
              this.toast.success("Agregado Correctamente", "Operacion Exitosa");
              this.procedureById();
            },
            err => {
              this.toast.error("Error al agregar empleado", "Operacion Fallida");
            }
          )

        }
      })
    }
  }

  startProcedure(item,id){
    console.log(item)
    Swal.fire({
      title: 'Desea Iniciar ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Iniciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        item.start = true;
        if (id == 1) {
          this.service.saveServices(item).subscribe(
            success => {
              this.toast.success('Procedimiento Iniciado', 'Operacion Exitosa');
              this.procedureQuotationList();
            },
            err => {
              this.toast.error('Error al finalizar el procedimiento', 'Operacion Fallida');
            }
          )
        } else {
          this.service.saveServiceAdditional(item).subscribe(
            success => {
              this.toast.success('Procedimiento Iniciado', 'Operacion Exitosa');
              this.additionalServiceList();
            },
            err => {
              this.toast.error('Error al finalizar el procedimiento', 'Operacion Fallida');
            }
          )
        }

      }
    })
  }

  endProcedure(item, id) {
    Swal.fire({
      title: 'Esta Seguro?',
      text: "el procedimiento " + (id == 2 ? item.idService.name : item.idQuotationService.idService.name) + " quedara finalizado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, finalizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.observations != "") {
          this.saveObservation();
        }

        item.state = true;
        if (id == 1) {
          this.service.saveServices(item).subscribe(
            success => {
              this.toast.success('Finalizado', 'Operacion Exitosa');
              this.procedureQuotationList();
              this.changeFlag();
            },
            err => {
              this.toast.error('Error al finalizar el procedimiento', 'Operacion Fallida');
            }
          )
        } else {
          this.service.saveServiceAdditional(item).subscribe(
            success => {
              this.toast.success('Finalizado', 'Operacion Exitosa');
              this.additionalServiceList();
              this.changeFlag();
            },
            err => {
              this.toast.error('Error al finalizar el procedimiento', 'Operacion Fallida');
            }
          )
        }

      }
    })

  }

  saveObservation() {
    this.procedureList.observation = this.observations;

    this.service.addEployer(this.procedureList).subscribe(
      success => {
        this.procedureById();
      },
      err => {
        this.toast.error("Error al agregar empleado", "Operacion Fallida");
      }
    )
  }

  addServiceList(template: TemplateRef<any>) {
    this.openModal(template);
    this.serviceService.listActive().subscribe(
      success => {
        this.tmpAddServicios = success;
        this.addServicios = this.tmpAddServicios;
      },
      err => {
        console.log(err)
      }
    )
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    this.addServicios = this.tmpAddServicios.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.addServicios.offset = 0;
  }

  addNewValues(item) {
    var idProcedimiento = this.procedureList.id;
    var idServicio = item.id;
    console.log(idProcedimiento)
    console.log(idServicio)
    /* this.service.addServiceAdditional(idProcedimiento, idServicio).subscribe(
      success => {
        this.toast.success('Servicio agregado correctamente', 'Operacion Exitosa');
        this.additionalServiceList();
        this.changeFlag();
        
      },
      err => {
        this.toast.error('El servicio ya se encuentra agregado', 'Operacion Fallida');
      }
    ) */
  }

  doHide() {
    this.bsModalService.hide();
  }

  /* BOTON ACTUALIZAR VALOR */
  modifyValue(item) {
    this.service.saveServiceAdditional(item).subscribe(
      success => {
        this.toast.success("Valor actualizado exitosamente", "Operacion Exitosa")
        this.additionalServiceList();
        this.changeFlag();
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
        this.service.delAdditionalService(item.id).subscribe(
          success => {
            this.toast.success("Servicio eliminado exitosamente", "Operacion Exitosa")
            this.additionalServiceList();
            this.changeFlag();
          },
          err => {
            this.toast.error("Error al eliminar servicio", "Operacion Fallida")
          }
        )
      }
    })
  }

  endAll() {
    var idProcedure = this.procedureList.id;
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Este proceso finalizara y generara una nueva factura',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Continuar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.endProcedure(idProcedure).subscribe(
          success => {
            this.router.navigate(['/request-list', { id: this.procedureList.idHistoryClientCar.clientCar.client.id }]);
            this.doHide();
          },
          err => {
            this.toast.error("Error al tratar de finalizar", "Operacion Fallida")
          }
        )
      }
    })

  }

}
