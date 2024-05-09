import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class ClientService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/client/`);
    }

    create(data) {
        return this.http.post(`${environment.adminUrl}/client/`, data);
    }

    list(page) {
        return this.http.get(`${environment.adminUrl}/client/`);
    }

    show(id) {
        return this.http.get(`${environment.adminUrl}/client/${id}`);
    }

    update(data) {
        return this.http.put(`${environment.adminUrl}/client/`, data);
    }

    updatePss(id:number,password:string){
        return this.http.put(`${environment.adminUrl}/client/pss/`,{id,password});
    }

    updateEmployerPss(id:number,password:string){
        return this.http.put(`${environment.adminUrl}/admin/employer/pss/`,{id,password});
    }

    
}