import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss']
})
export class EmploymentDetailsComponent implements OnInit {
  pageTitle: string;
  employementStatusList: any;
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
    public navbarService: NavbarService,
    private modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('EMPLOYMENT_DETAILS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.getOccupationList();
    this.getIndustryList();
    this.getEmployeList();
    this.isUserNationalitySingapore = this.investmentAccountService.isUserNationalitySingapore();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();
    const employStatus = this.formValues.employmentStatus ? this.formValues.employmentStatus : 'Employed';
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
    this.investmentAccountService.getIndustryList().subscribe((data) => {
      this.industryList = data.objectList;
    });
  }
  getOccupationList() {
    this.investmentAccountService.getOccupationList().subscribe((data) => {
      this.occupationList = data.objectList;
    });
  }
  getEmployeList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.employementStatusList = data.objectList.employmentStatus;
    });
  }
  setEmployementStatus(key, value) {
    this.employementDetailsForm.controls[key].setValue(value);
    const employStatus = this.formValues.employmentStatus ? this.formValues.employmentStatus : this.employementStatusList[0].name;
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
  }
  setOccupationValue(key, value) {
    this.employementDetailsForm.controls[key].setValue(value);
  }

  setDropDownValue(key, value, nestedKey) {
    this.employementDetailsForm.controls[nestedKey]['controls'][key].setValue(value);
  }
  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }
  buildFormEmployement(empStatus: string): FormGroup {
    return this.formBuilder.group({
      employmentStatus: [empStatus, Validators.required],
      companyName: [this.formValues.companyName, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      occupation: [this.formValues.occupation, Validators.required],
      industry: [this.formValues.industry, Validators.required],
      contactNumber: [this.formValues.contactNumber, [Validators.required, Validators.pattern(RegexConstants.ContactNumber)]],
      isEmployeAddresSame: [this.formValues.isEmployeAddresSame]
    });
  }
  buildFormUnemployement(empStatus: string): FormGroup {
    return this.formBuilder.group({
      employmentStatus: [empStatus, Validators.required],
      isEmployeAddresSame: [this.formValues.isEmployeAddresSame]
    });
  }
  addOrRemoveMailingAddress() {
    if (!this.employementDetailsForm.controls.isEmployeAddresSame.value) {
      if (this.isUserNationalitySingapore) { // Singapore
        this.employementDetailsForm.addControl('employeaddress', this.formBuilder.group({
          empCountry: [this.formValues.nationality.country, Validators.required],
          empPostalCode: [this.formValues.empPostalCode, [Validators.required, Validators.pattern(RegexConstants.SixDigitNumber)]],
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

  retrieveAddress(postalCode, address1Control, address2Control) {
    if (postalCode) {
      this.investmentAccountService.getAddressUsingPostalCode(postalCode).subscribe(
        (response: any) => {
          if (response) {
            if (response.Status.code === 200) {
              const address1 = response.Placemark[0].AddressDetails.Country.Thoroughfare.ThoroughfareName;
              const address2 = response.Placemark[0].AddressDetails.Country.AddressLine;
              address1Control.setValue(address1);
              address2Control.setValue(address2);
            } else {
              const ref = this.modal.open(ErrorModalComponent, { centered: true });
              ref.componentInstance.errorTitle = this.translate.instant('EMPLOYMENT_DETAILS.POSTALCODE_NOT_FOUND_ERROR.TITLE');
              ref.componentInstance.errorMessage = this.translate.instant('EMPLOYMENT_DETAILS.POSTALCODE_NOT_FOUND_ERROR.MESSAGE');
              address1Control.setValue('');
              address2Control.setValue('');
            }
          }
        },
        (err) => {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant('EMPLOYMENT_DETAILS.ERROR.POSTAL_CODE_TITLE');
          ref.componentInstance.errorMessage = this.translate.instant('EMPLOYMENT_DETAILS.ERROR.POSTAL_CODE_DESC');
        });
    } else {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.translate.instant('EMPLOYMENT_DETAILS.POSTALCODE_EMPTY_ERROR.TITLE');
      ref.componentInstance.errorMessage = this.translate.instant('EMPLOYMENT_DETAILS.POSTALCODE_EMPTY_ERROR.MESSAGE');
    }
  }

  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.investmentAccountService.setEmployeAddressFormData(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FINANICAL_DETAILS]);
    }
  }
}
