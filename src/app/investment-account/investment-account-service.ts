import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { InvestmentAccountFormData } from './investment-account-form-data';
import { SelectNationality } from './select-nationality/select-nationality';
import { InvestmentAccountFormError } from '../investment-account/investment-account-form-error';

@Injectable({
    providedIn: 'root'
})
export class InvestmentAccountService {

    private investmentAccountFormData: InvestmentAccountFormData = new InvestmentAccountFormData();
    private investmentAccountFormError: any = new InvestmentAccountFormError();

    constructor(private http: HttpClient, private apiService: ApiService, public authService: AuthenticationService) {
        this.setDefaultValueForFormData();
    }

    getInvestmentAccountFormData() {
        return this.investmentAccountFormData;
    }

    /* Residential Address */
    getCountriesFormData() {
        const countries = ['India', 'Singapore', 'Malaysia'];
        // const countries = this.investmentAccountFormData.countries;
        return countries;
    }
    isUserNationalitySingapore() {
        // return this.investmentAccountFormData.country === 'singapore';
        return true;
    }
    setDefaultValueForFormData() {
        this.investmentAccountFormData.isMailingAddressSame = true;
    }
    setResidentialAddressFormData(data) {
        this.investmentAccountFormData.country = data.country;
        this.investmentAccountFormData.postalCode = data.postalCode;
        this.investmentAccountFormData.address1 = data.address1;
        this.investmentAccountFormData.address2 = data.address2;
        this.investmentAccountFormData.unitNo = data.unitNo;
        this.investmentAccountFormData.city = data.city;
        this.investmentAccountFormData.state = data.state;
        this.investmentAccountFormData.zipCode = data.zipCode;
        this.investmentAccountFormData.isMailingAddressSame = data.isMailingAddressSame;
        if (!data.isMailingAddressSame) {
            this.investmentAccountFormData.mailCountry = data.mailingAddress.mailCountry;
            this.investmentAccountFormData.mailPostalCode = data.mailingAddress.mailPostalCode;
            this.investmentAccountFormData.mailAddress1 = data.mailingAddress.mailAddress1;
            this.investmentAccountFormData.mailAddress2 = data.mailingAddress.mailAddress2;
            this.investmentAccountFormData.mailUnitNo = data.mailingAddress.mailUnitNo;
            this.investmentAccountFormData.mailCity = data.mailingAddress.mailCity;
            this.investmentAccountFormData.mailState = data.mailingAddress.mailState;
            this.investmentAccountFormData.mailZipCode = data.mailingAddress.mailZipCode;
        }
    }
    getNationalityList() {
        return this.apiService.getNationalityList();
    }
    getNationality() {
        return {
            nationality: this.investmentAccountFormData.nationality,
            countries: this.investmentAccountFormData.countries,
            selectNationalitySig: this.investmentAccountFormData.selectNationalitySig,
            otherCoutryQuestionOne: this.investmentAccountFormData.otherCoutryQuestionOne,
            otherCoutryQuestionTwo: this.investmentAccountFormData.otherCoutryQuestionTwo
        };
    }
    setNationality(data: SelectNationality) {
        this.investmentAccountFormData.nationality = data.nationality;
        this.investmentAccountFormData.countries = data.countries;
        this.investmentAccountFormData.selectNationalitySig = data.selectNationalitySig;
        this.investmentAccountFormData.otherCoutryQuestionOne = data.otherCoutryQuestionOne;
        this.investmentAccountFormData.otherCoutryQuestionTwo = data.otherCoutryQuestionTwo;
    }


    /**
     * get form errors.
     * @param form - form details.
     * @returns first error of the form.
     */
    getFormErrorList(form) {
        const controls = form.controls;
        const errors: any = {};
        errors.errorMessages = [];
        errors.title = this.investmentAccountFormError.formFieldErrors.errorTitle;
        for (const name in controls) {
            if (controls[name].invalid) {
                // HAS NESTED CONTROLS ?
                if (controls[name].controls) {
                    const nestedControls = controls[name].controls;
                    for (const nestedControlName in nestedControls) {
                        if (nestedControls[nestedControlName].invalid) {
                            errors.errorMessages.push(this.investmentAccountFormError.formFieldErrors[nestedControlName][Object.keys(nestedControls[nestedControlName]['errors'])[0]].errorMessage);
                        }
                    }
                } else { // NO NESTED CONTROLS
                    errors.errorMessages.push(this.investmentAccountFormError.formFieldErrors[name][Object.keys(controls[name]['errors'])[0]].errorMessage);
                }
            }
        }
        return errors;
    }

}
