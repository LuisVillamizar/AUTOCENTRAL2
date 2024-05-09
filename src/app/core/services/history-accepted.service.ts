import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class historyAcceptedService{
    constructor(private http: HttpClient) { }
    
    saveHistory(idClient,idEmployer,idHistoryClientCar){
        return this.http.get(`${environment.adminUrl}/history/${idClient}/${idEmployer}/${idHistoryClientCar}`);
    }
}