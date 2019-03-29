import {
  IAddress,
  IEmployment,
  IHousehold,
  IPersonalDeclaration,
  IPersonalInfo,
  ISaveInvestmentAccountRequest,
} from './investment-account.request';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentAccountFormError } from '../investment-account/investment-account-form-error';
import { PortfolioService } from '../portfolio/portfolio.service';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { SignUpService } from '../sign-up/sign-up.service';
import { InvestmentAccountFormData } from './investment-account-form-data';
import { INVESTMENT_ACCOUNT_CONFIG } from './investment-account.constant';
import { PersonalInfo } from './personal-info/personal-info';

const SESSION_STORAGE_KEY = 'app_inv_account_session';
const ACCOUNT_SUCCESS_COUNTER_KEY = 'investment_account_success_counter';

@Injectable({
  providedIn: 'root'
})
export class InvestmentAccountService {
  disableAttributes = [];
  myInfoAttributes = INVESTMENT_ACCOUNT_CONFIG.MY_INFO_ATTRIBUTES;

  private investmentAccountFormData: InvestmentAccountFormData = new InvestmentAccountFormData();
  private investmentAccountFormError: any = new InvestmentAccountFormError();

  constructor(
    private signUpService: SignUpService,
    private http: HttpClient,
    private apiService: ApiService,
    public authService: AuthenticationService,
    private portfolioService: PortfolioService,
    public readonly translate: TranslateService,
    private modal: NgbModal
  ) {
    this.getInvestmentAccountFormData();
    this.setDefaultValueForFormData();
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(this.investmentAccountFormData)
      );
    }
  }

  // Return the entire Form Data
  getInvestmentAccountFormData() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.investmentAccountFormData = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE_KEY)
      );
    }
    return this.investmentAccountFormData;
  }
  /* Residential Address */
  getCountriesFormData() {
    return this.investmentAccountFormData.countryList;
  }
  isSingaporeResident() {
    const selectedNationality = this.investmentAccountFormData.nationalityCode.toUpperCase();
    return (
      selectedNationality === INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE ||
      this.investmentAccountFormData.singaporeanResident
    );
  }
  isCountrySingapore(country) {
    if (country) {
      return country.countryCode === INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_COUNTRY_CODE;
    } else {
      return false;
    }
  }
  getCountryFromNationalityCode(nationalityCode) {
    let country;
    const selectedNationality = this.investmentAccountFormData.nationalityList.filter(
      (nationality) => nationality.nationalityCode === nationalityCode
    );
    if (selectedNationality[0] && selectedNationality[0].countries[0]) {
      country = selectedNationality[0].countries[0];
    }
    return country;
  }
  getCountryFromCountryCode(countryCode) {
    let country = '';
    const selectedCountry = this.investmentAccountFormData.countryList.filter(
      (countries) => countries.countryCode === countryCode
    );
    if (selectedCountry[0]) {
      country = selectedCountry[0];
    }
    return country;
  }
  getCountryList(data) {
    const countryList = [];
    const sortedCountryList = [];
    data.forEach((nationality) => {
      if (!nationality.blocked) {
        nationality.countries.forEach((country) => {
          countryList.push(country);
        });
      }
    });
    INVESTMENT_ACCOUNT_CONFIG.PRIORITIZED_COUNTRY_LIST_CODES.forEach((countryCode) => {
      const filteredCountry = countryList.filter(
        (country) => country.countryCode === countryCode
      );
      sortedCountryList.push(filteredCountry[0]);
      countryList.splice(countryList.indexOf(filteredCountry[0]), 1);
    });
    this.portfolioService.sortByProperty(countryList, 'name', 'asc');
    return sortedCountryList.concat(countryList);
  }
  setDefaultValueForFormData() {
    this.investmentAccountFormData.isMailingAddressSame =
      INVESTMENT_ACCOUNT_CONFIG.residential_info.isMailingAddressSame;
  }
  setResidentialAddressFormData(data) {
    if (data.country) {
      this.investmentAccountFormData.country = data.country;
    }
    if (data.postalCode) {
      this.investmentAccountFormData.postalCode = data.postalCode;
    }
    if (data.zipCode) {
      this.investmentAccountFormData.zipCode = data.zipCode;
    }
    if (data.address1) {
      this.investmentAccountFormData.address1 = data.address1;
    }
    if (data.address2) {
      this.investmentAccountFormData.address2 = data.address2;
    }
    if (data.floor) {
      this.investmentAccountFormData.floor = data.floor;
    }
    if (data.unitNo) {
      this.investmentAccountFormData.unitNo = data.unitNo;
    }
    this.investmentAccountFormData.city = data.city;
    this.investmentAccountFormData.state = data.state;
    this.investmentAccountFormData.isMailingAddressSame = data.isMailingAddressSame;
    if (!data.isMailingAddressSame) {
      this.setEmailingAddress(data);
    }
    this.commit();
  }

  setEmailingAddress(data) {
    if (data.mailingAddress.reason) {
      this.investmentAccountFormData.reason = data.mailingAddress.reason;
    }
    if (data.mailingAddress.reasonForOthers) {
      this.investmentAccountFormData.reasonForOthers =
        data.mailingAddress.reasonForOthers;
    }
    if (data.mailingAddress.mailCountry) {
      this.investmentAccountFormData.mailCountry = data.mailingAddress.mailCountry;
    }
    if (data.mailingAddress.mailPostalCode) {
      this.investmentAccountFormData.mailPostalCode = data.mailingAddress.mailPostalCode;
    }
    if (data.mailingAddress.mailZipCode) {
      this.investmentAccountFormData.mailZipCode = data.mailingAddress.mailZipCode;
    }
    if (data.mailingAddress.mailAddress1) {
      this.investmentAccountFormData.mailAddress1 = data.mailingAddress.mailAddress1;
    }
    if (data.mailingAddress.mailAddress2) {
      this.investmentAccountFormData.mailAddress2 = data.mailingAddress.mailAddress2;
    }
    if (data.mailingAddress.mailFloor) {
      this.investmentAccountFormData.mailFloor = data.mailingAddress.mailFloor;
    }
    if (data.mailingAddress.mailUnitNo) {
      this.investmentAccountFormData.mailUnitNo = data.mailingAddress.mailUnitNo;
    }
    this.investmentAccountFormData.mailCity = data.mailingAddress.mailCity;
    this.investmentAccountFormData.mailState = data.mailingAddress.mailState;
  }
  setTaxInfoFormData(data) {
    this.investmentAccountFormData.taxObj = data;
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
              errors.errorMessages.push(
                this.investmentAccountFormError.formFieldErrors[nestedControlName][
                  Object.keys(nestedControls[nestedControlName]['errors'])[0]
                ].errorMessage
              );
            }
          }
        } else {
          // NO NESTED CONTROLS
          // tslint:disable-next-line
          errors.errorMessages.push(
            this.investmentAccountFormError.formFieldErrors[name][
              Object.keys(controls[name]['errors'])[0]
            ].errorMessage
          );
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
    return this.apiService.getAllDropdownList();
  }

  getInvestmentPeriod() {
    return this.apiService.getInvestmentPeriod();
  }
  getTaxInfo() {
    return {
      tinNumber: this.investmentAccountFormData.tinNumber,
      taxCountry: this.investmentAccountFormData.taxCountry,
      radioTin: this.investmentAccountFormData.radioTin,
      noTinReason: this.investmentAccountFormData.noTinReason
    };
  }
  getPepData() {
    return this.investmentAccountFormData.pep;
  }
  getBOStatus() {
    return this.investmentAccountFormData.beneficial;
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
    return true;
  }

  setNationality(
    nationalityList: any,
    countryList: any,
    nationality: any,
    unitedStatesResident: any,
    singaporeanResident: any
  ) {
    this.investmentAccountFormData.nationalityList = nationalityList;
    this.investmentAccountFormData.countryList = countryList;
    this.investmentAccountFormData.nationalityCode = nationality.nationalityCode;
    this.investmentAccountFormData.nationality = nationality;
    this.investmentAccountFormData.unitedStatesResident = unitedStatesResident;
    this.investmentAccountFormData.singaporeanResident = singaporeanResident;
    this.commit();
  }

  setNationalitiesCountries(nationalityList: any, countryList: any) {
    this.investmentAccountFormData.nationalityList = nationalityList;
    this.investmentAccountFormData.countryList = countryList;
    this.commit();
  }

  setPersonalInfo(data: PersonalInfo) {
    if (data.fullName) {
      this.investmentAccountFormData.fullName = data.fullName.toUpperCase();
    }
    if (data.nricNumber) {
      this.investmentAccountFormData.nricNumber = data.nricNumber.toUpperCase();
    }
    if (data.passportNumber) {
      this.investmentAccountFormData.passportNumber = data.passportNumber.toUpperCase();
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
    this.investmentAccountFormData.salutation = data.salutation;
    this.investmentAccountFormData.birthCountry = data.birthCountry;
    this.investmentAccountFormData.passportIssuedCountry = data.passportIssuedCountry;
    this.investmentAccountFormData.race = data.race;
    this.commit();
  }
  getPersonalInfo() {
    return {
      fullName: this.investmentAccountFormData.fullName,
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
      otherIndustry: this.investmentAccountFormData.otherIndustry,
      otherOccupation: this.investmentAccountFormData.otherOccupation,
      empCountry: this.investmentAccountFormData.empCountry,
      empPostalCode: this.investmentAccountFormData.empPostalCode,
      empAddress1: this.investmentAccountFormData.empAddress1,
      empAddress2: this.investmentAccountFormData.empAddress2,
      empFloor: this.investmentAccountFormData.empFloor,
      empUnitNo: this.investmentAccountFormData.empUnitNo,
      empCity: this.investmentAccountFormData.empCity,
      empState: this.investmentAccountFormData.empState,
      empZipCode: this.investmentAccountFormData.empZipCode
    };
  }
  setEmployeAddressFormData(data) {
    if (data.employmentStatus !== 'Unemployed') {
      this.investmentAccountFormData.employmentStatus = data.employmentStatus;
      if (data.companyName) {
        this.investmentAccountFormData.companyName = data.companyName;
      }
      if (data.occupation) {
        this.investmentAccountFormData.occupation = data.occupation;
      }
      if (data.otherOccupation) {
        this.investmentAccountFormData.otherOccupation = data.otherOccupation;
      }
      this.investmentAccountFormData.industry = data.industry;
      if (data.otherIndustry) {
        this.investmentAccountFormData.otherIndustry = data.otherIndustry;
      }
      this.investmentAccountFormData.contactNumber = data.contactNumber;
      this.investmentAccountFormData.empCountry = data.employeaddress.empCountry;
      this.investmentAccountFormData.empPostalCode = data.employeaddress.empPostalCode;
      this.investmentAccountFormData.empAddress1 = data.employeaddress.empAddress1;
      this.investmentAccountFormData.empAddress2 = data.employeaddress.empAddress2;
      this.investmentAccountFormData.empFloor = data.employeaddress.empFloor;
      this.investmentAccountFormData.empUnitNo = data.employeaddress.empUnitNo;
      this.investmentAccountFormData.empCity = data.employeaddress.empCity;
      this.investmentAccountFormData.empState = data.employeaddress.empState;
      this.investmentAccountFormData.empZipCode = data.employeaddress.empZipCode;
    } else {
      this.investmentAccountFormData.employmentStatus = data.employmentStatus;
    }
    this.commit();
  }
  updateEmployerAddress(data) {
    const payload = this.constructEmploymentDetailsReqData(data);
    console.log('Update Emp Payload' + payload);
    return this.apiService.requestUpdateEmployerAddress(payload);
  }
  constructEmploymentDetailsReqData(data): IEmployment {
    const empStatus = this.getEmploymentByName(data.employmentStatus);
    return {
      employmentStatusId: empStatus.id,
      industryId: data.industry ? data.industry.id : null,
      otherIndustry: data.otherIndustry ? data.otherIndustry : null,
      occupationId: data.occupation ? data.occupation.id : null,
      otherOccupation: data.otherOccupation ? data.otherOccupation : null,
      employerName: data.companyName ? data.companyName : null,
      contactNumber: data.contactNumber ? data.contactNumber : null,
      unemployedReason: null, // todo not available in client
      employerAddress: data.employeaddress
        ? this.constructEmployerAddressReqData(data.employeaddress)
        : null
    };
  }

  constructEmployerAddressReqData(data): IAddress {
    let addressDetails = null;
    addressDetails = {
      countryId: data.empCountry.id ? data.empCountry.id : null,
      state: data.empState,
      postalCode: this.isCountrySingapore(data.empCountry)
        ? data.empPostalCode
        : data.empZipCode,
      addressLine1: data.empAddress1,
      addressLine2: data.empAddress2,
      floor: data.empFloor,
      unitNumber: data.empUnitNo,
      townName: null, // todo not available in client
      city: data.empCity
    };
    return addressDetails;
  }
  // Additional info pep data
  setAdditionalInfoFormData(data) {
    this.investmentAccountFormData.fName = data.fName;
    this.investmentAccountFormData.lName = data.lName;
    this.investmentAccountFormData.cName = data.cName;
    this.investmentAccountFormData.pepoccupation = data.pepoccupation;
    this.investmentAccountFormData.pepOtherOccupation = data.pepOtherOccupation;
    this.investmentAccountFormData.pepCountry = data.pepCountry;
    this.investmentAccountFormData.pepPostalCode = data.pepPostalCode;
    this.investmentAccountFormData.pepAddress1 = data.pepAddress1;
    this.investmentAccountFormData.pepAddress2 = data.pepAddress2;
    this.investmentAccountFormData.pepFloor = data.pepFloor;
    this.investmentAccountFormData.pepUnitNo = data.pepUnitNo;
    this.investmentAccountFormData.pepCity = data.pepCity;
    this.investmentAccountFormData.pepState = data.pepState;
    this.investmentAccountFormData.pepZipCode = data.pepZipCode;
    this.commit();
  }

  setEmploymentStatusList(list) {
    this.investmentAccountFormData.employmentStatusList = list;
    this.commit();
  }

  setOptionList(list) {
    this.investmentAccountFormData.optionList = list;
    this.commit();
  }

  getOptionList() {
    return this.investmentAccountFormData.optionList;
  }

  // Upload Document
  uploadDocument(formData) {
    return this.apiService.uploadDocument(formData);
  }

  saveAdditionalDeclarations() {
    const payload = this.additionalDeclarationsRequest();
    return this.apiService.saveInvestmentAccount(payload);
  }

  saveInvestmentAccount() {
    const payload = this.constructSaveInvestmentAccountRequest();
    return this.apiService.saveInvestmentAccount(payload);
  }

  // Select Nationality
  saveNationality(data) {
    const payload = this.constructSaveNationalityRequest(data);
    return this.apiService.saveNationality(payload);
  }
  createInvestmentAccount() {
    return this.apiService.createInvestmentAccount();
  }

  verifyAML() {
    return this.apiService.verifyAML();
  }

  setFinancialFormData(data) {
    if (data.annualHouseHoldIncomeRange) {
      this.investmentAccountFormData.annualHouseHoldIncomeRange =
        data.annualHouseHoldIncomeRange;
    }
    this.investmentAccountFormData.numberOfHouseHoldMembers =
      data.numberOfHouseHoldMembers;
    this.commit();
  }
  getFinancialFormData() {
    return {
      annualHouseHoldIncomeRange: this.investmentAccountFormData
        .annualHouseHoldIncomeRange,
      numberOfHouseHoldMembers: this.investmentAccountFormData.numberOfHouseHoldMembers
    };
  }

  setCallBackInvestmentAccount() {
    this.investmentAccountFormData.callBackInvestmentAccount = true;
    this.commit();
  }

  getCallBackInvestmentAccount() {
    return this.investmentAccountFormData.callBackInvestmentAccount;
  }

  setMyInfoFormData(data) {
    if (data.name && data.name.value) {
      this.investmentAccountFormData.fullName = data.name.value;
    }
    this.disableAttributes.push('fullName');
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
      this.disableAttributes.push('employmentStatus');
    } else {
      this.disableAttributes.push('employmentStatus');
    }

    // Occupation
    if (data.occupation && data.occupation.occupationDetails) {
      this.investmentAccountFormData.occupation = data.occupation.occupationDetails;
      this.disableAttributes.push('occupation');
      if (data.occupation.occupationDetails.occupation &&
        data.occupation.occupationDetails.occupation.toUpperCase() === INVESTMENT_ACCOUNT_CONFIG.OTHERS.toUpperCase()) {
        this.investmentAccountFormData.otherOccupation = data.occupation.desc;
        this.disableAttributes.push('otherOccupation');
      }
    }

    // Monthly Household Income
    if (data.householdincome && data.householdincome.householdDetails) {
      this.investmentAccountFormData.annualHouseHoldIncomeRange =
        data.householdincome.householdDetails;
      this.disableAttributes.push('annualHouseHoldIncomeRange');
    }
    this.investmentAccountFormData.disableAttributes = this.disableAttributes;
    this.investmentAccountFormData.isMyInfoEnabled = true;
    this.commit();
  }

  // MyInfo - Personal data
  setMyInfoPersonal(data) {
    if (data.uin) {
      this.investmentAccountFormData.nricNumber = data.uin;
      this.disableAttributes.push('nricNumber');
    }
    if (data.passportnumber && data.passportnumber.value) {
      this.investmentAccountFormData.passportNumber = data.passportnumber.value;
      this.disableAttributes.push('passportNumber');
    }
    if (data.passportexpirydate && data.passportexpirydate.value) {
      this.investmentAccountFormData.passportExpiry = this.dateFormat(
        data.passportexpirydate.value
      );
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
    if (data.birthcountry && data.birthcountry.countryDetails) {
      this.investmentAccountFormData.birthCountry = this.getCountryObject(data.birthcountry.countryDetails);
      this.disableAttributes.push('birthCountry');
    }
  }

  getCountryObject(countryDetails) {
    return {
      id: countryDetails.id,
      countryCode: countryDetails.countryCode,
      name: countryDetails.country,
      phoneCode: countryDetails.phoneCode
    };
  }

  // MyInfo - Residential Address
  setMyInfoResidentialAddress(data) {
    // Register address
    if (data.regadd) {
      if (data.regadd.countryDetails) {
        this.investmentAccountFormData.country = this.getCountryObject(data.regadd.countryDetails);
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
        this.investmentAccountFormData.postalCode = data.regadd.postal;
        this.investmentAccountFormData.zipCode = data.regadd.postal;
        this.disableAttributes.push('zipCode');
        this.disableAttributes.push('postalCode');
      }
    }
    if (data.mailadd) {
        this.setMyInfoEmailAddress(data);
    }
  }

  // MyInfo - Email Address
  setMyInfoEmailAddress(data) {
    let emailAddressExist = false;
    if (data.mailadd.countryDetails) {
      this.investmentAccountFormData.mailCountry = this.getCountryObject(data.mailadd.countryDetails);
      this.disableAttributes.push('mailCountry');
      emailAddressExist = true;
    }
    if (data.mailadd.floor) {
      this.investmentAccountFormData.mailFloor = data.mailadd.floor;
      this.disableAttributes.push('mailFloor');
      emailAddressExist = true;
    }
    if (data.mailadd.unit) {
      this.investmentAccountFormData.mailUnitNo = data.mailadd.unit;
      this.disableAttributes.push('mailUnitNo');
      emailAddressExist = true;
    }
    if (data.mailadd.block) {
      this.investmentAccountFormData.mailAddress1 = 'Block ' + data.mailadd.block;
      this.disableAttributes.push('mailAddress1');
      emailAddressExist = true;
    }
    if (data.mailadd.street) {
      this.investmentAccountFormData.mailAddress2 = data.mailadd.street;
      this.disableAttributes.push('mailAddress2');
      emailAddressExist = true;
    }
    if (data.mailadd.postal) {
      this.investmentAccountFormData.mailPostalCode = data.mailadd.postal;
      this.investmentAccountFormData.mailZipCode = data.mailadd.postal;
      this.disableAttributes.push('mailZipCode');
      this.disableAttributes.push('mailPostalCode');
      emailAddressExist = true;
    }
    if (emailAddressExist) {
      this.investmentAccountFormData.isMailingAddressSame = false;
    } else {
      this.investmentAccountFormData.isMailingAddressSame = true;
    }
  }

  dateFormat(date: string) {
    const dateArr: any = date.split('-');
    return {
      year: Number(dateArr[0]),
      month: Number(dateArr[1]),
      day: Number(dateArr[2])
    };
  }

  dateFormatFromApi(date: string) {
    const dateArr: any = date ? date.split(' ')[0].split('/') : [];
    return {
      year: Number(dateArr[2]),
      month: Number(dateArr[0]),
      day: Number(dateArr[1])
    };
  }

  isDisabled(fieldName): boolean {
    let disable: boolean;
    if (
      this.investmentAccountFormData.isMyInfoEnabled &&
      this.investmentAccountFormData.disableAttributes.includes(fieldName)
    ) {
      if (INVESTMENT_ACCOUNT_CONFIG.DISABLE_FIELDS_FOR_NON_SG.includes(fieldName) && this.isSingaporeResident()) {
        disable = false;
      } else {
        disable = true;
      }
    } else {
      disable = false;
    }
    return disable;
  }

  isSingPassDisabled() {
    return this.investmentAccountFormData.isMyInfoEnabled;
  }

  setMyInfoStatus(status) {
    this.investmentAccountFormData.isMyInfoEnabled = status;
    this.commit();
  }

  getAdditionDeclaration() {
    return {
      source: this.investmentAccountFormData.source,
      expectedNumberOfTransation: this.investmentAccountFormData
        .expectedNumberOfTransation,
      expectedAmountPerTranction: this.investmentAccountFormData
        .expectedAmountPerTranction,
      personalSavings: this.investmentAccountFormData.personalSavings,

      inheritanceGift: this.investmentAccountFormData.inheritanceGift,
      investmentEarnings: this.investmentAccountFormData.investmentEarnings,
      durationInvestment: this.investmentAccountFormData.durationInvestment,
      earningsGenerated: this.investmentAccountFormData.earningsGenerated,
      otherSources: this.investmentAccountFormData.otherSources
    };
  }
  setAdditionDeclaration(data) {
    this.investmentAccountFormData.expectedNumberOfTransation =
      data.expectedNumberOfTransation;
    this.investmentAccountFormData.expectedAmountPerTranction =
      data.expectedAmountPerTranction;
    this.investmentAccountFormData.source = data.source;
    if (data.personalSavingForm) {
      this.investmentAccountFormData.personalSavings =
        data.personalSavingForm.personalSavings;
    }
    if (data.inheritanceGiftFrom) {
      this.investmentAccountFormData.inheritanceGift =
        data.inheritanceGiftFrom.inheritanceGift;
    }
    if (data.othersFrom) {
      this.investmentAccountFormData.otherSources = data.othersFrom.otherSources;
    }
    if (data.investmentEarnings) {
      this.investmentAccountFormData.durationInvestment =
        data.investmentEarnings.durationInvestment;
      this.investmentAccountFormData.earningsGenerated =
        data.investmentEarnings.earningsGenerated;
    }
    this.commit();
    return true;
  }

  setFundyourAccount(data) {
    this.investmentAccountFormData.Investment = data.Investment;
    this.investmentAccountFormData.oneTimeInvestmentAmount = data.oneTimeInvestmentAmount;
    this.investmentAccountFormData.portfolio = data.portfolio;
    this.investmentAccountFormData.topupportfolioamount = data.topupportfolioamount;
    this.investmentAccountFormData.MonthlyInvestmentAmount = data.MonthlyInvestmentAmount;
  }
  getPortfolioAllocationDetails(params) {
    const urlParams = this.constructQueryParams(params);
    return this.apiService.getPortfolioAllocationDetails(urlParams);
  }

  updateInvestment(params) {
    return this.apiService.updateInvestment(params);
  }

  additionalDeclarationsRequest() {
    const payload = this.getInvestmentAccountFormData();
    const request = {} as ISaveInvestmentAccountRequest;
    request.myInfoVerified = null;
    request.isSingaporePR = null;
    request.personalInfo = null;
    request.residentialAddress = null;
    request.mailingAddress = null;
    request.employmentDetails = null;
    request.householdDetails = null;
    request.taxDetails = null;
    request.sameAsMailingAddress = null;
    request.personalDeclarations = this.getPersonalDecReqData(payload);
    return request;
  }

  constructSaveInvestmentAccountRequest() {
    const payload = this.getInvestmentAccountFormData();
    const request = {} as ISaveInvestmentAccountRequest;
    request.myInfoVerified = payload.isMyInfoEnabled;
    request.isSingaporePR = payload.singaporeanResident;
    request.personalInfo = this.getPersonalInfoReqData(payload);
    request.residentialAddress = this.getResidentialAddressReqData(payload);
    request.sameAsMailingAddress = payload.isMailingAddressSame;
    request.mailingAddress = this.getMailingAddressReqData(payload);
    request.employmentDetails = this.getEmploymentDetailsReqData(payload);
    request.householdDetails = this.getHouseholdDetailsReqData(payload);
    request.taxDetails = this.getTaxDetailsReqData(payload);
    request.personalDeclarations = this.getPersonalDecReqData(payload);
    return request;
  }
  // select Nationality
  constructSaveNationalityRequest(data) {
    return {
      nationality: data.nationalityCode
    };
  }
  getPersonalInfoReqData(data): IPersonalInfo {
    return {
      nationalityCode: data.nationalityCode,
      fullName: data.fullName,
      nricNumber: data.nricNumber ? data.nricNumber : null,
      passportNumber: data.passportNumber ? data.passportNumber : null,
      passportExpiryDate: data.passportExpiry
        ? this.convertDate(data.passportExpiry)
        : null,
      passportIssuedCountryId: data.passportIssuedCountry
        ? data.passportIssuedCountry.id
        : null,
      dateOfBirth: this.convertDate(data.dob),
      gender: data.gender,
      salutation: data.salutation ? data.salutation.name : null,
      birthCountryId: data.birthCountry ? data.birthCountry.id : null,
      race: data.race ? data.race.name : null
    };
  }

  getResidentialAddressReqData(data): IAddress {
    return {
      countryId: data.country ? data.country.id : null,
      state: data.state,
      postalCode: this.isCountrySingapore(data.country) ? data.postalCode : data.zipCode,
      addressLine1: data.address1,
      addressLine2: data.address2,
      floor: data.floor,
      unitNumber: data.unitNo,
      townName: null, // todo - not available in client
      city: data.city
    };
  }
  getMailingAddressReqData(data): IAddress {
    let addressDetails = null;
    if (typeof data.isMailingAddressSame !== 'undefined' && !data.isMailingAddressSame) {
      addressDetails = {
        countryId: data.mailCountry ? data.mailCountry.id : null,
        state: data.mailState,
        postalCode: this.isCountrySingapore(data.mailCountry)
          ? data.mailPostalCode
          : data.mailZipCode,
        addressLine1: data.mailAddress1,
        addressLine2: data.mailAddress2,
        floor: data.mailFloor,
        unitNumber: data.unitNo,
        townName: null, // todo - not available in client
        city: data.mailCity,
        reasonId: data.reason.id,
        reasonForOthers: data.reasonForOthers
      };
    }
    return addressDetails;
  }

  getEmploymentDetailsReqData(data): IEmployment {
    const empStatus = data.employmentStatus
      ? this.getEmploymentByName(data.employmentStatus)
      : null;
    return {
      employmentStatusId: empStatus && empStatus.id ? empStatus.id : null,
      industryId: data.industry ? data.industry.id : null,
      otherIndustry: data.otherIndustry ? data.otherIndustry : null,
      occupationId: data.occupation ? data.occupation.id : null,
      otherOccupation: data.otherOccupation ? data.otherOccupation : null,
      employerName: data.companyName,
      contactNumber: data.contactNumber,
      unemployedReason: null, // todo not available in client
      employerAddress: this.getEmployerAddressReqData(data)
    };
  }

  getEmployerAddressReqData(data): IAddress {
    let addressDetails = null;
    addressDetails = {
      countryId: data.empCountry ? data.empCountry.id : null,
      state: data.empState,
      postalCode: this.isCountrySingapore(data.empCountry)
        ? data.empPostalCode
        : data.empZipCode,
      addressLine1: data.empAddress1,
      addressLine2: data.empAddress2,
      floor: data.empFloor,
      unitNumber: data.empUnitNo,
      townName: null, // todo not available in client
      city: data.empCity
    };
    return addressDetails;
  }

  getHouseholdDetailsReqData(data): IHousehold {
    return {
      numberOfMembers: data.numberOfHouseHoldMembers,
      houseHoldIncomeId: data.annualHouseHoldIncomeRange
        ? data.annualHouseHoldIncomeRange.id
        : null
    };
  }

  getTaxDetailsReqData(data) {
    const taxInfo = [];
    if (data.taxObj && data.taxObj.addTax) {
      data.taxObj.addTax.map((item) => {
        taxInfo.push({
          taxCountryId: item.taxCountry ? item.taxCountry.id : null,
          tinNumber: item.radioTin ? item.tinNumber : null,
          noTinReason: item.noTinReason && !item.radioTin ? item.noTinReason.id : null
        });
      });
    }
    return taxInfo;
  }

  getPersonalDecReqData(data): IPersonalDeclaration {
    const earningsGeneratedId = data.earningsGenerated ? data.earningsGenerated.id : null;
    return {
      investmentSourceId: data.sourceOfIncome ? data.sourceOfIncome.id : null,
      beneficialOwner: data.beneficial,
      politicallyExposed: data.pep,
      connectedToInvestmentFirm: data.ExistingEmploye,
      pepDeclaration: {
        firstName: data.fName,
        lastName: data.lName,
        companyName: data.cName,
        occupationId: data.pepoccupation ? data.pepoccupation.id : null,
        otherOccupation: data.pepOtherOccupation ? data.pepOtherOccupation : null,
        pepAddress: {
          countryId: data.pepCountry ? data.pepCountry.id : null,
          state: data.pepState,
          postalCode: this.isCountrySingapore(data.pepCountry)
            ? data.pepPostalCode
            : data.pepZipCode,
          addressLine1: data.pepAddress1,
          addressLine2: data.pepAddress2,
          floor: data.pepFloor,
          unitNumber: data.pepUnitNo,
          townName: null, // todo not available in client
          city: data.pepCity
        },
        expectedNumberOfTransactions: parseInt(data.expectedNumberOfTransation, 10),
        expectedAmountPerTransaction: parseInt(data.expectedAmountPerTranction, 10),
        investmentSourceId: data.source ? data.source.id : null,
        additionalInfo: this.getadditionalInfoDesc(data),
        investmentDuration:
          data.source &&
            data.source.key ===
            INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
            ? data.durationInvestment
            : null,
        earningSourceId:
          data.source &&
            data.source.key ===
            INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
            ? earningsGeneratedId
            : null
      }
    };
  }

  convertDate(dateObject) {
    let convertedDate = '';
    if (dateObject && dateObject.day && dateObject.month && dateObject.year) {
      convertedDate = dateObject.day + '-' + dateObject.month + '-' + dateObject.year;
    }
    return convertedDate;
  }

  getEmploymentByName(name) {
    const employmentStatus = this.investmentAccountFormData.employmentStatusList.filter(
      (status) => status.name === name
    );
    return employmentStatus[0];
  }

  getadditionalInfoDesc(data) {
    let additionalDesc = '';
    if (data.source) {
      if (
        data.source.key ===
        INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.PERSONAL_SAVING
      ) {
        additionalDesc = data.personalSavings;
      } else if (
        data.source.key ===
        INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.GIFT_INHERITANCE
      ) {
        additionalDesc = data.inheritanceGift;
      } else if (
        data.source.key === INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.OTHERS
      ) {
        additionalDesc = data.otherSources;
      }
    }

    return additionalDesc;
  }

  constructQueryParams(options) {
    const objectKeys = Object.keys(options);
    const params = new URLSearchParams();
    Object.keys(objectKeys).forEach((e) => {
      params.set(objectKeys[e], options[objectKeys[e]]);
    });
    return '?' + params.toString();
  }

  // tslint:disable-next-line:cognitive-complexity
  setEditProfileContactInfo(
    data,
    nationalityList,
    countryList,
    isMailingAddressSame,
    isSingaporeResident,
    mailingProof,
    resProof
  ) {
    this.investmentAccountFormData.nationalityCode =
      data.contactDetails.homeAddress.country.nationalityCode;
    this.investmentAccountFormData.nationality = data.contactDetails.homeAddress.country;
    this.investmentAccountFormData.singaporeanResident = isSingaporeResident;
    this.investmentAccountFormData.nationalityList = nationalityList;
    this.investmentAccountFormData.countryList = countryList;
    this.investmentAccountFormData.resUploadedPath = resProof;
    this.investmentAccountFormData.mailingUploadedPath = mailingProof;
    if (data.contactDetails.homeAddress.country) {
      this.investmentAccountFormData.country = data.contactDetails.homeAddress.country;
    }
    if (data.contactDetails.homeAddress.postalCode) {
      this.investmentAccountFormData.postalCode =
        data.contactDetails.homeAddress.postalCode;
    }
    if (data.contactDetails.homeAddress.addressLine1) {
      this.investmentAccountFormData.address1 =
        data.contactDetails.homeAddress.addressLine1;
    }
    if (data.contactDetails.homeAddress.addressLine2) {
      this.investmentAccountFormData.address2 =
        data.contactDetails.homeAddress.addressLine2;
    }
    if (data.contactDetails.homeAddress.unitNumber) {
      this.investmentAccountFormData.unitNo = data.contactDetails.homeAddress.unitNumber;
    }
    if (data.contactDetails.homeAddress.floor) {
      this.investmentAccountFormData.floor = data.contactDetails.homeAddress.floor;
    }
    if (data.contactDetails.homeAddress.city) {
      this.investmentAccountFormData.city = data.contactDetails.homeAddress.city;
    }
    if (data.contactDetails.homeAddress.zipcode) {
      this.investmentAccountFormData.zipCode = data.contactDetails.homeAddress.zipCode;
    }
    if (data.contactDetails.homeAddress.state) {
      this.investmentAccountFormData.state = data.contactDetails.homeAddress.state;
    }
    this.investmentAccountFormData.isMailingAddressSame = isMailingAddressSame;
    if (!isMailingAddressSame) {
      if (data.contactDetails.mailingAddress.country) {
        this.investmentAccountFormData.mailCountry =
          data.contactDetails.mailingAddress.country;
      }
      if (data.contactDetails.mailingAddress.postalCode) {
        this.investmentAccountFormData.mailPostalCode =
          data.contactDetails.mailingAddress.postalCode;
      }
      if (data.contactDetails.mailingAddress.addressLine1) {
        this.investmentAccountFormData.mailAddress1 =
          data.contactDetails.mailingAddress.addressLine1;
      }
      if (data.contactDetails.mailingAddress.addressLine2) {
        this.investmentAccountFormData.mailAddress2 =
          data.contactDetails.mailingAddress.addressLine2;
      }
      if (data.contactDetails.mailingAddress.unitNumber) {
        this.investmentAccountFormData.mailUnitNo =
          data.contactDetails.mailingAddress.unitNumber;
      }
      if (data.contactDetails.mailingAddress.floor) {
        this.investmentAccountFormData.mailFloor =
          data.contactDetails.mailingAddress.floor;
      }
      if (data.contactDetails.mailingAddress.state) {
        this.investmentAccountFormData.mailState =
          data.contactDetails.mailingAddress.state;
      }
      if (data.contactDetails.mailingAddress.city) {
        this.investmentAccountFormData.mailCity = data.contactDetails.mailingAddress.city;
      }
      if (data.contactDetails.mailingAddress.zipCode) {
        this.investmentAccountFormData.mailZipCode =
          data.contactDetails.mailingAddress.zipCode;
      }
    }
    this.commit();
  }
  // tslint:disable-next-line:cognitive-complexity
  setEditProfileEmployeInfo(data, nationalityList, countryList, isSingaporeResident) {
    this.investmentAccountFormData.nationalityCode =
      data.contactDetails.homeAddress.country.nationalityCode;
    this.investmentAccountFormData.nationality = data.contactDetails.homeAddress.country;
    this.investmentAccountFormData.singaporeanResident = isSingaporeResident;
    this.investmentAccountFormData.nationalityList = nationalityList;
    this.investmentAccountFormData.countryList = countryList;
    this.investmentAccountFormData.employmentStatus =
      data.employmentDetails.employmentStatus.name;
    if (data.employmentDetails.employmentStatus.name !== 'Unemployed') {
      if (data.employmentDetails.employerDetails.detailedEmployerDetails) {
        if (data.employmentDetails.employerDetails.detailedEmployerDetails.employerName) {
          // tslint:disable-next-line:max-line-length
          this.investmentAccountFormData.companyName =
            data.employmentDetails.employerDetails.detailedEmployerDetails.employerName;
        }
        if (data.employmentDetails.employerDetails.detailedEmployerDetails.industry) {
          this.investmentAccountFormData.industry =
            data.employmentDetails.employerDetails.detailedEmployerDetails.industry;
        }
        if (
          data.employmentDetails.employerDetails.detailedEmployerDetails.otherIndustry
        ) {
          this.investmentAccountFormData.otherIndustry =
            data.employmentDetails.employerDetails.detailedEmployerDetails.otherIndustry;
        }
        if (data.employmentDetails.employerDetails.employerContact) {
          this.investmentAccountFormData.contactNumber =
            data.employmentDetails.employerDetails.employerContact;
        }
      }
      if (data.employmentDetails.occupation.occupation) {
        this.investmentAccountFormData.occupation = data.employmentDetails.occupation;
      }
      if (data.employmentDetails.otherOccupation) {
        this.investmentAccountFormData.otherOccupation =
          data.employmentDetails.otherOccupation;
      }

      if (data.employmentDetails.employerDetails.detailedEmployerDetails) {
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empCountry =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.country;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empPostalCode =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.postalCode;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empAddress1 =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.addressLine1;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empAddress2 =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.addressLine2;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empFloor =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.floor;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empUnitNo =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.unitNumber;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empCity =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.city;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empState =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.state;
        // tslint:disable-next-line:max-line-length
        this.investmentAccountFormData.empZipCode =
          // tslint:disable-next-line:max-line-length
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.postalCode; // discussed and only one feild name is available in backend
      }
    }
    this.commit();
  }
  setEditProfileBankDetail(fullName, bank, accountNumber, id, isAddBank) {
    if (isAddBank) {
      this.investmentAccountFormData.accountHolderName = fullName;
      this.investmentAccountFormData.bank = bank;
      this.investmentAccountFormData.accountNumber = accountNumber;
    } else {
      if (fullName) {
        this.investmentAccountFormData.accountHolderName = fullName;
      }
      if (bank) {
        this.investmentAccountFormData.bank = bank;
      }
      if (accountNumber) {
        this.investmentAccountFormData.accountNumber = accountNumber;
      }
      if (id) {
        this.investmentAccountFormData.bankUpdateId = id;
      }
    }
    this.commit();
  }
  getBankInfo() {
    return {
      fullName: this.investmentAccountFormData.accountHolderName,
      bank: this.investmentAccountFormData.bank,
      accountNumber: this.investmentAccountFormData.accountNumber,
      id: this.investmentAccountFormData.bankUpdateId
    };
  }
  // tslint:disable-next-line:no-identical-functions
  // tslint:disable-next-line:cognitive-complexity
  editResidentialAddressFormData(data) {
    if (data.country) {
      this.investmentAccountFormData.country = data.country;
    }
    if (data.postalCode) {
      this.investmentAccountFormData.postalCode = data.postalCode;
    }
    if (data.zipCode) {
      this.investmentAccountFormData.zipCode = data.zipCode;
    }
    if (data.address1) {
      this.investmentAccountFormData.address1 = data.address1;
    }
    if (data.address2) {
      this.investmentAccountFormData.address2 = data.address2;
    }
    if (data.floor) {
      this.investmentAccountFormData.floor = data.floor;
    }
    if (data.unitNo) {
      this.investmentAccountFormData.unitNo = data.unitNo;
    }
    if (data.city) {
      this.investmentAccountFormData.city = data.city;
    }
    if (data.state) {
      this.investmentAccountFormData.state = data.state;
    }
    if (data.isMailingAddressSame) {
      this.investmentAccountFormData.isMailingAddressSame = data.isMailingAddressSame;
    }
    if (!data.isMailingAddressSame) {
      this.setEmailingAddress(data);
    }
    this.commit();
    let request;
    let postalCode = null;
    let mailPostalCode = null;
    if (data.postalCode) {
      postalCode = data.postalCode;
    }
    if (data.zipCode) {
      postalCode = data.zipCode;
    }
    if (data.mailingAddress && data.mailingAddress.mailPostalCode) {
      mailPostalCode = data.mailingAddress.mailPostalCode;
    }
    if (data.mailingAddress && data.mailingAddress.mailZipCode) {
      mailPostalCode = data.mailingAddress.mailZipCode;
    }
    if (!data.isMailingAddressSame) {
      request = this.constructEditContactRequestMailingNotSame(
        data,
        postalCode,
        mailPostalCode
      );
    } else {
      request = this.constructEditContactRequest(data, postalCode);
    }
    console.log(' Edit Residential Payload %@', request);
    return this.apiService.requestEditContact(request);
  }
  // tslint:disable-next-line:no-identical-functions
  constructEditContactRequestMailingNotSame(data, postalcode, mailPostalcode) {
    return {
      contactDetails: {
        homeAddress: {
          countryId: data.country.id,
          addressLine1: data.address1,
          addressLine2: data.address2,
          unitNumber: data.unitNo,
          postalCode: postalcode,
          floor: data.floor,
          state: data.state,
          city: data.city
        },
        mailingAddress: {
          countryId: data.mailingAddress.mailCountry.id,
          addressLine1: data.mailingAddress.mailAddress1,
          addressLine2: data.mailingAddress.mailAddress2,
          unitNumber: data.mailingAddress.mailUnitNo,
          postalCode: mailPostalcode,
          state: data.mailingAddress.mailState,
          floor: data.mailingAddress.mailFloor,
          city: data.mailingAddress.mailCity
        }
      }
    };
  }
  constructEditContactRequest(data, postalcode) {
    return {
      contactDetails: {
        homeAddress: {
          id: 1,
          countryId: data.country.id,
          addressLine1: data.address1,
          addressLine2: data.address2,
          unitNumber: data.unitNo,
          postalCode: postalcode,
          floor: data.floor,
          state: data.state,
          city: data.city
        },
        mailingAddress: null
      }
    };
  }

  setPortfolioFormData(data) {
    this.investmentAccountFormData.invOneTime = data.initialInvestment;
    this.investmentAccountFormData.invMonthly = data.monthlyInvestment;
    this.investmentAccountFormData.riskProfileId = data.riskProfile.id;
    this.investmentAccountFormData.riskProfileType = data.riskProfile.type;
    this.commit();
  }

  getAllNotifications() {
    return this.apiService.getAllNotifications();
  }

  setAccountSuccussModalCounter(value: number) {
    if (window.sessionStorage) {
      sessionStorage.setItem(ACCOUNT_SUCCESS_COUNTER_KEY, value.toString());
    }
  }

  getAccountSuccussModalCounter() {
    return parseInt(sessionStorage.getItem(ACCOUNT_SUCCESS_COUNTER_KEY), 10);
  }

  setDataForDocUpload(nationality, beneficialOwner, pep, myInfoVerified) {
    this.investmentAccountFormData.nationality = nationality;
    this.investmentAccountFormData.nationalityCode = nationality.nationalityCode;
    this.investmentAccountFormData.beneficial = beneficialOwner;
    this.investmentAccountFormData.pep = pep;
    this.investmentAccountFormData.isMyInfoEnabled = myInfoVerified;
    this.commit();
  }

  setAccountCreationStatus(status) {
    this.investmentAccountFormData.accountCreationStatus = status;
    this.commit();
  }

  getAccountCreationStatus() {
    return this.investmentAccountFormData.accountCreationStatus;
  }

  getMyInfoStatus() {
    return this.investmentAccountFormData.isMyInfoEnabled;
  }

  clearInvestmentAccountFormData() {
    this.investmentAccountFormData = new InvestmentAccountFormData();
    this.commit();
  }

  getPropertyFromName(name, arrayKey) {
    const filteredObj = this.investmentAccountFormData.optionList[arrayKey].filter(
      (prop) => prop.name === name
    );
    return filteredObj[0];
  }

  getPropertyFromId(id, arrayKey) {
    const filteredObj = this.investmentAccountFormData.optionList[arrayKey].filter(
      (prop) => prop.id === id
    );
    return filteredObj[0];
  }

  getPropertyFromValue(value, arrayKey) {
    const filteredObj = this.investmentAccountFormData.optionList[arrayKey].filter(
      (prop) => prop.value === value
    );
    return filteredObj[0];
  }

  getNationalityFromNationalityCode(nationalityList, nationalityCode) {
    const selectedNationality = nationalityList.filter(
      (nationality) => nationality.nationalityCode === nationalityCode
    );
    return selectedNationality[0].name;
  }

  /* VERIFY NOW - PART OF DASHBOARD */
  setInvestmentAccountFormData(customerData) {
    this.setNationalityFromApi(
      customerData.identityDetails,
      customerData.additionalDetails
    );
    this.setPersonalInfoFromApi(customerData.identityDetails);
    this.setResidentialAddressDetailsFromApi(customerData.identityDetails.customer);
    this.setEmploymentDetailsFromApi(customerData.employmentInformation);
    this.setFinancialDetailsFromApi(customerData.customer, customerData.income);
    this.setTaxInfoFromApi(customerData.taxDetails);
    this.setPersonalDeclarationFromApi(
      customerData.investmentObjective,
      customerData.additionalDetails
    );
    this.setDueDiligence1FromApi(customerData.pepDetails);
    this.setDueDiligence2FromApi(customerData.pepDetails);
  }
  setNationalityFromApi(identityDetails, additionalDetails) {
    this.investmentAccountFormData.nationalityCode =
      identityDetails.customer.nationalityCode;
    this.investmentAccountFormData.nationality = this.getNationalityFromNationalityCode(
      this.investmentAccountFormData.nationalityList,
      identityDetails.customer.nationalityCode
    );
    this.investmentAccountFormData.unitedStatesResident = false; // TODO : VERIFY
    if (additionalDetails) {
      this.investmentAccountFormData.singaporeanResident =
        additionalDetails.isSingaporePR;
    }
    this.commit();
  }
  setPersonalInfoFromApi(identityDetails) {
    this.investmentAccountFormData.salutation = this.getPropertyFromName(
      identityDetails.customer.salutation,
      'salutation'
    );
    this.investmentAccountFormData.nricNumber = identityDetails.nricNumber;
    this.investmentAccountFormData.dob = this.dateFormatFromApi(
      identityDetails.customer.dateOfBirth
    );
    this.investmentAccountFormData.gender = identityDetails.customer.gender;
    this.investmentAccountFormData.birthCountry = this.getCountryFromCountryCode(
      identityDetails.customer.countryOfBirth.countryCode
    );
    this.investmentAccountFormData.passportIssuedCountry = this.getCountryFromCountryCode(
      identityDetails.passportIssuedCountry.countryCode
    );
    this.investmentAccountFormData.race = this.getPropertyFromName(
      identityDetails.customer.race,
      'race'
    );
    this.investmentAccountFormData.passportNumber = identityDetails.passportNumber;
    this.investmentAccountFormData.passportExpiry = this.dateFormatFromApi(
      identityDetails.passportExpiryDate
    );
    this.commit();
  }
  setResidentialAddressDetailsFromApi(customer) {
    this.investmentAccountFormData.country = this.getCountryFromCountryCode(
      customer.homeAddress.countryCode
    );
    this.investmentAccountFormData.address1 = customer.homeAddress.addressLine1;
    this.investmentAccountFormData.address2 = customer.homeAddress.addressLine2;
    this.investmentAccountFormData.city = customer.homeAddress.city;
    this.investmentAccountFormData.state = customer.homeAddress.state;
    this.investmentAccountFormData.floor = customer.homeAddress.floor;
    this.investmentAccountFormData.unitNo = customer.homeAddress.unitNumber;
    this.investmentAccountFormData.isMailingAddressSame = customer.mailingAddress
      ? false
      : true;
    this.investmentAccountFormData.reason = this.getPropertyFromId(
      customer.differentMailingAddressReasonId,
      'differentAddressReason'
    );
    this.investmentAccountFormData.reasonForOthers =
      customer.differentMailingAddressReason;
    if (this.isCountrySingapore(customer.homeAddress.country)) {
      this.investmentAccountFormData.postalCode = customer.homeAddress.postalCode;
    } else {
      this.investmentAccountFormData.zipCode = customer.homeAddress.postalCode;
    }
    if (customer.mailingAddress) {
      this.investmentAccountFormData.mailCountry = this.getCountryFromCountryCode(
        customer.mailingAddress.country.countryCode
      );
      this.investmentAccountFormData.mailAddress1 = customer.mailingAddress.addressLine1;
      this.investmentAccountFormData.mailAddress2 = customer.mailingAddress.addressLine2;
      this.investmentAccountFormData.mailCity = customer.mailingAddress.city;
      this.investmentAccountFormData.mailFloor = customer.mailingAddress.floor;
      this.investmentAccountFormData.mailUnitNo = customer.mailingAddress.unitNumber;
      this.investmentAccountFormData.mailState = customer.mailingAddress.state;
      if (this.isCountrySingapore(customer.mailingAddress.country)) {
        this.investmentAccountFormData.mailPostalCode =
          customer.mailingAddress.postalCode;
      } else {
        this.investmentAccountFormData.mailZipCode = customer.mailingAddress.postalCode;
      }
    }
    this.commit();
  }
  setEmploymentDetailsFromApi(employmentInformation) {
    const empStatusObj = this.getPropertyFromId(
      employmentInformation.customerEmploymentDetails.employmentStatusId,
      'employmentStatus'
    );
    this.investmentAccountFormData.employmentStatus = empStatusObj.name;
    this.investmentAccountFormData.companyName =
      employmentInformation.employerDetails.employerName;
    this.investmentAccountFormData.industry =
      employmentInformation.employerDetails.industry;
    this.investmentAccountFormData.otherIndustry =
      employmentInformation.employerDetails.otherIndustry;
    this.investmentAccountFormData.occupation =
      employmentInformation.customerEmploymentDetails.occupation;
    this.investmentAccountFormData.otherOccupation =
      employmentInformation.customerEmploymentDetails.otherOccupation; // TODO : VERIFY
    this.investmentAccountFormData.contactNumber =
      employmentInformation.employerAddress.contactNumber;
    if (employmentInformation.employerAddress.employerAddress.country) {
      this.investmentAccountFormData.empCountry = this.getCountryFromCountryCode(
        employmentInformation.employerAddress.employerAddress.country.countryCode
      );
    }
    if (
      this.isCountrySingapore(
        employmentInformation.employerAddress.employerAddress.country
      )
    ) {
      this.investmentAccountFormData.empPostalCode =
        employmentInformation.employerAddress.employerAddress.postalCode;
    } else {
      this.investmentAccountFormData.empZipCode =
        employmentInformation.employerAddress.employerAddress.postalCode;
    }
    this.investmentAccountFormData.empAddress1 =
      employmentInformation.employerAddress.employerAddress.addressLine1;
    this.investmentAccountFormData.empAddress2 =
      employmentInformation.employerAddress.employerAddress.addressLine2;
    this.investmentAccountFormData.empCity =
      employmentInformation.employerAddress.employerAddress.city;
    this.investmentAccountFormData.empState =
      employmentInformation.employerAddress.employerAddress.state;
    this.investmentAccountFormData.empFloor =
      employmentInformation.employerAddress.employerAddress.floor;
    this.investmentAccountFormData.empUnitNo =
      employmentInformation.employerAddress.employerAddress.unitNumber;
    this.commit();
  }
  setFinancialDetailsFromApi(customer, income) {
    this.investmentAccountFormData.annualHouseHoldIncomeRange =
      customer && customer.houseHoldDetail && customer.houseHoldDetail.houseHoldIncome
        ? customer.houseHoldDetail.houseHoldIncome
        : null;
    this.investmentAccountFormData.numberOfHouseHoldMembers =
      customer && customer.houseHoldDetail && customer.houseHoldDetail.numberOfMembers
        ? customer.houseHoldDetail.numberOfMembers
        : null;
    this.commit();
  }
  setTaxInfoFromApi(taxDetails) {
    const taxList = [];
    taxDetails.map((item) => {
      const taxInfo = {
        taxCountry: this.getCountryFromCountryCode(item.taxCountry.countryCode),
        radioTin: item.tinNumber ? true : false,
        tinNumber: item.tinNumber,
        noTinReason: this.getPropertyFromId(parseInt(item.noTinReason, 10), 'noTinReason')
      };
      taxList.push(taxInfo);
    });
    if (taxList && taxList.length > 0) {
      this.investmentAccountFormData.taxObj = {
        addTax: taxList
      };
    }
    this.commit();
  }
  setPersonalDeclarationFromApi(investmentObjective, additionalDetails) {
    this.investmentAccountFormData.sourceOfIncome = investmentObjective
      ? investmentObjective.investmentSource
      : null;
    if (additionalDetails) {
      this.investmentAccountFormData.ExistingEmploye =
        additionalDetails.connectedToInvestmentFirm;
      this.investmentAccountFormData.pep = additionalDetails.politicallyExposed;
      this.investmentAccountFormData.beneficial = additionalDetails.beneficialOwner;
    }

    this.commit();
  }
  setDueDiligence1FromApi(pepDetails) {
    if (pepDetails) {
      this.investmentAccountFormData.fName = pepDetails.firstName;
      this.investmentAccountFormData.lName = pepDetails.lastName;
      this.investmentAccountFormData.cName = pepDetails.companyName;
      this.investmentAccountFormData.pepoccupation = pepDetails.occupation;
      this.investmentAccountFormData.pepOtherOccupation = pepDetails.otherOccupation;
      this.investmentAccountFormData.pepCountry = this.getCountryFromCountryCode(
        pepDetails.pepAddress.country.countryCode
      );
      this.investmentAccountFormData.pepPostalCode = pepDetails.pepAddress.postalCode;
      this.investmentAccountFormData.pepAddress1 = pepDetails.pepAddress.addressLine1;
      this.investmentAccountFormData.pepAddress2 = pepDetails.pepAddress.addressLine2;
      this.investmentAccountFormData.pepFloor = pepDetails.pepAddress.floor;
      this.investmentAccountFormData.pepUnitNo = pepDetails.pepAddress.unitNumber;
      this.investmentAccountFormData.pepCity = pepDetails.pepAddress.city;
      this.investmentAccountFormData.pepState = pepDetails.pepAddress.state;
      if (this.isCountrySingapore(pepDetails.pepAddress.country)) {
        this.investmentAccountFormData.pepPostalCode = pepDetails.pepAddress.postalCode;
      } else {
        this.investmentAccountFormData.pepZipCode = pepDetails.pepAddress.postalCode;
      }
      this.commit();
    }
  }
  setDueDiligence2FromApi(pepDetails) {
    if (pepDetails) {
      this.investmentAccountFormData.expectedNumberOfTransation =
        pepDetails.expectedNumberOfTransactions;
      this.investmentAccountFormData.expectedAmountPerTranction =
        pepDetails.expectedAmountPerTransactions;
      this.investmentAccountFormData.source = pepDetails.investmentSourceId;

      if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.PERSONAL_SAVING
      ) {
        this.investmentAccountFormData.personalSavings = pepDetails.additionalInfo;
      } else if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
      ) {
        this.investmentAccountFormData.durationInvestment = pepDetails.investmentPeriod;
        this.investmentAccountFormData.earningsGenerated =
          pepDetails.earningsGeneratedFromId;
      } else if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.GIFT_INHERITANCE
      ) {
        this.investmentAccountFormData.inheritanceGift = pepDetails.additionalInfo;
      } else if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        INVESTMENT_ACCOUNT_CONFIG.ADDITIONAL_DECLARATION_TWO.OTHERS
      ) {
        this.investmentAccountFormData.otherSources = pepDetails.additionalInfo;
      } else {
      }
      this.commit();
    }
  }

  showGenericErrorModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'COMMON_ERRORS.API_FAILED.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'COMMON_ERRORS.API_FAILED.DESC'
    );
  }

  formatReturns(value) {
    if (value > 0) {
      return '+';
    } else {
      return '';
    }
  }

  restrictBackNavigation() {
    if (typeof history.pushState === 'function') {
      history.pushState('dummystate', null, null);
      window.onpopstate = () => {
        history.pushState('dummystate', null, null);
      };
    }
  }

  clearData() {
    this.clearInvestmentAccountFormData();
    if (window.sessionStorage) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(ACCOUNT_SUCCESS_COUNTER_KEY);
    }
  }
}
