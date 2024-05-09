import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class quotationService{
    constructor(private http: HttpClient) { }

    new(id){
        return this.http.get(`${environment.adminUrl}/quotation/${id}/new`);
    }

    list(id){
        return this.http.get(`${environment.adminUrl}/quotationService/list/${id}`);
    }

    addService(idService, idQuotation){
        return this.http.get(`${environment.adminUrl}/quotationService/list/${idService}/${idQuotation}`);
    }

    quotation(id){
        return this.http.get(`${environment.adminUrl}/quotation/${id}/quotation`);
    }

    deleteItem(id){
        return this.http.delete(`${environment.adminUrl}/quotationService/${id}`);
    }

    updateValue(data){
        return this.http.put(`${environment.adminUrl}/quotationService/`,data);
    }

    ultimeQuotation(id){
        return this.http.get(`${environment.adminUrl}/quotation/ultimate/${id}`);
    }

    update(data){
        return this.http.put(`${environment.adminUrl}/quotation/`,data);
    }
}