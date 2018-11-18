import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { IGender, IMaritalStatus, IRelationship, IWill, IwillProfile, IWillProfileMembers } from './will-writing-types';
import { WILL_WRITING_CONFIG } from './will-writing.constants';
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
}
