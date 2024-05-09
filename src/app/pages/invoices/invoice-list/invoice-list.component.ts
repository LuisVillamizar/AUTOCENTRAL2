import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Crud } from 'src/app/core/helpers/Crud';
import { invoiceService } from 'src/app/core/services/invoice.service';
import { proceduresService } from 'src/app/core/services/procedures.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { ClientVehicleService } from 'src/app/core/services/client-vehicle.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent extends Crud implements OnInit {

  invoiceBody: any;
  modalRef: BsModalRef;
  bodyServicesQuotation: any;
  bodyServicesAdditional: any;
  observations: any;
  additionalPrice: number = 0;
  flagCliente : Boolean  = false; 
  loged : any;
  sending : Boolean;
  orden: any;

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(service: invoiceService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private bsModalService: BsModalService,
    private procedureService: proceduresService,
    private clientCarService: ClientVehicleService,
    private authenticationService: AuthenticationService) {
    super(service)
  }

  ngOnInit(): void {
    this.loged = JSON.parse(localStorage.getItem('currentUser'));
    let current: any = this.authenticationService.currentUserValue;
    if (current.employer_role == null) {
      this.flagCliente = true;
    } 
    this.modelId = this.route.snapshot.paramMap.get('id')
    this.listInvoice(this.modelId);
  }

  doHide() {
    this.bsModalService.hide();
  }

  listInvoice(id) {
    this.service.getInvoice(id).subscribe(
      success => {
        console.log(success)
        this.invoiceBody = success;
        this.observations = success.idProcedure.observation
        this.orden = success.idHistoryClientCar.numOrder;
        this.invoiceComplete();
      },
      err => {
        this.toast.error("No se encontro niguna factura", "Operacion Fallida");
      }
    )
  }

  invoiceComplete() {
    this.procedureQuotationList(this.invoiceBody.idProcedure.id);
    this.additionalServiceList(this.invoiceBody.idProcedure.id);
  }

  async procedureQuotationList(id) {
    await this.procedureService.listProcedureService(id).toPromise().then(
      success => {
        this.bodyServicesQuotation = success;
      },
      err => {
        this.toast.error('Error al consultar informacion', 'Operacion fallida');
      }
    )
  }

  async additionalServiceList(id) {
    await this.procedureService.listAdditional(id).toPromise().then(
      success => {
        this.bodyServicesAdditional = success;
        for (var i = 0; i < this.bodyServicesAdditional.length; i++) {
          this.additionalPrice = (this.additionalPrice + this.bodyServicesAdditional[i].priceFinal)
        }
      },
      err => {
        this.toast.error('Error al obteneter servicios adicionales', 'Operacion fallida')
      }
    )
  }


  detail(template) {
    this.openModal(template)
  }

  send(){
    this.sending = true;
    var license = this.invoiceBody.idHistoryClientCar.clientCar.licensePlate;
    window.scrollTo(0, 0)
    html2canvas(document.getElementById('factura')).then(canvas => {
      const img = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = 295;
      const imgHeight = pdf.internal.pageSize.getWidth();
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(img, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(img, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST')
        heightLeft -= pageHeight;
      }

      var f = new Date();
      var dia = f.getDate();
      var año = f.getFullYear();
      var mes = f.getUTCMonth();
      var fecha = (dia + '_' + (mes + 1) + '_' + año)
      //doc.save('FACTURA_' + fecha + '_' + license + '.pdf');
      var name = 'FACTURA_' + fecha + '_' + license + '.pdf'
      var pdfBase64 = pdf.output('datauristring');
      this.uploadFile(pdfBase64, name);
    });
  }

  uploadFile(base64, name) {
    const data = {
      emailTo: this.invoiceBody.idHistoryClientCar.clientCar.client.mail,
      affair: "Factura AutoCentral",
      content: base64,
      name: name
    }
    this.clientCarService.sendMail(data).subscribe(
      success =>{
        this.toast.success("Archivo enviado correctamente",'Operacion Exitosa')
        this.sending = false;
      },
      err=>{
        this.toast.success("Archivo enviado correctamente",'Operacion Exitosa')
        this.sending = false;
      }
    )
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsModalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }

  generarPDF() {
    var license = this.invoiceBody.idHistoryClientCar.clientCar.licensePlate;
    window.scrollTo(0, 0)
    html2canvas(document.getElementById('factura'), {
      useCORS: true
    }).then(function (canvas) {
      /* var img = canvas.toDataURL("image/png");
      var imgWidth = 210;
      var pageHeight = 300;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF('p', 'mm');
      var position = 0;

      doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      } */

      const img = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = 295;
      const imgHeight = pdf.internal.pageSize.getWidth();
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(img, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(img, 'PNG', 0, position, imgWidth, pageHeight, undefined, 'FAST')
        heightLeft -= pageHeight;
      }

      var f = new Date();
      var dia = f.getDate();
      var año = f.getFullYear();
      var mes = f.getUTCMonth();
      var fecha = (dia + '_' + (mes + 1) + '_' + año)
      pdf.save('FACTURA_' + fecha + '_' + license + '.pdf');
    });
  }

  changedState() {
    var state = this.invoiceBody.payment;
    if (!state) {
      Swal.fire({
        title: 'Esta seguro?',
        text: "Cambiara el estado de esta factura a 'PAGADA'",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        console.log("ENTRE");
        if (result.isConfirmed) {
          console.log("ENTRE 2");
          this.invoiceBody.payment = true;
          this.service.updateInovice(this.invoiceBody).subscribe(
            success =>{
                console.log("ENTRE 3");
                this.listInvoice(this.modelId);
                this.toast.success('Estado actualizado','Operacion exitosa');
                this.clientCarService.checkout(this.invoiceBody.idHistoryClientCar.clientCar.id).subscribe(
                  success =>{
                    
                  },
                  err=>{
                    console.log("ENTRE 4");
                    this.toast.error('Error al intentar crear el checkout','Operacion Fallida')
                  }
                )
            },
            err =>{
              console.log("ENTRE 5");
              this.toast.error('Error al intentar actualizar estado','Operacion Fallida');
            }
          )
        }
      })
    }

  }
}
