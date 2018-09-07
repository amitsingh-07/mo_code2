import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { IProductCategory } from './product-info/product-category/product-category';

@Injectable({
    providedIn: 'root'
})
export class DirectApiService {
    constructor(
        private http: HttpClient, private apiService: ApiService,
        private authService: AuthenticationService,
        ) {
    }

    getProdCategoryList() {
        return this.apiService.getProductCategory();
    }

    sendDirectRequest(data) {
        return this.apiService.getDirectSearch(data);
    }
}
