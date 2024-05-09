import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  elemnts = []

  constructor(
    private toastr: ToastrService,
    private generalService: GeneralService
  ) { }

  ngOnInit() {   
    /* this.getNotification(); 
    setInterval(() => {
      this.getNotification();
    }, 60000); */
  }

  getNotification(){
    this.generalService.allNotification()
    .toPromise().
    then((success: any) => {        
      for (let item of success) {
        this.createNotyfy(item);
      }
    }
    )
    .catch(error => {

    })
  }


  createNotyfy(data){
    this.toastr.show(data['text'], ".:Nueva Solicitud:.", {
      disableTimeOut: true,
      closeButton: true,
      tapToDismiss: false,
    }).onHidden
      .pipe(take(1))
      .subscribe(() => this.toasterClickedHandler(data));

  }

  toasterClickedHandler(data) {
    this.generalService.readNtofication(data['id'])
    .toPromise()
    .then(success => {

    })
    .catch(error => {
      this.toastr.error("Error al leer la notificación")
    })
  }

}
