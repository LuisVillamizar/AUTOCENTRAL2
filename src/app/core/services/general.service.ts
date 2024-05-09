import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeneralService {
    constructor(private http: HttpClient) { }

    countries(page = 0) {
        return this.http.get(`${environment.adminUrl}/country/`);
    }

    departament(page = 0) {
        return this.http.get(`${environment.adminUrl}/daneDepartament/`);
    }

    municipality(idDepartament = 3) {
        return this.http.get(`${environment.adminUrl}/daneMunicipality/${idDepartament}/`);
    }

    urlQr(idClientCar) {
        return this.http.get(`${environment.adminUrl}/clientCar/clientCar/generateCode/${idClientCar}/`);
    }

    statuses() {
        return this.http.get(`${environment.adminUrl}/state/all`);
    }

    dashboard(status) {
        return this.http.get(`${environment.adminUrl}/clientCar/${status}/dashboard`);
    }

    allNotification(read = false) {
        return this.http.get(`${environment.adminUrl}/notification/${read}`);
    }

    readNtofication(id) {
        return this.http.get(`${environment.adminUrl}/notification/read/${id}`);
    }

    listHistoryClient(idClient){
        return this.http.get(`${environment.adminUrl}/clientCar/historyClient/${idClient}`);
    }

}