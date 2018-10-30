import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';

@Injectable({
    providedIn: 'root'
})
export class WillWritingApiService {
    constructor(
        private http: HttpClient, private apiService: ApiService) {
    }

    getProfileList() {
        return this.apiService.getProfileList();
    }

    getPromoCode() {
        return this.apiService.getPromoCode();
    }

    verifyPromoCode(promoCode) {
        return this.apiService.verifyPromoCode(promoCode);
    }

}
