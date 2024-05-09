import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class proceduresService{
    constructor(private http: HttpClient) { }

    listProcedure(id){
        return this.http.get(`${environment.adminUrl}/procedure/${id}/find`);
    }

    new(id){
        return this.http.get(`${environment.adminUrl}/procedure/${id}/new`);
    }

    listProcedureService(id){
        return this.http.get(`${environment.adminUrl}/procedure/${id}/list`);
    }

    addEployer(data){
        return this.http.put(`${environment.adminUrl}/procedure/`,data);
    }

    saveServices(data){
        return this.http.put(`${environment.adminUrl}/procedure/save`,data);
    }

    update(data){
        return this.http.put(`${environment.adminUrl}/procedure/up`,data);
    }

    listAdditional(id){
        return this.http.get(`${environment.adminUrl}/procedure/${id}/Additional`);
    }

    addServiceAdditional(idP, idS){
        return this.http.get(`${environment.adminUrl}/procedure/${idP}/${idS}/add`);
    }

    saveServiceAdditional(data){
        return this.http.put(`${environment.adminUrl}/procedure/saveAdd`,data);
    }

    delAdditionalService(id){
        return this.http.delete(`${environment.adminUrl}/procedure/${id}/del`);
    }

    endProcedure(id){
        return this.http.get(`${environment.adminUrl}/procedure/${id}/end`);
    }
}