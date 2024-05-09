import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";


@Injectable({ providedIn: 'root' })
export class questionService{
    constructor(private http: HttpClient) { }

    question(page="") {
        return this.http.get(`${environment.adminUrl}/question/list`);
    }

    show(id) {
        return this.http.get(`${environment.adminUrl}/question/${id}?idQuestion=${id}`);
    }

    update(data){
        return this.http.put(`${environment.adminUrl}/question/`,data);
    }

    create(data){
        return this.http.post(`${environment.adminUrl}/question/`,data);
    }
}