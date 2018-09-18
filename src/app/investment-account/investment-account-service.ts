import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { InvestmentAccountFormData } from './investment-account-form-data';

@Injectable({
    providedIn: 'root'
})
export class InvestmentAccountService {

    private investmentAccountFormData: InvestmentAccountFormData = new InvestmentAccountFormData();

    constructor(private http: HttpClient, private apiService: ApiService, public authService: AuthenticationService) {
    }

    getInvestmentAccountFormData() {
        return this.investmentAccountFormData;
    }

    getCountriesFormData() {
        const countries = ['India', 'Singapore', 'Malaysia'];
        // const countries = this.investmentAccountFormData.countries;
        return countries;
    }

    isUserNationalitySingapore() {
        // return this.investmentAccountFormData.country === 'singapore';
        return true;
    }

}
