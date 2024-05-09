import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';


@Injectable({ providedIn: 'root' })
export class ModelService {
    constructor(private http: HttpClient) { }


    brand(page="") {
        return this.http.get(`${environment.adminUrl}/brand/`);
    }

    create(data) {
        return this.http.post(`${environment.adminUrl}/model/`, data);
    }

    list(page, search) {
        return this.http.get(`${environment.adminUrl}/model/brand/${search}`);
    }

    show(id) {
        return this.http.get(`${environment.adminUrl}/model/${id}?idModel=${id}`);
    }

    update(data) {
        return this.http.put(`${environment.adminUrl}/model/`, data);
    }

    delete(id) {
        return this.http.delete(`${environment.adminUrl}/model/${id}`);
    }

    showBrand(id){
        return this.http.get(`${environment.adminUrl}/brand/${id}?idBrand=${id}`);
    }

    updateBrand(data){
        return this.http.put(`${environment.adminUrl}/brand/`,data);
    }

    createBrand(data){
        return this.http.post(`${environment.adminUrl}/brand/`,data);
    }
}