import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslateService } from '@ngx-translate/core';
import { RegexConstants } from '../../shared/utils/api.regex.constants';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss']
})
export class EmploymentDetailsComponent implements OnInit {
  pageTitle: string;
  employementStatusList: any = ['Employed', 'Self Employed', 'Unemployed'];
  employementDetailsForm: FormGroup;
  formValues: any;
  countries;

  isUserNationalitySingapore;
  option: any;
  showEmployment = true;
  occupation;
  industry: any;
  empStatus: any;
  industryList;
  occupationList;
  employementstatus;
  showEmploymentControls: boolean;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private investmentAccountService: InvestmentAccountService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('EMPLOYMENT_DETAILS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }
  ngOnInit() {
    this.getOccupationList();
    this.getIndustryList();
    this.isUserNationalitySingapore = this.investmentAccountService.isUserNationalitySingapore();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();

    const employStatus = this.formValues.employmentStatus ? this.formValues.employmentStatus : this.employementStatusList[0];
    if (employStatus === 'Unemployed') {
      this.employementDetailsForm = this.buildFormUnemployement(employStatus);
      this.showEmploymentControls = false;
    } else {
      this.employementDetailsForm = this.buildFormEmployement(employStatus);
      this.showEmploymentControls = true;
    }
    this.addOrRemoveMailingAddress();
  }

  getIndustryList() {
    this.authService.authenticate().subscribe((token) => {
      this.investmentAccountService.getIndustryList().subscribe((data) => {
        this.industryList = data.objectList;
        console.log(this.industryList);
      });
    });

  }
  getOccupationList() {
    this.authService.authenticate().subscribe((token) => {
      this.investmentAccountService.getOccupationList().subscribe((data) => {
        this.occupationList = data.objectList;
        console.log(this.occupationList);
      });
    });

  }
  setEmployementStatus(key, value) {
    this.employementDetailsForm.controls[key].setValue(value);
    if (value === 'Unemployed') {
      this.employementDetailsForm = this.buildFormUnemployement(value);
      this.showEmploymentControls = false;
    } else {
      this.employementDetailsForm = this.buildFormEmployement(value);
      this.showEmploymentControls = true;
    }
  }
  setIndustryValue(key, value) {
    this.employementDetailsForm.controls[key].setValue(value);

    console.log(this.industry);

  }
  setOccupationValue(key, value) {
    this.employementDetailsForm.controls[key].setValue(value);

    console.log(this.occupation);
  }

  setDropDownValue(key, value, nestedKey) {
    this.employementDetailsForm.controls[nestedKey]['controls'][key].setValue(value);
  }

  buildFormEmployement(empStatus: string): FormGroup {
    return this.formBuilder.group({
      employmentStatus: [empStatus,  Validators.required],
      companyName: [this.formValues.companyName, Validators.required],
      occupation: [this.formValues.occupation ? this.formValues.occupation : 'Select Occupation', Validators.required],
      industry: [this.formValues.industry ? this.formValues.industry : 'Select Induatry', Validators.required],
      contactNumber: [this.formValues.contactNumber],
      isEmployeAddresSame: [this.formValues.isEmployeAddresSame]
    });
  }
  buildFormUnemployement(empStatus: string): FormGroup {
    return this.formBuilder.group({
      employmentStatus: [empStatus, Validators.required]
    });
  }

  addOrRemoveMailingAddress() {
    if (!this.employementDetailsForm.controls.isEmployeAddresSame.value) {
      if (this.isUserNationalitySingapore) { // Singapore
        this.employementDetailsForm.addControl('employeaddress', this.formBuilder.group({
          empCountry: [this.formValues.nationality.country, Validators.required],
          empPostalCode: [this.formValues.empPostalCode, Validators.required],
          empAddress1: [this.formValues.empAddress1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          empAddress2: [this.formValues.empAddress2],
          empUnitNo: [this.formValues.empUnitNo, Validators.required]
        }));
      } else { // Other Countries
        this.employementDetailsForm.addControl('employeaddress', this.formBuilder.group({
          empCountry: [this.formValues.nationality.country ? this.formValues.nationality.country : this.countries[0], Validators.required],
          empAddress1: [this.formValues.empAddress1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          empAddress2: [this.formValues.empAddress2],
          empCity: [this.formValues.empCity, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
          empState: [this.formValues.empState, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
          empZipCode: [this.formValues.empZipCode, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
        }));
      }
    } else {
      this.employementDetailsForm.removeControl('employeaddress');
    }
  }

  goToNext(form) {
    if (!form.valid) {
      return false;
    } else {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FINANICAL_DETAILS]);
    }
  }
}
