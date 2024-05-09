import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class servicesService{
    constructor(private http: HttpClient) { }

    services(page="") {
        return this.http.get(`${environment.adminUrl}/services/list`);
    }

    show(id) {
        return this.http.get(`${environment.adminUrl}/services/${id}?idService=${id}`);
    }

    update(data){
        return this.http.put(`${environment.adminUrl}/services/`,data);
    }

    create(data){
        return this.http.post(`${environment.adminUrl}/services/`,data);
    }

    listActive(){
        return this.http.get(`${environment.adminUrl}/services/listActive`);
    }
}