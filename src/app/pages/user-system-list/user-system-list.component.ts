import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-system-list',
  templateUrl: './user-system-list.component.html',
  styleUrls: []
})
export class UserSystemListComponent implements OnInit {

 
  loading = false;
  returnUrl: string;
  error = '';
  success = false;
  users:any;
  pageLinks= [];
  currentPage = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.list();

  }

  list(page = 0){
    this.currentPage = page
    this.userService.list(page).subscribe(response => {
      console.log(response)
      this.users = response['content'];
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


  onDelete(id){
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Se eliminara permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si,eliminar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.delete(id)
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
   
      }
    })
  }

  delete(id){
    this.userService.delete(id)
    .pipe(first())
    .subscribe(response => {

      this.success=true;
      this.loading=false;
      this.list();

    },
    error => {
      this.loading=false;
      this.error = "Error al crear el usuario";
    })
  }


}
