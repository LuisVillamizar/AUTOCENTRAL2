import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    constructor(private http: HttpClient) { }

    list(page=0) {
        return this.http.get(`${environment.adminUrl}/typeDocument/`);
    }

}