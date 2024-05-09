import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class invoiceService{
    constructor(private http: HttpClient) { }

    getInvoice(id){
        return this.http.get(`${environment.adminUrl}/invoice/${id}`);
    }

    updateInovice(data){
        console.log("LA INFO DE LA FACTURA" + data);
        return this.http.put(`${environment.adminUrl}/invoice/`,data);
    }
}