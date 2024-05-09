import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class ClientVehicleService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/client/`);
    }

    create(data) {
        return this.http.post(`${environment.adminUrl}/clientCar/`, data);
    }

    list(page, search="") {
        return this.http.get(`${environment.adminUrl}/clientCar/client/${search}`);
    }

    show(id) {
        return this.http.get(`${environment.adminUrl}/client/${id}`);
    }

    delete(id) {
        return this.http.delete(`${environment.adminUrl}/clientCar/clientCar/${id}`);
    }

    historyForClientCar(id){
        return this.http.get(`${environment.adminUrl}/clientCar/historyClient/${id}/list`);
    }

    newIngreso(id){
        return this.http.get(`${environment.adminUrl}/clientCar/entry/${id}`);         
    }

    listaIngreso(id){
        return this.http.get(`${environment.adminUrl}/clientCar/lista/${id}`);
    }

    verifyHistory(id){
        return this.http.get(`${environment.adminUrl}/clientCar/verify/${id}`);
    }

    defineStatus(id){
        return this.http.get(`${environment.adminUrl}/clientCar/state/${id}`);
    }

    finalList(id){
        return this.http.get(`${environment.adminUrl}/clientCar/finalLista/${id}`);
    }

    rejected(id){
        return this.http.get(`${environment.adminUrl}/clientCar/rejected/${id}`);
    }

    checkout(id){
        return this.http.get(`${environment.adminUrl}/clientCar/checkOut/${id}`);
    }

    endProcess(id){
        return this.http.get(`${environment.adminUrl}/clientCar/end/${id}`);
    }

    sendMail(data){
        return this.http.post(`${environment.adminUrl}/clientCar/send`,data);
    }
}