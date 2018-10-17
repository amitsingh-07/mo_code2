import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InvestmentAccountFormError } from '../investment-account/investment-account-form-error';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { InvestmentAccountFormData } from './investment-account-form-data';
import { INVESTMENT_ACCOUNT_CONFIG } from './investment-account.constant';
import { PersonalInfo } from './personal-info/personal-info';

const SESSION_STORAGE_KEY = 'app_inv_account_session';

@Injectable({
    providedIn: 'root'
})
export class InvestmentAccountService {
    callBackInvestmentAccount = false;
    disableAttributes = ['fullName'];
    myInfoAttributes = ['nationality', 'name', 'passportnumber', 'passportexpirydate',
    'dob', 'sex', 'regadd', 'mailadd', 'employment', 'occupation', 'householdincome'];

    private investmentAccountFormData: InvestmentAccountFormData = new InvestmentAccountFormData();
    private investmentAccountFormError: any = new InvestmentAccountFormError();

    constructor(private http: HttpClient, private apiService: ApiService, public authService: AuthenticationService) {
        this.getInvestmentAccountFormData();
        this.setDefaultValueForFormData();
    }

    commit() {
        if (window.sessionStorage) {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.investmentAccountFormData));
        }
    }

    // Return the entire Form Data
    getInvestmentAccountFormData() {
        if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
            this.investmentAccountFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
        }
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
        this.investmentAccountFormData.isEmployeAddresSame = INVESTMENT_ACCOUNT_CONFIG.employmentDetails.isEmployeAddresSame;
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
        this.commit();
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
    getIndustryList() {
        return this.apiService.getIndustryList();
    }
    getOccupationList() {
        return this.apiService.getOccupationList();
    }
    getAllDropDownList() {
        return this.apiService.getAllDropdownList();
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
    getPepInfo() {
        return {
            radioPep: this.investmentAccountFormData.radioPep,
            fName: this.investmentAccountFormData.fName,
            lName: this.investmentAccountFormData.lName,
            cName: this.investmentAccountFormData.cName,
            pepoccupation: this.investmentAccountFormData.pepoccupation,
            pepCountry: this.investmentAccountFormData.pepCountry,
            pepPostalCode: this.investmentAccountFormData.pepPostalCode,
            pepAddress1: this.investmentAccountFormData.pepAddress1,
            pepAddress2: this.investmentAccountFormData.pepAddress2,
            pepUnitNo: this.investmentAccountFormData.pepUnitNo
        };
    }
    getPepData() {
        const pepVal = this.investmentAccountFormData.pep;
        return pepVal;
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
        this.commit();
    }

    setNationality(nationalitylist: any, selectedNationality: any, unitedStatesResident: any, singaporeanResident: any) {
        this.investmentAccountFormData.nationalitylist = nationalitylist;
        this.investmentAccountFormData.nationality = selectedNationality;
        this.investmentAccountFormData.unitedStatesResident = unitedStatesResident;
        this.investmentAccountFormData.singaporeanResident = singaporeanResident;
        this.commit();
    }
    setPersonalInfo(data: PersonalInfo) {
        if (data.fullName) {
            this.investmentAccountFormData.fullName = data.fullName;
        }
        if (data.firstName) {
            this.investmentAccountFormData.firstName = data.firstName;
        }
        if (data.lastName) {
            this.investmentAccountFormData.lastName = data.lastName;
        }
        if (data.nricNumber) {
            this.investmentAccountFormData.nricNumber = data.nricNumber;
        }
        if (data.passportNumber) {
            this.investmentAccountFormData.passportNumber = data.passportNumber;
        }
        if (data.passportExpiry) {
            this.investmentAccountFormData.passportExpiry = data.passportExpiry;
        }
        if (data.dob) {
            this.investmentAccountFormData.dob = data.dob;
        }
        if (data.gender) {
            this.investmentAccountFormData.gender = data.gender;
        }
        this.commit();
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
    getEmployementDetails() {
        return {
            employmentStatus: this.investmentAccountFormData.employmentStatus,
            companyName: this.investmentAccountFormData.companyName,
            occupation: this.investmentAccountFormData.occupation,
            industry: this.investmentAccountFormData.industry,
            contactNumber: this.investmentAccountFormData.contactNumber,
            isEmployeAddresSame: this.investmentAccountFormData.isEmployeAddresSame,
            empCountry: this.investmentAccountFormData.empCountry,
            empPostalCode: this.investmentAccountFormData.empPostalCode,
            empAddress1: this.investmentAccountFormData.empAddress1,
            empAddress2: this.investmentAccountFormData.empAddress2,
            empUnitNo: this.investmentAccountFormData.empUnitNo,
            empCity: this.investmentAccountFormData.empCity,
            empState: this.investmentAccountFormData.empState,
            empZipCode: this.investmentAccountFormData.empZipCode,
        };
    }
    setEmployeAddressFormData(data) {
        if (data.employmentStatus !== 'Unemployed') {
            this.investmentAccountFormData.employmentStatus = data.employmentStatus;
            this.investmentAccountFormData.companyName = data.companyName;
            this.investmentAccountFormData.occupation = data.occupation;
            this.investmentAccountFormData.industry = data.industry;
            this.investmentAccountFormData.contactNumber = data.contactNumber;
            this.investmentAccountFormData.isEmployeAddresSame = data.isEmployeAddresSame;

            if (!data.isEmployeAddresSame) {
                this.investmentAccountFormData.empCountry = data.employeaddress.empCountry;
                this.investmentAccountFormData.empPostalCode = data.employeaddress.empPostalCode;
                this.investmentAccountFormData.empAddress1 = data.employeaddress.empAddress1;
                this.investmentAccountFormData.empAddress2 = data.employeaddress.empAddress2;
                this.investmentAccountFormData.empUnitNo = data.employeaddress.empUnitNo;
                this.investmentAccountFormData.empCity = data.employeaddress.empCity;
                this.investmentAccountFormData.empState = data.employeaddress.empState;
                this.investmentAccountFormData.empZipCode = data.employeaddress.empZipCode;
            }
        } else {
            this.investmentAccountFormData.employmentStatus = data.employmentStatus;
        }
        this.commit();
    }
    // Additional info pep data
    setAdditionalInfoFormData(data) {
        this.investmentAccountFormData.radioPep = data.radioPep;
        this.investmentAccountFormData.fName = data.fName;
        this.investmentAccountFormData.lName = data.lName;
        this.investmentAccountFormData.cName = data.cName;
        this.investmentAccountFormData.pepoccupation = data.pepoccupation;
        this.investmentAccountFormData.pepCountry = data.pepCountry;
        this.investmentAccountFormData.pepPostalCode = data.pepPostalCode;
        this.investmentAccountFormData.pepAddress1 = data.pepAddress1;
        this.investmentAccountFormData.pepAddress2 = data.pepAddress2;
        this.investmentAccountFormData.pepUnitNo = data.pepUnitNo;
        this.commit();
    }
    // Upload Document
  uploadDocument(formData) {
        return this.apiService.uploadDocument(formData);
    }
    setFinancialFormData(data) {
        this.investmentAccountFormData.annualHouseHoldIncomeRange = data.annualHouseHoldIncomeRange;
        this.investmentAccountFormData.numberOfHouseHoldMembers = data.numberOfHouseHoldMembers;
        this.investmentAccountFormData.monthlyIncome = data.monthlyIncome;
        this.investmentAccountFormData.percentageOfSaving = data.percentageOfSaving;
        this.investmentAccountFormData.totalAssets = data.totalAssets;
        this.investmentAccountFormData.totalLiabilities = data.totalLiabilities;
        this.commit();
    }
    getFinancialFormData() {
        return {
            annualHouseHoldIncomeRange: this.investmentAccountFormData.annualHouseHoldIncomeRange,
            numberOfHouseHoldMembers: this.investmentAccountFormData.numberOfHouseHoldMembers,
            monthlyIncome: this.investmentAccountFormData.monthlyIncome,
            percentageOfSaving: this.investmentAccountFormData.percentageOfSaving,
            totalAssets: this.investmentAccountFormData.totalAssets,
            totalLiabilities: this.investmentAccountFormData.totalLiabilities
        };
    }

    setFormData(data) {
        this.investmentAccountFormData.isMyInfoEnabled = true;
        this.investmentAccountFormData.fullName = data.name.value;
        if (data.nationality.value) {
            this.investmentAccountFormData.nationality = data.nationality.value;
            this.disableAttributes.push('nationality');
        }
        this.setMyInfoPersonal(data);
        this.setMyInfoResidentialAddress(data);

        // Employer name
        if (data.employment.value) {
            this.investmentAccountFormData.companyName = data.employment.value;
            this.disableAttributes.push('companyName');
        }

        // Occupation
        if (data.occupation.desc) {
            this.investmentAccountFormData.occupation = data.occupation.desc;
            this.disableAttributes.push('occupation');
        }

        // Annual Household Income

        this.investmentAccountFormData.disableAttributes = this.disableAttributes;
        this.commit();
    }

    // MyInfo - Personal data
    setMyInfoPersonal(data) {
        if (data.uinfin) {
            this.investmentAccountFormData.nricNumber = data.uinfin;
            this.disableAttributes.push('nricNumber');
        }
        if (data.passportnumber && data.passportnumber.value) {
            this.investmentAccountFormData.passportNumber = data.passportnumber.value;
            this.disableAttributes.push('passportNumber');
        }
        if (data.passportexpirydate && data.passportexpirydate.value) {
            this.investmentAccountFormData.passportExpiry = this.dateFormat(data.passportexpirydate.value);
            this.disableAttributes.push('passportExpiry');
        }
        if (data.dob.value) {
            this.investmentAccountFormData.dob = this.dateFormat(data.dob.value);
            this.disableAttributes.push('dob');
        }
        let sex = '';
        if (data.sex.value === 'M') {
            sex = 'male';
        } else if (data.sex.value === 'F') {
            sex = 'female';
        }
        if (sex) {
            this.investmentAccountFormData.gender = sex;
            this.disableAttributes.push('gender');
        }
    }

    // MyInfo - Residential Address
    setMyInfoResidentialAddress(data) {
        // Register address
        if (data.regadd.country) {
            this.investmentAccountFormData.country = data.regadd.country;
            this.disableAttributes.push('country');
        }
        let regUnitNumber = '# ';
        if (data.regadd.floor) {
            regUnitNumber = regUnitNumber + data.regadd.floor + ' - ';
        }
        if (data.regadd.unit) {
            regUnitNumber = regUnitNumber + data.regadd.unit;
        }
        if (regUnitNumber) {
            this.investmentAccountFormData.unitNo = regUnitNumber;
            this.disableAttributes.push('unitNo');
        }
        if (data.regadd.block) {
            this.investmentAccountFormData.address1 = 'Block ' + data.regadd.block;
            this.disableAttributes.push('address1');
        }
        if (data.regadd.street) {
            this.investmentAccountFormData.address2 = data.regadd.street;
            this.disableAttributes.push('address2');
        }
        if (data.regadd.postal) {
            this.investmentAccountFormData.zipCode = data.regadd.postal;
            this.disableAttributes.push('zipCode');
        }

        // Email address
        if (data.mailadd.country) {
            this.investmentAccountFormData.mailCountry = data.mailadd.country;
            this.disableAttributes.push('mailCountry');
        }
        let mailUnitNumber = '# ';
        if (data.mailadd.floor) {
            mailUnitNumber = mailUnitNumber + data.mailadd.floor + ' - ';
        }
        if (data.mailadd.unit) {
            mailUnitNumber = mailUnitNumber + data.mailadd.unit;
        }
        if (mailUnitNumber) {
            this.investmentAccountFormData.mailUnitNo = mailUnitNumber;
            this.disableAttributes.push('mailUnitNo');
        }
        if (data.mailadd.block) {
            this.investmentAccountFormData.mailAddress1 = 'Block ' + data.mailadd.block;
            this.disableAttributes.push('mailAddress1');
        }
        if (data.mailadd.street) {
            this.investmentAccountFormData.mailAddress2 = data.mailadd.street;
            this.disableAttributes.push('mailAddress2');
        }
        if (data.mailadd.postal) {
            this.investmentAccountFormData.mailZipCode = data.mailadd.postal;
            this.disableAttributes.push('mailZipCode');
        }
    }

    dateFormat(date: string) {
        const dateArr: any = date.split('-');
        return {year: Number(dateArr[0]), month: Number(dateArr[1]), day: Number(dateArr[2])};
    }

    isDisabled(fieldName): boolean {
        let disable: boolean;
        if (this.investmentAccountFormData.isMyInfoEnabled) {
          if (this.investmentAccountFormData.disableAttributes.includes(fieldName)) {
            disable = true;
          } else {
            disable = false;
          }
        } else {
          if (['firstName', 'lastName'].includes(fieldName)) {
            disable = true;
          } else {
            disable = false;
          }
        }
        return disable;
    }
}
