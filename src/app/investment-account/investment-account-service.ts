import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InvestmentAccountFormError } from '../investment-account/investment-account-form-error';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { InvestmentAccountFormData } from './investment-account-form-data';
import { INVESTMENT_ACCOUNT_CONFIG } from './investment-account.constant';
import {
    IAddress, ICreateInvestmentAccountRequest, IEmployment, IFinancial, IHousehold, IPep,
    IPersonalDeclaration, IPersonalInfo, ITax
} from './investment-account.request';
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
        const countries = this.investmentAccountFormData.countryList;
        return countries;
    }
    isSingaporeResident() {
        const selectedNationality = this.investmentAccountFormData.nationalityCode.toUpperCase();
        return (selectedNationality === INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE ||
            this.investmentAccountFormData.singaporeanResident);
    }
    getCountryFromNationalityCode(nationalityCode) {
        let country;
        const selectedNationality = this.investmentAccountFormData.nationalityList.filter(
            (nationality) => nationality.nationalityCode === nationalityCode);
        if (selectedNationality[0] && selectedNationality[0].countries[0]) {
            country = selectedNationality[0].countries[0];
        }
        return country;
    }
    getCountryFromCountryCode(countryCode) {
        let country = '';
        const selectedCountry = this.investmentAccountFormData.countryList.filter(
            (countries) => countries.countryCode === countryCode);
        if (selectedCountry[0]) {
            country = selectedCountry[0];
        }
        return country;
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
        this.investmentAccountFormData.floor = data.floor;
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
            this.investmentAccountFormData.mailFloor = data.mailingAddress.mailFloor;
            this.investmentAccountFormData.mailUnitNo = data.mailingAddress.mailUnitNo;
            this.investmentAccountFormData.mailCity = data.mailingAddress.mailCity;
            this.investmentAccountFormData.mailState = data.mailingAddress.mailState;
            this.investmentAccountFormData.mailZipCode = data.mailingAddress.mailZipCode;
        }
        this.commit();
    }
    setTaxInfoFormData(data) {
        this.investmentAccountFormData.taxCountry = data.taxCountry;
        this.investmentAccountFormData.radioTin = data.radioTin;
        if (data.tinNumberText) {
            this.investmentAccountFormData.tinNumber = data.tinNumberText.tinNumber;
        }
        if (data.reasonDropdown) {
            this.investmentAccountFormData.noTinReason = data.reasonDropdown.noTinReason;
        }
        this.commit();
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

    getNationalityCountryList() {
        return this.apiService.getNationalityCountryList();
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
    getGeneratedFrom() {
        return this.apiService.getGeneratedFrom();
    }
    getInvestmentPeriod() {
        return this.apiService.getInvestmentPeriod();
    }
    // getNationality() {
    //     return {
    //         nationalitylist: this.investmentAccountFormData.nationalityList,
    //         nationality: this.investmentAccountFormData.nationality,
    //         unitedStatesResident: this.investmentAccountFormData.unitedStatesResident,
    //         singaporeanResident: this.investmentAccountFormData.singaporeanResident
    //     };
    // }

    getTaxInfo() {
        return {
            tinNumber: this.investmentAccountFormData.tinNumber,
            taxCountry: this.investmentAccountFormData.taxCountry,
            radioTin: this.investmentAccountFormData.radioTin,
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
    getBOStatus() {
        const boVal = this.investmentAccountFormData.beneficial;
        return boVal;
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

    setNationality(nationalityList: any, countryList: any, nationality: any, unitedStatesResident: any, singaporeanResident: any) {
        this.investmentAccountFormData.nationalityList = nationalityList;
        this.investmentAccountFormData.countryList = countryList;
        this.investmentAccountFormData.nationalityCode = nationality.nationalityCode;
        this.investmentAccountFormData.nationality = nationality;
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
    uploadDocumentBO(formData) {
        return this.apiService.uploadDocumentBO(formData);
    }
    setFinancialFormData(data) {
        this.investmentAccountFormData.annualHouseHoldIncomeRange = data.annualHouseHoldIncomeRange;
        this.investmentAccountFormData.numberOfHouseHoldMembers = data.numberOfHouseHoldMembers;
        this.investmentAccountFormData.financialMonthlyIncome = data.financialMonthlyIncome;
        this.investmentAccountFormData.financialPercentageOfSaving = data.financialPercentageOfSaving;
        this.investmentAccountFormData.financialTotalAssets = data.financialTotalAssets;
        this.investmentAccountFormData.financialTotalLiabilities = data.financialTotalLiabilities;
        this.commit();
    }
    getFinancialFormData() {
        return {
            annualHouseHoldIncomeRange: this.investmentAccountFormData.annualHouseHoldIncomeRange,
            numberOfHouseHoldMembers: this.investmentAccountFormData.numberOfHouseHoldMembers,
            financialMonthlyIncome: this.investmentAccountFormData.financialMonthlyIncome,
            financialPercentageOfSaving: this.investmentAccountFormData.financialPercentageOfSaving,
            financialTotalAssets: this.investmentAccountFormData.financialTotalAssets,
            financialTotalLiabilities: this.investmentAccountFormData.financialTotalLiabilities
        };
    }

    setFormData(data) {
        this.investmentAccountFormData.fullName = data.name.value;
        if (data.nationality.value) {
            this.investmentAccountFormData.nationalityCode = data.nationality.value;
            this.disableAttributes.push('nationality');
        }
        this.setMyInfoPersonal(data);
        this.setMyInfoResidentialAddress(data);

        // Employer name
        if (data.employment && data.employment.value) {
            this.investmentAccountFormData.companyName = data.employment.value;
            this.disableAttributes.push('companyName');
        }

        // Occupation
        if (data.occupation && data.occupation.desc) {
            this.investmentAccountFormData.occupation = data.occupation.desc;
            this.disableAttributes.push('occupation');
        }

        // Monthly Household Income
        if (data.householdincome) {
            let highAmount: any = '';
            if (data.householdincome.low && data.householdincome.high) {
                if (data.householdincome.high === 'above') {
                    highAmount = ' and ' + data.householdincome.high;
                } else {
                    highAmount = ' to $' + data.householdincome.high;
                }
                this.investmentAccountFormData.annualHouseHoldIncomeRange = '$' + data.householdincome.low + highAmount;
                this.disableAttributes.push('annualHouseHoldIncomeRange');
            }
        }
        this.investmentAccountFormData.disableAttributes = this.disableAttributes;
        this.investmentAccountFormData.isMyInfoEnabled = true;
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
        if (data.sex.value === 'M') {
            this.investmentAccountFormData.gender = 'male';
            this.disableAttributes.push('gender');
        } else if (data.sex.value === 'F') {
            this.investmentAccountFormData.gender = 'female';
            this.disableAttributes.push('gender');
        }
    }

    // MyInfo - Residential Address
    setMyInfoResidentialAddress(data) {
        // Register address
        if (data.regadd) {
            if (data.regadd.country) {
                this.investmentAccountFormData.countryCode = data.regadd.country;
                this.disableAttributes.push('country');
            }
            if (data.regadd.floor) {
                this.investmentAccountFormData.floor = data.regadd.floor;
                this.disableAttributes.push('floor');
            }
            if (data.regadd.unit) {
                this.investmentAccountFormData.unitNo = data.regadd.unit;
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
        }
        // Email address
        if (data.mailadd) {
            this.setMyInfoEmailAddress(data);
        }
    }

    // MyInfo - Email Address
    setMyInfoEmailAddress(data) {
        if (data.mailadd.country) {
            this.investmentAccountFormData.mailCountryCode = data.mailadd.country;
            this.disableAttributes.push('mailCountry');
        }
        if (data.mailadd.floor) {
            this.investmentAccountFormData.mailFloor = data.mailadd.floor;
            this.disableAttributes.push('mailFloor');
        }
        if (data.mailadd.unit) {
            this.investmentAccountFormData.mailUnitNo = data.mailadd.unit;
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
        return { year: Number(dateArr[0]), month: Number(dateArr[1]), day: Number(dateArr[2]) };
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

    isSingPassDisabled() {
        return this.investmentAccountFormData.isMyInfoEnabled;
    }

    getAdditionDeclaration() {
        return {
            source: this.investmentAccountFormData.source,
            expectedNumberOfTransation: this.investmentAccountFormData.expectedNumberOfTransation,
            expectedAmountPerTranction: this.investmentAccountFormData.expectedAmountPerTranction,
            personalSavings: this.investmentAccountFormData.personalSavings,

            inheritanceGift: this.investmentAccountFormData.inheritanceGift,
            investmenteEarning: this.investmentAccountFormData.investmenteEarning,
            investmentPeriod: this.investmentAccountFormData.investmentPeriod,
            earningsGenerated: this.investmentAccountFormData.earningsGenerated,

        };
    }
    setAdditionDeclaration(data) {

        this.investmentAccountFormData.expectedNumberOfTransation = data.expectedNumberOfTransation;
        this.investmentAccountFormData.expectedAmountPerTranction = data.expectedAmountPerTranction;
        this.investmentAccountFormData.source = data.source;
        if (data.personalSavingForm) {
            this.investmentAccountFormData.personalSavings = data.personalSavingForm.personalSavings;
        }
        if (data.inheritanceGiftFrom) {
            this.investmentAccountFormData.inheritanceGift = data.inheritanceGiftFrom.inheritanceGift;
        }
        if (data.investmentEarnings) {
            this.investmentAccountFormData.investmentPeriod = data.investmentEarnings.investmentPeriod;
            this.investmentAccountFormData.earningsGenerated = data.investmentEarnings.earningsGenerated;
        }
        this.commit();
    }

    getPortfolioAllocationDetails(params) {
        const urlParams = this.constructQueryParams(params);
        return this.apiService.getPortfolioAllocationDetails(urlParams);
    }

    updateInvestment(params) {
        return this.apiService.updateInvestment(params);
    }

    createInvestmentAccount() {
        const payload = this.constructInvestmentAccountRequest();
        return this.apiService.createInvestmentAccount(payload);
    }

    constructInvestmentAccountRequest() {
        const formdata = this.getInvestmentAccountFormData();
        const request = {} as ICreateInvestmentAccountRequest;
        request.myInfoVerified = formdata.isMyInfoEnabled;
        request.isSingaporePR = formdata.singaporeanResident;
        request.personalInfo = this.getPersonalInfoReqData(formdata);
        request.residentialAddress = this.getResidentialAddressReqData(formdata);
        request.mailingAddress = this.getMailingAddressReqData(formdata);
        request.employmentDetails = this.getEmployementDetailsReqData(formdata);
        request.householdDetails = this.getHouseholdDetailsReqData(formdata);
        request.financialDetails = this.getFinancialDetailsReqData(formdata);
        request.taxDetails = this.getTaxDetailsReqData(formdata);
        request.personalDeclarations = this.getPersonalDecReqData(formdata);
        return request;
    }

    getPersonalInfoReqData(data): IPersonalInfo {
        return  {
            nationalityCode: data.nationalityCode,
            fullName: data.fullName,
            firstName: data.firstName,
            lastName: data.lastName,
            nricNumber: data.nricNumber,
            passportNumber: data.passportNumber,
            passportExpiryDate: this.convertDate(data.passportExpiry),
            passportIssuedCountryId: 1,
            dateOfBirth: this.convertDate(data.dob),
            gender: data.gender
        };
    }

    getResidentialAddressReqData(data): IAddress {
        return {
            countryId: (data.country) ? data.country.id : '',
            state: data.state,
            postalCode: (this.isSingaporeResident) ? data.postalCode : data.zipCode,
            addressLine1: data.address1,
            addressLine2: data.address2,
            unitNumber: data.unitNo,
            townName: 'Residential Town Name', // todo - not available in client
            city: data.city
        };
    }

    getMailingAddressReqData(data): IAddress {
        return {
            countryId: (data.mailCountry) ? data.mailCountry.id : '',
            state: data.mailState,
            postalCode: (this.isSingaporeResident) ? data.mailPostalCode : data.mailZipCode,
            addressLine1: data.mailAddress1,
            addressLine2: data.mailAddress2,
            unitNumber: data.unitNo,
            townName: 'Mailing Town Name2', // todo - not available in client
            city: data.mailCity
        };
    }

    getEmployementDetailsReqData(data): IEmployment {
        return {
            employmentStatusId: 1, // todo - need to work on employment details
            industryId: (data.industry) ? data.industry.id : '',
            occupationId: (data.occupation) ? data.occupation.id : '',
            employerName: data.companyName,
            contactNumber: data.contactNumber,
            unemployedReason: 'No Reason', // todo not available in client
            employerAddress: {
                countryId: (data.empCountry) ? data.empCountry.id : '',
                state: data.empState,
                postalCode: (this.isSingaporeResident) ? data.empPostalCode : data.empZipCode,
                addressLine1: data.empAddress1,
                addressLine2: data.empAddress2,
                unitNumber: data.empUnitNo,
                townName: 'Employer Town Name', // todo not available in client
                city: data.empCity
            }
        };
    }

    getHouseholdDetailsReqData(data): IHousehold {
        return {
            numberOfMembers: data.numberOfHouseHoldMembers,
            houseHoldIncome: data.annualHouseHoldIncomeRange
        };
    }

    getFinancialDetailsReqData(data): IFinancial {
        return {
            annualIncome: data.financialMonthlyIncome,
            percentageOfSaving: data.financialPercentageOfSaving,
            totalAssets: data.financialTotalAssets,
            totalLoans: data.financialTotalLiabilities
        };
    }

    getTaxDetailsReqData(data): ITax {
        return {
            taxCountryId: (data.taxCountry) ? data.taxCountry.id : '',
            tinNumber: (data.tinNumberText) ? data.tinNumberText.tinNumber : '',
            noTinReason: (data.reasonDropdown) ? data.reasonDropdown.noTinReason.id : ''
        };
    }

    getPersonalDecReqData(data): IPersonalDeclaration {
        return {
            investmentSourceId: (data.sourceOfIncome) ? data.sourceOfIncome.id : '',
            beneficialOwner: data.radioBeneficial,
            politicallyExposed: data.radioPEP,
            connectedToInvestmentFirm: data.radioEmploye,
            pepDeclaration: {
                firstName: data.fName,
                lastName: data.lName,
                companyName: data.cName,
                occupationId: (data.pepoccupation) ? data.pepoccupation.id : '',
                pepAddress: {
                    countryId: (data.pepCountry) ? data.pepCountry.id : '',
                    state: '', // info - always empty
                    postalCode: data.pepPostalCode,
                    addressLine1: data.pepAddress1,
                    addressLine2: data.pepAddress2,
                    unitNumber: data.pepUnitNo,
                    townName: 'TOWN NAME', // todo not available in client
                    city: '' // info - always empty
                },
                expectedNumberOfTransactions: data.expectedNumberOfTransation,
                expectedAmountPerTransaction: data.expectedAmountPerTranction,
                investmentSourceId: (data.source) ? data.source.id : '',
                additionalInfo: this.getadditionalInfoDesc(data),
                investmentPeriodId: (data.investinvestmentEarnings) ? data.investinvestmentEarnings.investmentPeriod.id : '',
                earningSourceId: (data.investinvestmentEarnings) ? data.investinvestmentEarnings.earningsGenerated.id : ''
            }
        };
    }

    convertDate(dateObject) {
        let convertedDate = '';
        if (dateObject) {
            convertedDate = dateObject.day + '-' + dateObject.month + '-' + dateObject.year;
        }
        return convertedDate;
    }

    getadditionalInfoDesc(data) {
        let additionalDesc = '';
        if (data.inheritanceGiftFrom) {
            additionalDesc = data.inheritanceGiftFrom.inheritanceGift;
        } else if (data.personalSavingForm) {
            additionalDesc = data.personalSavingForm.personalSavings;
        }
        return additionalDesc;
    }

    constructQueryParams(options) {
        const objectKeys = Object.keys(options);
        const params = new URLSearchParams();
        Object.keys(objectKeys).map((e) => {
            params.set(objectKeys[e], options[objectKeys[e]]);
        });
        return '?' + params.toString();
    }

    
}
