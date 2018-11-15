import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { WillWritingService } from './will-writing.service';

@Injectable({
    providedIn: 'root'
})
export class WillWritingApiService {
    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private willWritingService: WillWritingService
    ) {
    }

    getProfileList() {
        return this.apiService.getProfileList();
    }

    verifyPromoCode(promoCodeData) {
        const promoCode = {
            promoCode: promoCodeData
        };
        return this.apiService.verifyPromoCode(promoCode);
    }

    createWillRequestPayload() {
    }

    createWill() {
        const payload = this.createWillRequestPayload();
    }

}
