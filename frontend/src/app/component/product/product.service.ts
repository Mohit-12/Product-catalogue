import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Product } from '../../_models';
const HttpUploadOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
@Injectable({ providedIn: 'root' })
export class ProductService {
    
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    create(product: any) {
        return this.http.post(`${environment.apiUrl}/product/create`, product, HttpUploadOptions);
    }

    getAll() {
        return this.http.get<Product[]>(`${environment.apiUrl}/product`);
    }

    getById(id: string) {
        return this.http.get<Product>(`${environment.apiUrl}/product/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/product/${id}`, params, HttpUploadOptions);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/product/${id}`);
    }
}