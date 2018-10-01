import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InvestmentAccountFormError } from '../investment-account/investment-account-form-error';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { InvestmentAccountFormData } from './investment-account-form-data';
import { INVESTMENT_ACCOUNT_CONFIG } from './investment-account.constant';
import { PersonalInfo } from './personal-info/personal-info';

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
        const countries = this.investmentAccountFormData.nationalitylist;
        return countries;
    }
    isUserNationalitySingapore() {
        const selectedCountry = this.investmentAccountFormData.nationality.country.toUpperCase();
        return selectedCountry === 'SINGAPORE';
    }
    setDefaultValueForFormData() {
        this.investmentAccountFormData.isMailingAddressSame = INVESTMENT_ACCOUNT_CONFIG.residential_info.isMailingAddressSame;
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
    setTaxInfoFormData(data) {
        this.investmentAccountFormData.Taxcountry = data.Taxcountry;
        this.investmentAccountFormData.haveTin = data.radioTin;
        this.investmentAccountFormData.Tin = data.tinNumber;
        this.investmentAccountFormData.noTinReason = data.noTinReason;
    }
    // tslint:disable-next-line
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
                            // tslint:disable-next-line
                            errors.errorMessages.push(this.investmentAccountFormError.formFieldErrors[nestedControlName][Object.keys(nestedControls[nestedControlName]['errors'])[0]].errorMessage);
                        }
                    }
                } else { // NO NESTED CONTROLS
                    // tslint:disable-next-line
                    errors.errorMessages.push(this.investmentAccountFormError.formFieldErrors[name][Object.keys(controls[name]['errors'])[0]].errorMessage);
                }
            }
        }
        return errors;
    }

    getAddressUsingPostalCode(data) {
        return this.apiService.getAddressUsingPostalCode(data);
    }

    getNationalityList() {
        return this.apiService.getNationalityList();
    }
    getSourceList() {
        return this.apiService.getSourceofIncomeList();
    }
    getNoTinReasonList() {
        return this.apiService.getNoTinReasonList();
    }
    getNationality() {
        return {
            nationalitylist: this.investmentAccountFormData.nationalitylist,
            nationality: this.investmentAccountFormData.nationality,
            unitedStatesResident: this.investmentAccountFormData.unitedStatesResident,
            singaporeanResident: this.investmentAccountFormData.singaporeanResident
        };
    }

    getTaxInfo() {
        return {
            Tin: this.investmentAccountFormData.Tin,
            country: this.investmentAccountFormData.Taxcountry,
            haveTin: this.investmentAccountFormData.haveTin,
            noTinReason: this.investmentAccountFormData.noTinReason
        };
    }
    getPersonalDeclaration() {
        return {
            sourceOfIncome: this.investmentAccountFormData.sourceOfIncome,
            ExistingEmploye: this.investmentAccountFormData.ExistingEmploye,
            pep: this.investmentAccountFormData.pep,
            beneficial: this.investmentAccountFormData.beneficial
        };
    }
    setPersonalDeclarationData(data) {
        this.investmentAccountFormData.sourceOfIncome = data.sourceOfIncome;
        this.investmentAccountFormData.ExistingEmploye = data.radioEmploye;
        this.investmentAccountFormData.pep = data.radioPEP;
        this.investmentAccountFormData.beneficial = data.radioBeneficial;
    }

    setNationality(nationalitylist: any, selectedNationality: any, unitedStatesResident: any, singaporeanResident: any) {
        this.investmentAccountFormData.nationalitylist = nationalitylist;
        this.investmentAccountFormData.nationality = selectedNationality;
        this.investmentAccountFormData.unitedStatesResident = unitedStatesResident;
        this.investmentAccountFormData.singaporeanResident = singaporeanResident;
    }
    setPersonalInfo(data: PersonalInfo) {
        this.investmentAccountFormData.fullName = data.fullName;
        this.investmentAccountFormData.firstName = data.firstName;
        this.investmentAccountFormData.lastName = data.lastName;
        this.investmentAccountFormData.nricNumber = data.nricNumber;
        this.investmentAccountFormData.passportNumber = data.passportNumber;
        this.investmentAccountFormData.passportExpiry = data.passportExpiry;
        this.investmentAccountFormData.dob = data.dob;
        this.investmentAccountFormData.gender = data.gender;
    }
    getPersonalInfo() {
        return {
            fullName: this.investmentAccountFormData.fullName,
            firstName: this.investmentAccountFormData.firstName,
            lastName: this.investmentAccountFormData.lastName,
            nricNumber: this.investmentAccountFormData.nricNumber,
            passportNumber: this.investmentAccountFormData.passportNumber,
            passportExpiry: this.investmentAccountFormData.passportExpiry,
            dob: this.investmentAccountFormData.dob,
            gender: this.investmentAccountFormData.gender
        };
    }

    // Upload Document
    uploadDocument(formData) {
        return this.apiService.uploadDocument(formData);
    }
}
