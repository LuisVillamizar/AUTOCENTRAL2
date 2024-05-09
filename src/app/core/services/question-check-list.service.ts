import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class questionCheckListService {
    constructor(private http: HttpClient) { }

    create(data) {
        return this.http.put(`${environment.adminUrl}/questioncl/`, data);
    }
}