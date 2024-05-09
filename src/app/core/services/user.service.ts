import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/employer`);
    }

    create(data, idAdministrador, idTecnico) {
        return this.http.post(`${environment.apiUrl}/admin/employer/${idAdministrador}/${idTecnico}`, data);
    }

    list(page) {
        return this.http.get(`${environment.apiUrl}/admin/employer`);
    }

    show(id) {
        return this.http.get(`${environment.apiUrl}/admin/employer/${id}`);
    }

    update(id, data, idAdministrador, idTecnico) {
        console.log(data)
        return this.http.post(`${environment.apiUrl}/admin/employer/${id}/${idAdministrador}/${idTecnico}`, data);
    }

    delete(id) {
        return this.http.get(`${environment.apiUrl}/admin/employer/${id}/delete`);
    }
}