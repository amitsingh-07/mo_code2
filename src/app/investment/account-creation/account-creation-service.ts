import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { EngagementJourneyService } from '../engagement-journey/engagement-journey.service';
import { ERoadmapStatus } from '../../shared/components/roadmap/roadmap.interface';
import { RoadmapService } from '../../shared/components/roadmap/roadmap.service';
import { ApiService } from '../../shared/http/api.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { SignUpService } from '../../sign-up/sign-up.service';
import { AccountCreationFormData } from './account-creation-form-data';
import { AccountCreationFormError } from './account-creation-form-error';
import {
    ACCOUNT_CREATION_ROADMAP, INVESTMENT_ACCOUNT_DDC2_ROADMAP, INVESTMENT_ACCOUNT_DDC_ROADMAP
} from './account-creation-roadmap';
import { ACCOUNT_CREATION_ROUTE_PATHS } from './account-creation-routes.constants';
import { ACCOUNT_CREATION_CONSTANTS } from './account-creation.constant';
import {
    IAddress, IEmployment, IHousehold, IPersonalDeclaration, IPersonalInfo,
    ISaveAccountCreationRequest
} from './account-creation.request';
import { PersonalInfo } from './personal-info/personal-info';
import { InvestmentApiService } from '../investment-api.service';

const SESSION_STORAGE_KEY = 'app_inv_account_session';
const ACCOUNT_SUCCESS_COUNTER_KEY = 'investment_account_success_counter';

@Injectable({
  providedIn: 'root'
})
export class AccountCreationService {
  disableAttributes = [];
  myInfoAttributes = ACCOUNT_CREATION_CONSTANTS.MY_INFO_ATTRIBUTES;

  private accountCreationFormData: AccountCreationFormData = new AccountCreationFormData();
  private accountCreationFormError: any = new AccountCreationFormError();

  constructor(
    private signUpService: SignUpService,
    private http: HttpClient,
    private apiService: ApiService,
    private investmentApiService: InvestmentApiService,
    public authService: AuthenticationService,
    private engagementJourneyService: EngagementJourneyService,
    public readonly translate: TranslateService,
    private modal: NgbModal,
    private roadmapService: RoadmapService
  ) {
    this.getInvestmentAccountFormData();
    this.setDefaultValueForFormData();
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(this.accountCreationFormData)
      );
    }
  }

  // Return the entire Form Data
  getInvestmentAccountFormData() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.accountCreationFormData = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE_KEY)
      );
    }
    return this.accountCreationFormData;
  }
  /* Residential Address */
  getCountriesFormData() {
    return this.accountCreationFormData.countryList;
  }
  isSingaporeResident() {
    const selectedNationality = this.accountCreationFormData.nationalityCode.toUpperCase();
    return (
      selectedNationality === ACCOUNT_CREATION_CONSTANTS.SINGAPORE_NATIONALITY_CODE ||
      this.accountCreationFormData.singaporeanResident
    );
  }
  isCountrySingapore(country) {
    if (country) {
      return country.countryCode === ACCOUNT_CREATION_CONSTANTS.SINGAPORE_COUNTRY_CODE;
    } else {
      return false;
    }
  }
  getCountryFromNationalityCode(nationalityCode) {
    let country;
    const selectedNationality = this.accountCreationFormData.nationalityList.filter(
      (nationality) => nationality.nationalityCode === nationalityCode
    );
    if (selectedNationality[0] && selectedNationality[0].countries[0]) {
      country = selectedNationality[0].countries[0];
    }
    return country;
  }
  getCountryFromCountryCode(countryCode) {
    let country = '';
    const selectedCountry = this.accountCreationFormData.countryList.filter(
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
    ACCOUNT_CREATION_CONSTANTS.PRIORITIZED_COUNTRY_LIST_CODES.forEach((countryCode) => {
      const filteredCountry = countryList.filter(
        (country) => country.countryCode === countryCode
      );
      sortedCountryList.push(filteredCountry[0]);
      countryList.splice(countryList.indexOf(filteredCountry[0]), 1);
    });
    this.engagementJourneyService.sortByProperty(countryList, 'name', 'asc');
    return sortedCountryList.concat(countryList);
  }
  setDefaultValueForFormData() {
    this.accountCreationFormData.isMailingAddressSame =
      ACCOUNT_CREATION_CONSTANTS.residential_info.isMailingAddressSame;
  }
  clearResidentialAddressFormData() {
    this.accountCreationFormData.country = null;
    this.accountCreationFormData.postalCode = null;
    this.accountCreationFormData.zipCode = null;
    this.accountCreationFormData.address1 = null;
    this.accountCreationFormData.address2 = null;
    this.accountCreationFormData.floor = null;
    this.accountCreationFormData.unitNo = null;
    this.accountCreationFormData.city = null;
    this.accountCreationFormData.state = null;
    this.accountCreationFormData.isMailingAddressSame = null;
  }
  setResidentialAddressFormData(data) {
    this.clearResidentialAddressFormData();
    if (data.country) {
      this.accountCreationFormData.country = data.country;
    }
    if (data.postalCode) {
      this.accountCreationFormData.postalCode = data.postalCode;
    }
    if (data.zipCode) {
      this.accountCreationFormData.zipCode = data.zipCode;
    }
    if (data.address1) {
      this.accountCreationFormData.address1 = data.address1;
    }
    if (data.address2) {
      this.accountCreationFormData.address2 = data.address2;
    }
    if (data.floor) {
      this.accountCreationFormData.floor = data.floor;
    }
    if (data.unitNo) {
      this.accountCreationFormData.unitNo = data.unitNo;
    }
    this.accountCreationFormData.city = data.city;
    this.accountCreationFormData.state = data.state;
    this.accountCreationFormData.isMailingAddressSame = data.isMailingAddressSame;
    if (!data.isMailingAddressSame) {
      this.setEmailingAddress(data);
    }
    this.commit();
  }

  clearEmailAddressFormData() {
    this.accountCreationFormData.reason = null;
    this.accountCreationFormData.reasonForOthers = null;
    this.accountCreationFormData.mailCountry = null;
    this.accountCreationFormData.mailPostalCode = null;
    this.accountCreationFormData.mailZipCode = null;
    this.accountCreationFormData.mailAddress1 = null;
    this.accountCreationFormData.mailAddress2 = null;
    this.accountCreationFormData.mailFloor = null;
    this.accountCreationFormData.mailUnitNo = null;
    this.accountCreationFormData.mailCity = null;
    this.accountCreationFormData.mailState = null;
  }
  setEmailingAddress(data) {
    this.clearEmailAddressFormData();
    if (data.mailingAddress.reason) {
      this.accountCreationFormData.reason = data.mailingAddress.reason;
    }
    if (data.mailingAddress.reasonForOthers) {
      this.accountCreationFormData.reasonForOthers =
        data.mailingAddress.reasonForOthers;
    }
    if (data.mailingAddress.mailCountry) {
      this.accountCreationFormData.mailCountry = data.mailingAddress.mailCountry;
    }
    if (data.mailingAddress.mailPostalCode) {
      this.accountCreationFormData.mailPostalCode = data.mailingAddress.mailPostalCode;
    }
    if (data.mailingAddress.mailZipCode) {
      this.accountCreationFormData.mailZipCode = data.mailingAddress.mailZipCode;
    }
    if (data.mailingAddress.mailAddress1) {
      this.accountCreationFormData.mailAddress1 = data.mailingAddress.mailAddress1;
    }
    if (data.mailingAddress.mailAddress2) {
      this.accountCreationFormData.mailAddress2 = data.mailingAddress.mailAddress2;
    }
    if (data.mailingAddress.mailFloor) {
      this.accountCreationFormData.mailFloor = data.mailingAddress.mailFloor;
    }
    if (data.mailingAddress.mailUnitNo) {
      this.accountCreationFormData.mailUnitNo = data.mailingAddress.mailUnitNo;
    }
    this.accountCreationFormData.mailCity = data.mailingAddress.mailCity;
    this.accountCreationFormData.mailState = data.mailingAddress.mailState;
  }

  clearTaxInfoFormData() {
    this.accountCreationFormData.taxObj = null;
    this.accountCreationFormData.taxCountry = null;
    this.accountCreationFormData.radioTin = null;
    this.accountCreationFormData.tinNumber = null;
    this.accountCreationFormData.noTinReason = null;
  }
  setTaxInfoFormData(data) {
    this.clearTaxInfoFormData();
    this.accountCreationFormData.taxObj = data;
    this.accountCreationFormData.taxCountry = data.taxCountry;
    this.accountCreationFormData.radioTin = data.radioTin;
    if (data.tinNumberText) {
      this.accountCreationFormData.tinNumber = data.tinNumberText.tinNumber;
    }
    if (data.reasonDropdown) {
      this.accountCreationFormData.noTinReason = data.reasonDropdown.noTinReason;
    }
    this.commit();
  }
  // tslint:disable-next-line
  getFormErrorList(form) {
    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.accountCreationFormError.formFieldErrors.errorTitle;
    for (const name in controls) {
      if (controls[name].invalid) {
        // HAS NESTED CONTROLS ?
        if (controls[name].controls) {
          const nestedControls = controls[name].controls;
          for (const nestedControlName in nestedControls) {
            if (nestedControls[nestedControlName].invalid) {
              // tslint:disable-next-line
              errors.errorMessages.push(
                this.accountCreationFormError.formFieldErrors[nestedControlName][
                  Object.keys(nestedControls[nestedControlName]['errors'])[0]
                ].errorMessage
              );
            }
          }
        } else {
          // NO NESTED CONTROLS
          // tslint:disable-next-line
          errors.errorMessages.push(
            this.accountCreationFormError.formFieldErrors[name][
              Object.keys(controls[name]['errors'])[0]
            ].errorMessage
          );
        }
      }
    }
    return errors;
  }

  getAddressUsingPostalCode(data) {
    return this.investmentApiService.getAddressUsingPostalCode(data);
  }

  getNationalityCountryList() {
    return this.investmentApiService.getNationalityCountryList();
  }
  getNationalityList() {
    return this.investmentApiService.getNationalityList();
  }
  getIndustryList() {
    return this.investmentApiService.getIndustryList();
  }
  getOccupationList() {
    return this.investmentApiService.getOccupationList();
  }
  getAllDropDownList() {
    return this.investmentApiService.getAllDropdownList();
  }
  getGeneratedFrom() {
    return this.investmentApiService.getAllDropdownList();
  }

  getInvestmentPeriod() {
    return this.investmentApiService.getInvestmentPeriod();
  }
  getTaxInfo() {
    return {
      tinNumber: this.accountCreationFormData.tinNumber,
      taxCountry: this.accountCreationFormData.taxCountry,
      radioTin: this.accountCreationFormData.radioTin,
      noTinReason: this.accountCreationFormData.noTinReason
    };
  }
  getPepData() {
    return this.accountCreationFormData.pep;
  }
  getOldPepData() {
    return this.accountCreationFormData.oldPep;
  }
  getBOStatus() {
    return this.accountCreationFormData.beneficial;
  }
  getPersonalDeclaration() {
    return {
      sourceOfIncome: this.accountCreationFormData.sourceOfIncome,
      ExistingEmploye: this.accountCreationFormData.ExistingEmploye,
      pep: this.accountCreationFormData.pep,
      beneficial: this.accountCreationFormData.beneficial
    };
  }

  clearPersonalDeclarationData() {
    this.accountCreationFormData.sourceOfIncome = null;
    this.accountCreationFormData.ExistingEmploye = null;
    this.accountCreationFormData.pep = null;
    this.accountCreationFormData.beneficial = null;
  }
  setPersonalDeclarationData(data) {
    this.clearPersonalDeclarationData();
    this.accountCreationFormData.sourceOfIncome = data.sourceOfIncome;
    this.accountCreationFormData.ExistingEmploye = data.radioEmploye;
    this.accountCreationFormData.pep = data.radioPEP;
    this.accountCreationFormData.beneficial = data.radioBeneficial;
    this.commit();
    return true;
  }

  clearNationalityFormData() {
    // #this.accountCreationFormData.nationalityList = null;
    // #this.accountCreationFormData.countryList = null;
    this.accountCreationFormData.nationalityCode = null;
    this.accountCreationFormData.nationality = null;
    this.accountCreationFormData.unitedStatesResident = null;
    this.accountCreationFormData.singaporeanResident = null;
  }

  setNationality(
    nationalityList: any,
    countryList: any,
    nationality: any,
    unitedStatesResident: any,
    singaporeanResident: any
  ) {
    this.clearNationalityFormData();
    this.accountCreationFormData.nationalityList = nationalityList;
    this.accountCreationFormData.countryList = countryList;
    this.accountCreationFormData.nationalityCode = nationality.nationalityCode;
    this.accountCreationFormData.nationality = nationality;
    this.accountCreationFormData.unitedStatesResident = unitedStatesResident;
    this.accountCreationFormData.singaporeanResident = singaporeanResident;
    this.commit();
  }

  setNationalitiesCountries(nationalityList: any, countryList: any) {
    this.accountCreationFormData.nationalityList = nationalityList;
    this.accountCreationFormData.countryList = countryList;
    this.commit();
  }

  clearPersonalInfo() {
    this.accountCreationFormData.salutation = null;
    this.accountCreationFormData.fullName = null;
    if (!this.accountCreationFormData.isMyInfoEnabled) {
      this.accountCreationFormData.nricNumber = null;
    }
    this.accountCreationFormData.dob = null;
    this.accountCreationFormData.gender = null;
    this.accountCreationFormData.birthCountry = null;
    this.accountCreationFormData.passportIssuedCountry = null;
    this.accountCreationFormData.race = null;
    this.accountCreationFormData.passportNumber = null;
    this.accountCreationFormData.passportExpiry = null;
  }
  setPersonalInfo(data: PersonalInfo) {
    this.clearPersonalInfo();
    if (data.fullName) {
      this.accountCreationFormData.fullName = data.fullName.toUpperCase();
    }
    if (data.nricNumber) {
      this.accountCreationFormData.nricNumber = data.nricNumber.toUpperCase();
    }
    if (data.passportNumber) {
      this.accountCreationFormData.passportNumber = data.passportNumber.toUpperCase();
    }
    if (data.passportExpiry) {
      this.accountCreationFormData.passportExpiry = data.passportExpiry;
    }
    if (data.dob) {
      this.accountCreationFormData.dob = data.dob;
    }
    if (data.gender) {
      this.accountCreationFormData.gender = data.gender;
    }
    this.accountCreationFormData.salutation = data.salutation;
    this.accountCreationFormData.birthCountry = data.birthCountry;
    this.accountCreationFormData.passportIssuedCountry = data.passportIssuedCountry;
    this.accountCreationFormData.race = data.race;
    this.commit();
  }
  getPersonalInfo() {
    return {
      fullName: this.accountCreationFormData.fullName,
      nricNumber: this.accountCreationFormData.nricNumber,
      passportNumber: this.accountCreationFormData.passportNumber,
      passportExpiry: this.accountCreationFormData.passportExpiry,
      dob: this.accountCreationFormData.dob,
      gender: this.accountCreationFormData.gender
    };
  }
  getEmployementDetails() {
    return {
      employmentStatus: this.accountCreationFormData.employmentStatus,
      companyName: this.accountCreationFormData.companyName,
      occupation: this.accountCreationFormData.occupation,
      industry: this.accountCreationFormData.industry,
      contactNumber: this.accountCreationFormData.contactNumber,
      otherIndustry: this.accountCreationFormData.otherIndustry,
      otherOccupation: this.accountCreationFormData.otherOccupation,
      empCountry: this.accountCreationFormData.empCountry,
      empPostalCode: this.accountCreationFormData.empPostalCode,
      empAddress1: this.accountCreationFormData.empAddress1,
      empAddress2: this.accountCreationFormData.empAddress2,
      empFloor: this.accountCreationFormData.empFloor,
      empUnitNo: this.accountCreationFormData.empUnitNo,
      empCity: this.accountCreationFormData.empCity,
      empState: this.accountCreationFormData.empState,
      empZipCode: this.accountCreationFormData.empZipCode
    };
  }

  clearEmployeAddressFormData() {
    this.accountCreationFormData.employmentStatus = null;
    this.accountCreationFormData.companyName = null;
    this.accountCreationFormData.occupation = null;
    this.accountCreationFormData.otherOccupation = null;
    this.accountCreationFormData.industry = null;
    this.accountCreationFormData.otherIndustry = null;
    this.accountCreationFormData.contactNumber = null;
    this.accountCreationFormData.empCountry = null;
    this.accountCreationFormData.empPostalCode = null;
    this.accountCreationFormData.empAddress1 = null;
    this.accountCreationFormData.empAddress2 = null;
    this.accountCreationFormData.empFloor = null;
    this.accountCreationFormData.empUnitNo = null;
    this.accountCreationFormData.empCity = null;
    this.accountCreationFormData.empState = null;
    this.accountCreationFormData.empZipCode = null;
  }
  setEmployeAddressFormData(data) {
    this.clearEmployeAddressFormData();
    if (data.employmentStatus !== 'Unemployed') {
      this.accountCreationFormData.employmentStatus = data.employmentStatus;
      if (data.companyName) {
        this.accountCreationFormData.companyName = data.companyName;
      }
      if (data.occupation) {
        this.accountCreationFormData.occupation = data.occupation;
      }
      if (data.otherOccupation) {
        this.accountCreationFormData.otherOccupation = data.otherOccupation;
      }
      this.accountCreationFormData.industry = data.industry;
      if (data.otherIndustry) {
        this.accountCreationFormData.otherIndustry = data.otherIndustry;
      }
      this.accountCreationFormData.contactNumber = data.contactNumber;
      this.accountCreationFormData.empCountry = data.employeaddress.empCountry;
      this.accountCreationFormData.empPostalCode = data.employeaddress.empPostalCode;
      this.accountCreationFormData.empAddress1 = data.employeaddress.empAddress1;
      this.accountCreationFormData.empAddress2 = data.employeaddress.empAddress2;
      this.accountCreationFormData.empFloor = data.employeaddress.empFloor;
      this.accountCreationFormData.empUnitNo = data.employeaddress.empUnitNo;
      this.accountCreationFormData.empCity = data.employeaddress.empCity;
      this.accountCreationFormData.empState = data.employeaddress.empState;
      this.accountCreationFormData.empZipCode = data.employeaddress.empZipCode;
    } else {
      this.accountCreationFormData.employmentStatus = data.employmentStatus;
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

  clearAdditionalInfoFormData() {
    this.accountCreationFormData.pepFullName = null;
    this.accountCreationFormData.cName = null;
    this.accountCreationFormData.pepoccupation = null;
    this.accountCreationFormData.pepOtherOccupation = null;
    this.accountCreationFormData.pepCountry = null;
    this.accountCreationFormData.pepPostalCode = null;
    this.accountCreationFormData.pepAddress1 = null;
    this.accountCreationFormData.pepAddress2 = null;
    this.accountCreationFormData.pepFloor = null;
    this.accountCreationFormData.pepUnitNo = null;
    this.accountCreationFormData.pepCity = null;
    this.accountCreationFormData.pepState = null;
    this.accountCreationFormData.pepZipCode = null;
  }
  // Additional info pep data
  setAdditionalInfoFormData(data) {
    this.clearAdditionalInfoFormData();
    this.accountCreationFormData.pepFullName = data.pepFullName;
    this.accountCreationFormData.cName = data.cName;
    this.accountCreationFormData.pepoccupation = data.pepoccupation;
    this.accountCreationFormData.pepOtherOccupation = data.pepOtherOccupation;
    this.accountCreationFormData.pepCountry = data.pepCountry;
    this.accountCreationFormData.pepPostalCode = data.pepPostalCode;
    this.accountCreationFormData.pepAddress1 = data.pepAddress1;
    this.accountCreationFormData.pepAddress2 = data.pepAddress2;
    this.accountCreationFormData.pepFloor = data.pepFloor;
    this.accountCreationFormData.pepUnitNo = data.pepUnitNo;
    this.accountCreationFormData.pepCity = data.pepCity;
    this.accountCreationFormData.pepState = data.pepState;
    this.accountCreationFormData.pepZipCode = data.pepZipCode;
    this.commit();
  }

  setEmploymentStatusList(list) {
    this.accountCreationFormData.employmentStatusList = list;
    this.commit();
  }

  setOptionList(list) {
    this.accountCreationFormData.optionList = list;
    this.commit();
  }

  getOptionList() {
    return this.accountCreationFormData.optionList;
  }

  // Upload Document
  uploadDocument(formData) {
    return this.investmentApiService.uploadDocument(formData);
  }

  saveAdditionalDeclarations() {
    const payload = this.additionalDeclarationsRequest();
    return this.investmentApiService.saveInvestmentAccount(payload);
  }

  saveInvestmentAccount() {
    const payload = this.constructSaveInvestmentAccountRequest();
    return this.investmentApiService.saveInvestmentAccount(payload);
  }

  // Select Nationality
  saveNationality(data) {
    const payload = this.constructSaveNationalityRequest(data);
    return this.investmentApiService.saveNationality(payload);
  }
  createInvestmentAccount() {
    return this.investmentApiService.createInvestmentAccount();
  }

  verifyAML() {
    return this.investmentApiService.verifyAML();
  }

  clearFinancialFormData() {
    this.accountCreationFormData.annualHouseHoldIncomeRange = null;
    this.accountCreationFormData.numberOfHouseHoldMembers = null;
  }
  setFinancialFormData(data) {
    this.clearFinancialFormData();
    if (data.annualHouseHoldIncomeRange) {
      this.accountCreationFormData.annualHouseHoldIncomeRange =
        data.annualHouseHoldIncomeRange;
    }
    this.accountCreationFormData.numberOfHouseHoldMembers =
      data.numberOfHouseHoldMembers;
    this.commit();
  }
  getFinancialFormData() {
    return {
      annualHouseHoldIncomeRange: this.accountCreationFormData
        .annualHouseHoldIncomeRange,
      numberOfHouseHoldMembers: this.accountCreationFormData.numberOfHouseHoldMembers
    };
  }

  setCallBackInvestmentAccount() {
    this.accountCreationFormData.callBackInvestmentAccount = true;
    this.commit();
  }

  getCallBackInvestmentAccount() {
    return this.accountCreationFormData.callBackInvestmentAccount;
  }

  setMyInfoFormData(data) {
    if (data.name && data.name.value) {
      this.accountCreationFormData.fullName = data.name.value;
    }
    this.disableAttributes.push('fullName');
    if (data.nationality.value) {
      this.accountCreationFormData.nationalityCode = data.nationality.value;
      this.disableAttributes.push('nationality');
    }
    this.setMyInfoPersonal(data);
    this.setMyInfoResidentialAddress(data);

    // Employer name
    if (data.employment && data.employment.value) {
      this.accountCreationFormData.companyName = data.employment.value;
      this.disableAttributes.push('companyName');
      this.disableAttributes.push('employmentStatus');
    } else {
      this.disableAttributes.push('employmentStatus');
    }

    // Occupation
    if (data.occupation && data.occupation.occupationDetails) {
      this.accountCreationFormData.occupation = data.occupation.occupationDetails;
      this.disableAttributes.push('occupation');
      if (data.occupation.occupationDetails.occupation &&
        data.occupation.occupationDetails.occupation.toUpperCase() === ACCOUNT_CREATION_CONSTANTS.OTHERS.toUpperCase()) {
        this.accountCreationFormData.otherOccupation = data.occupation.desc;
        this.disableAttributes.push('otherOccupation');
      }
    }

    // Monthly Household Income
    if (data.householdincome && data.householdincome.householdDetails) {
      this.accountCreationFormData.annualHouseHoldIncomeRange =
        data.householdincome.householdDetails;
      this.disableAttributes.push('annualHouseHoldIncomeRange');
    }
    this.accountCreationFormData.disableAttributes = this.disableAttributes;
    this.accountCreationFormData.isMyInfoEnabled = true;
    this.commit();
  }

  // MyInfo - Personal data
  setMyInfoPersonal(data) {
    if (data.uin) {
      this.accountCreationFormData.nricNumber = data.uin.toUpperCase();
      this.disableAttributes.push('nricNumber');
    }
    if (data.passportnumber && data.passportnumber.value) {
      this.accountCreationFormData.passportNumber = data.passportnumber.value.toUpperCase();
      this.disableAttributes.push('passportNumber');
    }
    if (data.passportexpirydate && data.passportexpirydate.value) {
      this.accountCreationFormData.passportExpiry = this.dateFormat(
        data.passportexpirydate.value
      );
      this.disableAttributes.push('passportExpiry');
    }
    if (data.dob.value) {
      this.accountCreationFormData.dob = this.dateFormat(data.dob.value);
      this.disableAttributes.push('dob');
    }
    if (data.sex.value === 'M') {
      this.accountCreationFormData.gender = 'male';
      this.disableAttributes.push('gender');
    } else if (data.sex.value === 'F') {
      this.accountCreationFormData.gender = 'female';
      this.disableAttributes.push('gender');
    }
    if (data.birthcountry && data.birthcountry.countryDetails) {
      this.accountCreationFormData.birthCountry = this.getCountryObject(data.birthcountry.countryDetails);
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
        this.accountCreationFormData.country = this.getCountryObject(data.regadd.countryDetails);
        this.disableAttributes.push('country');
      }
      if (data.regadd.floor) {
        this.accountCreationFormData.floor = data.regadd.floor;
        this.disableAttributes.push('floor');
      }
      if (data.regadd.unit) {
        this.accountCreationFormData.unitNo = data.regadd.unit;
        this.disableAttributes.push('unitNo');
      }
      if (data.regadd.block) {
        this.accountCreationFormData.address1 = 'Block ' + data.regadd.block;
        this.disableAttributes.push('address1');
      }
      if (data.regadd.street) {
        this.accountCreationFormData.address2 = data.regadd.street;
        this.disableAttributes.push('address2');
      }
      if (data.regadd.postal) {
        this.accountCreationFormData.postalCode = data.regadd.postal;
        this.accountCreationFormData.zipCode = data.regadd.postal;
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
      this.accountCreationFormData.mailCountry = this.getCountryObject(data.mailadd.countryDetails);
      this.disableAttributes.push('mailCountry');
      emailAddressExist = true;
    }
    if (data.mailadd.floor) {
      this.accountCreationFormData.mailFloor = data.mailadd.floor;
      this.disableAttributes.push('mailFloor');
      emailAddressExist = true;
    }
    if (data.mailadd.unit) {
      this.accountCreationFormData.mailUnitNo = data.mailadd.unit;
      this.disableAttributes.push('mailUnitNo');
      emailAddressExist = true;
    }
    if (data.mailadd.block) {
      this.accountCreationFormData.mailAddress1 = 'Block ' + data.mailadd.block;
      this.disableAttributes.push('mailAddress1');
      emailAddressExist = true;
    }
    if (data.mailadd.street) {
      this.accountCreationFormData.mailAddress2 = data.mailadd.street;
      this.disableAttributes.push('mailAddress2');
      emailAddressExist = true;
    }
    if (data.mailadd.postal) {
      this.accountCreationFormData.mailPostalCode = data.mailadd.postal;
      this.accountCreationFormData.mailZipCode = data.mailadd.postal;
      this.disableAttributes.push('mailZipCode');
      this.disableAttributes.push('mailPostalCode');
      emailAddressExist = true;
    }
    if (emailAddressExist) {
      this.accountCreationFormData.isMailingAddressSame = false;
    } else {
      this.accountCreationFormData.isMailingAddressSame = true;
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
      this.accountCreationFormData.isMyInfoEnabled &&
      this.accountCreationFormData.disableAttributes.indexOf(fieldName) >= 0
    ) {
      if (ACCOUNT_CREATION_CONSTANTS.DISABLE_FIELDS_FOR_NON_SG.indexOf(fieldName) >= 0 && this.isSingaporeResident()) {
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
    return this.accountCreationFormData.isMyInfoEnabled;
  }

  setMyInfoStatus(status) {
    this.accountCreationFormData.isMyInfoEnabled = status;
    this.commit();
  }

  getAdditionDeclaration() {
    return {
      source: this.accountCreationFormData.source,
      expectedNumberOfTransation: this.accountCreationFormData
        .expectedNumberOfTransation,
      expectedAmountPerTranction: this.accountCreationFormData
        .expectedAmountPerTranction,
      personalSavings: this.accountCreationFormData.personalSavings,

      inheritanceGift: this.accountCreationFormData.inheritanceGift,
      investmentEarnings: this.accountCreationFormData.investmentEarnings,
      durationInvestment: this.accountCreationFormData.durationInvestment,
      earningsGenerated: this.accountCreationFormData.earningsGenerated,
      otherSources: this.accountCreationFormData.otherSources
    };
  }

  clearAdditionDeclaration() {
    this.accountCreationFormData.expectedNumberOfTransation = null;
    this.accountCreationFormData.expectedAmountPerTranction = null;
    this.accountCreationFormData.source = null;
    this.accountCreationFormData.personalSavings = null;
    this.accountCreationFormData.inheritanceGift = null;
    this.accountCreationFormData.otherSources = null;
    this.accountCreationFormData.durationInvestment = null;
    this.accountCreationFormData.earningsGenerated = null;
  }
  setAdditionDeclaration(data) {
    this.clearAdditionDeclaration();
    this.accountCreationFormData.expectedNumberOfTransation =
      data.expectedNumberOfTransation;
    this.accountCreationFormData.expectedAmountPerTranction =
      data.expectedAmountPerTranction;
    this.accountCreationFormData.source = data.source;
    if (data.personalSavingForm) {
      this.accountCreationFormData.personalSavings =
        data.personalSavingForm.personalSavings;
    }
    if (data.inheritanceGiftFrom) {
      this.accountCreationFormData.inheritanceGift =
        data.inheritanceGiftFrom.inheritanceGift;
    }
    if (data.othersFrom) {
      this.accountCreationFormData.otherSources = data.othersFrom.otherSources;
    }
    if (data.investmentEarnings) {
      this.accountCreationFormData.durationInvestment =
        data.investmentEarnings.durationInvestment;
      this.accountCreationFormData.earningsGenerated =
        data.investmentEarnings.earningsGenerated;
    }
    this.commit();
    return true;
  }

  setFundyourAccount(data) {
    this.accountCreationFormData.Investment = data.Investment;
    this.accountCreationFormData.oneTimeInvestmentAmount = data.oneTimeInvestmentAmount;
    this.accountCreationFormData.portfolio = data.portfolio;
    this.accountCreationFormData.topupportfolioamount = data.topupportfolioamount;
    this.accountCreationFormData.MonthlyInvestmentAmount = data.MonthlyInvestmentAmount;
  }
  getPortfolioAllocationDetails(params) {
    const urlParams = this.engagementJourneyService.buildQueryString(params);
    return this.investmentApiService.getPortfolioAllocationDetails(urlParams);
  }

  updateInvestment(params) {
    return this.investmentApiService.updateInvestment(params);
  }

  additionalDeclarationsRequest() {
    const payload = this.getInvestmentAccountFormData();
    const request = {} as ISaveAccountCreationRequest;
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
    const request = {} as ISaveAccountCreationRequest;
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
        unitNumber: data.mailUnitNo,
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
          tinNumber: item.radioTin ? item.tinNumber.toUpperCase() : null,
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
        firstName: data.pepFullName,
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
            ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
            ? data.durationInvestment
            : null,
        earningSourceId:
          data.source &&
            data.source.key ===
            ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
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
    const employmentStatus = this.accountCreationFormData.employmentStatusList.filter(
      (status) => status.name === name
    );
    return employmentStatus[0];
  }

  getadditionalInfoDesc(data) {
    let additionalDesc = '';
    if (data.source) {
      if (
        data.source.key ===
        ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.PERSONAL_SAVING
      ) {
        additionalDesc = data.personalSavings;
      } else if (
        data.source.key ===
        ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.GIFT_INHERITANCE
      ) {
        additionalDesc = data.inheritanceGift;
      } else if (
        data.source.key === ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.OTHERS
      ) {
        additionalDesc = data.otherSources;
      }
    }

    return additionalDesc;
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
    this.accountCreationFormData.nationalityCode =
      data.contactDetails.homeAddress.country.nationalityCode;
    this.accountCreationFormData.nationality = data.contactDetails.homeAddress.country;
    this.accountCreationFormData.singaporeanResident = isSingaporeResident;
    this.accountCreationFormData.nationalityList = nationalityList;
    this.accountCreationFormData.countryList = countryList;
    this.accountCreationFormData.resUploadedPath = resProof;
    this.accountCreationFormData.mailingUploadedPath = mailingProof;
    if (data.contactDetails.homeAddress.country) {
      this.accountCreationFormData.country = data.contactDetails.homeAddress.country;
    }
    if (data.contactDetails.homeAddress.postalCode) {
      this.accountCreationFormData.postalCode =
        data.contactDetails.homeAddress.postalCode;
    }
    if (data.contactDetails.homeAddress.addressLine1) {
      this.accountCreationFormData.address1 =
        data.contactDetails.homeAddress.addressLine1;
    }
    if (data.contactDetails.homeAddress.addressLine2) {
      this.accountCreationFormData.address2 =
        data.contactDetails.homeAddress.addressLine2;
    }
    if (data.contactDetails.homeAddress.unitNumber) {
      this.accountCreationFormData.unitNo = data.contactDetails.homeAddress.unitNumber;
    }
    if (data.contactDetails.homeAddress.floor) {
      this.accountCreationFormData.floor = data.contactDetails.homeAddress.floor;
    }
    if (data.contactDetails.homeAddress.city) {
      this.accountCreationFormData.city = data.contactDetails.homeAddress.city;
    }
    if (data.contactDetails.homeAddress.zipcode) {
      this.accountCreationFormData.zipCode = data.contactDetails.homeAddress.zipCode;
    }
    if (data.contactDetails.homeAddress.state) {
      this.accountCreationFormData.state = data.contactDetails.homeAddress.state;
    }
    this.accountCreationFormData.isMailingAddressSame = isMailingAddressSame;
    if (!isMailingAddressSame) {
      if (data.contactDetails.mailingAddress.country) {
        this.accountCreationFormData.mailCountry =
          data.contactDetails.mailingAddress.country;
      }
      if (data.contactDetails.mailingAddress.postalCode) {
        this.accountCreationFormData.mailPostalCode =
          data.contactDetails.mailingAddress.postalCode;
      }
      if (data.contactDetails.mailingAddress.addressLine1) {
        this.accountCreationFormData.mailAddress1 =
          data.contactDetails.mailingAddress.addressLine1;
      }
      if (data.contactDetails.mailingAddress.addressLine2) {
        this.accountCreationFormData.mailAddress2 =
          data.contactDetails.mailingAddress.addressLine2;
      }
      if (data.contactDetails.mailingAddress.unitNumber) {
        this.accountCreationFormData.mailUnitNo =
          data.contactDetails.mailingAddress.unitNumber;
      }
      if (data.contactDetails.mailingAddress.floor) {
        this.accountCreationFormData.mailFloor =
          data.contactDetails.mailingAddress.floor;
      }
      if (data.contactDetails.mailingAddress.state) {
        this.accountCreationFormData.mailState =
          data.contactDetails.mailingAddress.state;
      }
      if (data.contactDetails.mailingAddress.city) {
        this.accountCreationFormData.mailCity = data.contactDetails.mailingAddress.city;
      }
      if (data.contactDetails.mailingAddress.zipCode) {
        this.accountCreationFormData.mailZipCode =
          data.contactDetails.mailingAddress.zipCode;
      }
    }
    this.commit();
  }
  // tslint:disable-next-line:cognitive-complexity
  setEditProfileEmployeInfo(data, nationalityList, countryList, isSingaporeResident) {
    this.accountCreationFormData.nationalityCode =
      data.contactDetails.homeAddress.country.nationalityCode;
    this.accountCreationFormData.nationality = data.contactDetails.homeAddress.country;
    this.accountCreationFormData.singaporeanResident = isSingaporeResident;
    this.accountCreationFormData.nationalityList = nationalityList;
    this.accountCreationFormData.countryList = countryList;
    this.accountCreationFormData.employmentStatus =
      data.employmentDetails.employmentStatus.name;
    if (data.employmentDetails.employmentStatus.name !== 'Unemployed') {
      if (data.employmentDetails.employerDetails.detailedEmployerDetails) {
        if (data.employmentDetails.employerDetails.detailedEmployerDetails.employerName) {
          // tslint:disable-next-line:max-line-length
          this.accountCreationFormData.companyName =
            data.employmentDetails.employerDetails.detailedEmployerDetails.employerName;
        }
        if (data.employmentDetails.employerDetails.detailedEmployerDetails.industry) {
          this.accountCreationFormData.industry =
            data.employmentDetails.employerDetails.detailedEmployerDetails.industry;
        }
        if (
          data.employmentDetails.employerDetails.detailedEmployerDetails.otherIndustry
        ) {
          this.accountCreationFormData.otherIndustry =
            data.employmentDetails.employerDetails.detailedEmployerDetails.otherIndustry;
        }
        if (data.employmentDetails.employerDetails.employerContact) {
          this.accountCreationFormData.contactNumber =
            data.employmentDetails.employerDetails.employerContact;
        }
      }
      if (data.employmentDetails.occupation.occupation) {
        this.accountCreationFormData.occupation = data.employmentDetails.occupation;
      }
      if (data.employmentDetails.otherOccupation) {
        this.accountCreationFormData.otherOccupation =
          data.employmentDetails.otherOccupation;
      }

      if (data.employmentDetails.employerDetails.detailedEmployerDetails) {
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empCountry =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.country;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empPostalCode =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.postalCode;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empAddress1 =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.addressLine1;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empAddress2 =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.addressLine2;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empFloor =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.floor;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empUnitNo =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.unitNumber;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empCity =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.city;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empState =
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.state;
        // tslint:disable-next-line:max-line-length
        this.accountCreationFormData.empZipCode =
          // tslint:disable-next-line:max-line-length
          data.employmentDetails.employerDetails.detailedemployerAddress.employerAddress.postalCode; // discussed and only one feild name is available in backend
      }
    }
    this.commit();
  }
  setEditProfileBankDetail(fullName, bank, accountNumber, id, isAddBank) {
    if (isAddBank) {
      this.accountCreationFormData.accountHolderName = fullName;
      this.accountCreationFormData.bank = bank;
      this.accountCreationFormData.accountNumber = accountNumber;
    } else {
      if (fullName) {
        this.accountCreationFormData.accountHolderName = fullName;
      }
      if (bank) {
        this.accountCreationFormData.bank = bank;
      }
      if (accountNumber) {
        this.accountCreationFormData.accountNumber = accountNumber;
      }
      if (id) {
        this.accountCreationFormData.bankUpdateId = id;
      }
    }
    this.commit();
  }
  getBankInfo() {
    return {
      fullName: this.accountCreationFormData.accountHolderName,
      bank: this.accountCreationFormData.bank,
      accountNumber: this.accountCreationFormData.accountNumber,
      id: this.accountCreationFormData.bankUpdateId
    };
  }
  // tslint:disable-next-line:no-identical-functions
  // tslint:disable-next-line:cognitive-complexity
  editResidentialAddressFormData(data) {
    if (data.country) {
      this.accountCreationFormData.country = data.country;
    }
    if (data.postalCode) {
      this.accountCreationFormData.postalCode = data.postalCode;
    }
    if (data.zipCode) {
      this.accountCreationFormData.zipCode = data.zipCode;
    }
    if (data.address1) {
      this.accountCreationFormData.address1 = data.address1;
    }
    if (data.address2) {
      this.accountCreationFormData.address2 = data.address2;
    }
    if (data.floor) {
      this.accountCreationFormData.floor = data.floor;
    }
    if (data.unitNo) {
      this.accountCreationFormData.unitNo = data.unitNo;
    }
    if (data.city) {
      this.accountCreationFormData.city = data.city;
    }
    if (data.state) {
      this.accountCreationFormData.state = data.state;
    }
    if (data.isMailingAddressSame) {
      this.accountCreationFormData.isMailingAddressSame = data.isMailingAddressSame;
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
    this.accountCreationFormData.invOneTime = data.initialInvestment;
    this.accountCreationFormData.invMonthly = data.monthlyInvestment;
    this.accountCreationFormData.riskProfileId = data.riskProfile.id;
    this.accountCreationFormData.riskProfileType = data.riskProfile.type;
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
    this.accountCreationFormData.nationality = nationality;
    this.accountCreationFormData.nationalityCode = nationality.nationalityCode;
    this.accountCreationFormData.beneficial = beneficialOwner;
    this.accountCreationFormData.pep = pep;
    this.accountCreationFormData.isMyInfoEnabled = myInfoVerified;
    this.commit();
  }

  setAccountCreationStatus(status) {
    this.accountCreationFormData.accountCreationStatus = status;
    this.commit();
  }

  getAccountCreationStatus() {
    return this.accountCreationFormData.accountCreationStatus;
  }

  getMyInfoStatus() {
    return this.accountCreationFormData.isMyInfoEnabled;
  }

  clearInvestmentAccountFormData() {
    this.accountCreationFormData = new AccountCreationFormData();
    this.commit();
  }

  getPropertyFromName(name, arrayKey) {
    const filteredObj = this.accountCreationFormData.optionList[arrayKey].filter(
      (prop) => prop.name === name
    );
    return filteredObj[0];
  }

  getPropertyFromId(id, arrayKey) {
    const filteredObj = this.accountCreationFormData.optionList[arrayKey].filter(
      (prop) => prop.id === id
    );
    return filteredObj[0];
  }

  getPropertyFromValue(value, arrayKey) {
    const filteredObj = this.accountCreationFormData.optionList[arrayKey].filter(
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
    this.clearNationalityFormData();
    this.accountCreationFormData.nationalityCode =
      identityDetails.customer.nationalityCode;
    this.accountCreationFormData.nationality = this.getNationalityFromNationalityCode(
      this.accountCreationFormData.nationalityList,
      identityDetails.customer.nationalityCode
    );
    this.accountCreationFormData.unitedStatesResident = false; // TODO : VERIFY
    if (additionalDetails) {
      this.accountCreationFormData.singaporeanResident =
        additionalDetails.isSingaporePR;
    }
    this.commit();
  }
  setPersonalInfoFromApi(identityDetails) {
    this.clearPersonalInfo();
    this.accountCreationFormData.salutation = this.getPropertyFromName(
      identityDetails.customer.salutation,
      'salutation'
    );
    this.accountCreationFormData.fullName = identityDetails.customer.nricName;
    this.accountCreationFormData.nricNumber = identityDetails.nricNumber ? identityDetails.nricNumber.toUpperCase() : '';
    this.accountCreationFormData.dob = this.dateFormatFromApi(
      identityDetails.customer.dateOfBirth
    );
    this.accountCreationFormData.gender = identityDetails.customer.gender;
    this.accountCreationFormData.birthCountry = this.getCountryFromCountryCode(
      identityDetails.customer.countryOfBirth.countryCode
    );
    this.accountCreationFormData.passportIssuedCountry = this.getCountryFromCountryCode(
      identityDetails.passportIssuedCountry.countryCode
    );
    this.accountCreationFormData.race = this.getPropertyFromName(
      identityDetails.customer.race,
      'race'
    );
    this.accountCreationFormData.passportNumber = identityDetails.passportNumber ? identityDetails.passportNumber.toUpperCase() : '';
    this.accountCreationFormData.passportExpiry = this.dateFormatFromApi(
      identityDetails.passportExpiryDate
    );
    this.commit();
  }
  setResidentialAddressDetailsFromApi(customer) {
    this.clearResidentialAddressFormData();
    this.clearEmailAddressFormData();
    this.accountCreationFormData.country = this.getCountryFromCountryCode(
      customer.homeAddress.countryCode
    );
    this.accountCreationFormData.address1 = customer.homeAddress.addressLine1;
    this.accountCreationFormData.address2 = customer.homeAddress.addressLine2;
    this.accountCreationFormData.city = customer.homeAddress.city;
    this.accountCreationFormData.state = customer.homeAddress.state;
    this.accountCreationFormData.floor = customer.homeAddress.floor;
    this.accountCreationFormData.unitNo = customer.homeAddress.unitNumber;
    this.accountCreationFormData.isMailingAddressSame = customer.mailingAddress
      ? false
      : true;
    this.accountCreationFormData.reason = this.getPropertyFromId(
      customer.differentMailingAddressReasonId,
      'differentAddressReason'
    );
    this.accountCreationFormData.reasonForOthers =
      customer.differentMailingAddressReason;
    if (this.isCountrySingapore(customer.homeAddress.country)) {
      this.accountCreationFormData.postalCode = customer.homeAddress.postalCode;
    } else {
      this.accountCreationFormData.zipCode = customer.homeAddress.postalCode;
    }
    if (customer.mailingAddress) {
      this.accountCreationFormData.mailCountry = this.getCountryFromCountryCode(
        customer.mailingAddress.country.countryCode
      );
      this.accountCreationFormData.mailAddress1 = customer.mailingAddress.addressLine1;
      this.accountCreationFormData.mailAddress2 = customer.mailingAddress.addressLine2;
      this.accountCreationFormData.mailCity = customer.mailingAddress.city;
      this.accountCreationFormData.mailFloor = customer.mailingAddress.floor;
      this.accountCreationFormData.mailUnitNo = customer.mailingAddress.unitNumber;
      this.accountCreationFormData.mailState = customer.mailingAddress.state;
      if (this.isCountrySingapore(customer.mailingAddress.country)) {
        this.accountCreationFormData.mailPostalCode =
          customer.mailingAddress.postalCode;
      } else {
        this.accountCreationFormData.mailZipCode = customer.mailingAddress.postalCode;
      }
    }
    this.commit();
  }
  setEmploymentDetailsFromApi(employmentInformation) {
    this.clearEmployeAddressFormData();
    const empStatusObj = this.getPropertyFromId(
      employmentInformation.customerEmploymentDetails.employmentStatusId,
      'employmentStatus'
    );
    this.accountCreationFormData.employmentStatus = empStatusObj.name;
    this.accountCreationFormData.companyName =
      employmentInformation.employerDetails.employerName;
    this.accountCreationFormData.industry =
      employmentInformation.employerDetails.industry;
    this.accountCreationFormData.otherIndustry =
      employmentInformation.employerDetails.otherIndustry;
    this.accountCreationFormData.occupation =
      employmentInformation.customerEmploymentDetails.occupation;
    this.accountCreationFormData.otherOccupation =
      employmentInformation.customerEmploymentDetails.otherOccupation; // TODO : VERIFY
    this.accountCreationFormData.contactNumber =
      employmentInformation.employerAddress.contactNumber;
    if (employmentInformation.employerAddress.employerAddress.country) {
      this.accountCreationFormData.empCountry = this.getCountryFromCountryCode(
        employmentInformation.employerAddress.employerAddress.country.countryCode
      );
    }
    if (
      this.isCountrySingapore(
        employmentInformation.employerAddress.employerAddress.country
      )
    ) {
      this.accountCreationFormData.empPostalCode =
        employmentInformation.employerAddress.employerAddress.postalCode;
    } else {
      this.accountCreationFormData.empZipCode =
        employmentInformation.employerAddress.employerAddress.postalCode;
    }
    this.accountCreationFormData.empAddress1 =
      employmentInformation.employerAddress.employerAddress.addressLine1;
    this.accountCreationFormData.empAddress2 =
      employmentInformation.employerAddress.employerAddress.addressLine2;
    this.accountCreationFormData.empCity =
      employmentInformation.employerAddress.employerAddress.city;
    this.accountCreationFormData.empState =
      employmentInformation.employerAddress.employerAddress.state;
    this.accountCreationFormData.empFloor =
      employmentInformation.employerAddress.employerAddress.floor;
    this.accountCreationFormData.empUnitNo =
      employmentInformation.employerAddress.employerAddress.unitNumber;
    this.commit();
  }
  setFinancialDetailsFromApi(customer, income) {
    this.clearFinancialFormData();
    this.accountCreationFormData.annualHouseHoldIncomeRange =
      customer && customer.houseHoldDetail && customer.houseHoldDetail.houseHoldIncome
        ? customer.houseHoldDetail.houseHoldIncome
        : null;
    this.accountCreationFormData.numberOfHouseHoldMembers =
      customer && customer.houseHoldDetail && customer.houseHoldDetail.numberOfMembers
        ? customer.houseHoldDetail.numberOfMembers
        : null;
    this.commit();
  }
  setTaxInfoFromApi(taxDetails) {
    this.clearTaxInfoFormData();
    const taxList = [];
    taxDetails.map((item) => {
      const taxInfo = {
        taxCountry: this.getCountryFromCountryCode(item.taxCountry.countryCode),
        radioTin: item.tinNumber ? true : false,
        tinNumber: item.tinNumber ? item.tinNumber.toUpperCase() : '',
        noTinReason: this.getPropertyFromId(parseInt(item.noTinReason, 10), 'noTinReason')
      };
      taxList.push(taxInfo);
    });
    if (taxList && taxList.length > 0) {
      this.accountCreationFormData.taxObj = {
        addTax: taxList
      };
    }
    this.commit();
  }
  setPersonalDeclarationFromApi(investmentObjective, additionalDetails) {
    this.clearPersonalDeclarationData();
    this.accountCreationFormData.sourceOfIncome = investmentObjective
      ? investmentObjective.investmentSource
      : null;
    if (additionalDetails) {
      this.accountCreationFormData.ExistingEmploye =
        additionalDetails.connectedToInvestmentFirm;
      this.accountCreationFormData.pep = additionalDetails.politicallyExposed;
      this.accountCreationFormData.oldPep = additionalDetails.politicallyExposed;
      this.accountCreationFormData.beneficial = additionalDetails.beneficialOwner;
    }

    this.commit();
  }
  setDueDiligence1FromApi(pepDetails) {
    this.clearAdditionalInfoFormData();
    if (pepDetails) {
      this.accountCreationFormData.pepFullName = pepDetails.firstName;
      this.accountCreationFormData.cName = pepDetails.companyName;
      this.accountCreationFormData.pepoccupation = pepDetails.occupation;
      this.accountCreationFormData.pepOtherOccupation = pepDetails.otherOccupation;
      if (pepDetails.pepAddress && pepDetails.pepAddress.country && pepDetails.pepAddress.country.countryCode) {
        this.setPepAddress(pepDetails);
      }
      this.commit();
    }
  }
  setPepAddress(pepDetails) {
    this.accountCreationFormData.pepCountry = this.getCountryFromCountryCode(
      pepDetails.pepAddress.country.countryCode
    );
    this.accountCreationFormData.pepPostalCode = pepDetails.pepAddress.postalCode;
    this.accountCreationFormData.pepAddress1 = pepDetails.pepAddress.addressLine1;
    this.accountCreationFormData.pepAddress2 = pepDetails.pepAddress.addressLine2;
    this.accountCreationFormData.pepFloor = pepDetails.pepAddress.floor;
    this.accountCreationFormData.pepUnitNo = pepDetails.pepAddress.unitNumber;
    this.accountCreationFormData.pepCity = pepDetails.pepAddress.city;
    this.accountCreationFormData.pepState = pepDetails.pepAddress.state;
    if (this.isCountrySingapore(pepDetails.pepAddress.country)) {
      this.accountCreationFormData.pepPostalCode = pepDetails.pepAddress.postalCode;
    } else {
      this.accountCreationFormData.pepZipCode = pepDetails.pepAddress.postalCode;
    }
  }
  setDueDiligence2FromApi(pepDetails) {
    this.clearAdditionDeclaration();
    if (pepDetails) {
      this.accountCreationFormData.expectedNumberOfTransation =
        pepDetails.expectedNumberOfTransactions;
      this.accountCreationFormData.expectedAmountPerTranction =
        pepDetails.expectedAmountPerTransactions;
      this.accountCreationFormData.source = pepDetails.investmentSourceId;

      if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.PERSONAL_SAVING
      ) {
        this.accountCreationFormData.personalSavings = pepDetails.additionalInfo;
      } else if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
      ) {
        this.accountCreationFormData.durationInvestment = pepDetails.investmentPeriod;
        this.accountCreationFormData.earningsGenerated =
          pepDetails.earningsGeneratedFromId;
      } else if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.GIFT_INHERITANCE
      ) {
        this.accountCreationFormData.inheritanceGift = pepDetails.additionalInfo;
      } else if (
        pepDetails.investmentSourceId &&
        pepDetails.investmentSourceId.key ===
        ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.OTHERS
      ) {
        this.accountCreationFormData.otherSources = pepDetails.additionalInfo;
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
    if (value && value > 0) {
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

  loadInvestmentAccountRoadmap(showUploadDocs?) {
    this.roadmapService.loadData(ACCOUNT_CREATION_ROADMAP);
    if (showUploadDocs) {
      this.roadmapService.addItem({
        title: 'Upload Documents',
        path: [ACCOUNT_CREATION_ROUTE_PATHS.UPLOAD_DOCUMENTS, ACCOUNT_CREATION_ROUTE_PATHS.UPLOAD_DOCUMENTS_BO],
        status: ERoadmapStatus.NOT_STARTED
      });
    } else {
      this.roadmapService.removeItem([ACCOUNT_CREATION_ROUTE_PATHS.UPLOAD_DOCUMENTS]);
    }
  }

  loadDDCRoadmap() {
    this.roadmapService.loadData(INVESTMENT_ACCOUNT_DDC_ROADMAP);
  }

  loadDDCInvestmentRoadmap() {
    this.roadmapService.loadData(INVESTMENT_ACCOUNT_DDC2_ROADMAP);
  }

  setUserPortfolioExistStatus(status) {
    this.accountCreationFormData.portfolioExist = status;
    this.commit();
  }

  getUserPortfolioExistStatus() {
    return this.accountCreationFormData.portfolioExist;
  }

  // #FOR 100 CHARACTERS FIELD CURSOR POSITION
 setCaratTo(contentEditableElement, position, content) {
  contentEditableElement.innerText = content;
  if (document.createRange) {
    const range = document.createRange();
    range.selectNodeContents(contentEditableElement);

    range.setStart(contentEditableElement.firstChild, position);
    range.setEnd(contentEditableElement.firstChild, position);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// #SET THE CONTROL VALUE
setControlValue(value, controlName, formName) {
  if (value !== undefined) {
    value = value.replace(/\n/g, '');
    value = value.substring(0, 100);
    formName.controls[controlName].setValue(value);
    return value;
  }
}

// #SET THE CONTROL FOR 100 CHARACTERS LIMIT
onKeyPressEvent(event: any, content: any) {
  const selection = window.getSelection();
  if (content.length >= 100 && selection.type !== 'Range') {
    const id = event.target.id;
    const el = document.querySelector('#' + id);
    this.setCaratTo(el, 100, content);
    event.preventDefault();
  }
  return (event.which !== 13);
}
}
