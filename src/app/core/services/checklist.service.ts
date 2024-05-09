import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class checklistService {
    constructor(private http: HttpClient) { }

    getOne(id){
        return this.http.get(`${environment.adminUrl}/checklist/${id}/one`);
    }

    save(data){
        return this.http.put(`${environment.adminUrl}/checklist/`,data);
    }
}