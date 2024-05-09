import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';


@Injectable({ providedIn: 'root' })
export class VehicleService {
    constructor(private http: HttpClient) { }


    create(data) {
        return this.http.post(`${environment.adminUrl}/car/`, data);
    }

    list(page, search) {
        //console.log("search"+search);
        return this.http.get(`${environment.adminUrl}/car/model/${search}`);
    }

    show(id) {
        return this.http.get(`${environment.adminUrl}/car/${id}?idCar=${id}`);
    }

    update(data) {
        return this.http.put(`${environment.adminUrl}/car/`, data);
    }

    delete(id) {
        return this.http.delete(`${environment.adminUrl}/car/${id}`);
    }
}