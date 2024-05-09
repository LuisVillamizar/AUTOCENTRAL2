import { first } from "rxjs/operators";
import Swal from 'sweetalert2'
import { FormGroup } from "@angular/forms";

export class Crud{
    submitted = false;
    modelForm: FormGroup;
    loading = false;
    error = '';
    success = false;
    pageLinks= [];
    currentPage = 0;
    service = null;
    model = null;
    modelId = null;   


    constructor(serveice){
        this.service = serveice;     
        
    }

  
    get f() { return this.modelForm.controls; }


    list(page = 0, search=""){
        this.currentPage = page
        this.service.list(page, search).subscribe(response => {
          this.model = response;
          this.creteLinks(response);
        });
    }

   

    creteLinks(response){
        this.pageLinks = [];
        const totalPages = response['totalPages']
        const totalElements = response['totalElements']
        const size = response['size']
        const last = response['last']
        const first = response['first']
        const numberOfElements = response['numberOfElements'];
        let numItem = 0;
        while (numItem < totalPages) {    
          this.pageLinks.push(numItem);    
          numItem = numItem+1;
        }
    }

    setModelData(response){
      
    }

    modelData(){
        if(this.modelId){
          this.service.show(this.modelId)
          .subscribe(
            response =>{
              this.model = response;
              this.setModelData(response);
              console.log(response)
            },
            error => {
              this.error="No se puede consultar la informacion"
            }
          )
        }
      }

      modelDataBrand(){
        if(this.modelId){
          this.service.showBrand(this.modelId)
          .subscribe(
            response =>{
              this.model = response;
              this.setModelData(response);
            },
            error => {
              this.error="No se puede consultar la informacion"
            }
          )
        }
      }

    onDelete(id, search = ""){
        Swal.fire({
          title: 'Esta seguro?',
          text: 'Se eliminara permanentemente',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si,eliminar',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            this.delete(id, search)
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
          } else if (result.dismiss === Swal.DismissReason.cancel) {
       
          }
        })
      }
    
      delete(id, search=""){
        this.service.delete(id)
        .subscribe(response => {
    
          this.success=true;
          this.loading=false;
          this.list(0, search);
    
        },
        error => {
          this.loading=false;
          this.error = "Error al eliminar";
        })
      }

}