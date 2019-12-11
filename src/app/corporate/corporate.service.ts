import { Injectable } from '@angular/core';

import { ApiService } from './../../app/shared/http/api.service';

@Injectable({
    providedIn: 'root'
})
export class CorporateService {
    constructor(private apiService: ApiService) { }

    saveEnquiryForm(data: any) {
        return this.apiService.saveEnquiryForm(data);
    }
}
