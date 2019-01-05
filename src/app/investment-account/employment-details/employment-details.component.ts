import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  isEditProfile: any;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private investmentAccountService: InvestmentAccountService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.isEditProfile = this.route.snapshot.queryParams
      && this.route.snapshot.queryParams.enableEditProfile ? true : false;
    this.employementDetailsForm = this.buildForm();
    this.addOrRemoveAdditionalControls(this.employementDetailsForm.get('employmentStatus').value);
    this.observeEmploymentStatusChange();
    this.addOrRemoveMailingAddress(this.employementDetailsForm.get('employmentStatus').value);
    if (this.employementDetailsForm.get('employeaddress')) {
      this.observeEmpAddressCountryChange();
    }
  }

  buildForm() {
    return this.formBuilder.group({
      employmentStatus: [this.formValues.employmentStatus, Validators.required]
    });
  }

  addOrRemoveAdditionalControls(empStatus) {
    if (empStatus === 'Self Employed' || empStatus === 'Employed') {
      this.employementDetailsForm.addControl('companyName', new FormControl({
        value: this.formValues.companyName,
        disabled: this.investmentAccountService.isDisabled('companyName')
      },
        [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]));
      this.employementDetailsForm.addControl('occupation', new FormControl({
        value: this.formValues.occupation,
        disabled: this.investmentAccountService.isDisabled('occupation')
      }, Validators.required));
      this.employementDetailsForm.addControl('industry', new FormControl(this.formValues.industry, Validators.required));
      this.employementDetailsForm.addControl('contactNumber', new FormControl(
        this.formValues.contactNumber, [Validators.required, Validators.pattern(RegexConstants.ContactNumber)]));
      this.addOrRemoveMailingAddress(empStatus);
      this.observeIndustryChange();
      this.observeOccupationChange();
    } else {
      this.employementDetailsForm.removeControl('companyName');
      this.employementDetailsForm.removeControl('occupation');
      this.employementDetailsForm.removeControl('occupationForOthers');
      this.employementDetailsForm.removeControl('industry');
      this.employementDetailsForm.removeControl('industryForOthers');
      this.employementDetailsForm.removeControl('contactNumber');
      this.employementDetailsForm.removeControl('employeaddress');
    }
  }

  observeEmploymentStatusChange() {
    this.employementDetailsForm.get('employmentStatus').valueChanges.subscribe((value) => {
      this.addOrRemoveAdditionalControls(value);
    });
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
      this.investmentAccountService.setEmploymentStatusList(data.objectList.employmentStatus);
    });
  }
  setEmployementStatus(key, value) {
    this.employementDetailsForm.controls[key].setValue(value);
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

  addOrRemoveMailingAddress(empStatus) {
    if (empStatus === 'Self Employed' || empStatus === 'Employed') {
      this.employementDetailsForm.addControl('employeaddress', this.formBuilder.group({
        empCountry: [this.formValues.empCountry ? this.formValues.empCountry
          : this.investmentAccountService.getCountryFromNationalityCode(INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE),
        Validators.required],
        empAddress1: [this.formValues.empAddress1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
        empAddress2: [this.formValues.empAddress2, [Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      }));
      this.addOrRemoveAdditionalControlsMailing(this.employementDetailsForm.get('employeaddress').get('empCountry').value);
      this.observeEmpAddressCountryChange();
    } else {
      this.employementDetailsForm.removeControl('employeaddress');
    }
  }

  observeIndustryChange() {
    this.employementDetailsForm.get('industry').valueChanges.subscribe((value) => {
      if (value.name === 'Others') {
        this.employementDetailsForm.addControl('industryForOthers',
        new FormControl(this.formValues.industryForOthers, Validators.required));
      } else {
        this.employementDetailsForm.removeControl('industryForOthers');
      }
    });
  }

  observeOccupationChange() {
    this.employementDetailsForm.get('occupation').valueChanges.subscribe((value) => {
      if (value.name === 'Others') {
        this.employementDetailsForm.addControl('occupationForOthers',
        new FormControl(this.formValues.occupationForOthers, Validators.required));
      } else {
        this.employementDetailsForm.removeControl('occupationForOthers');
      }
    });
  }

  addOrRemoveAdditionalControlsMailing(country) {
    const isSingapore = this.investmentAccountService.isCountrySingapore(country);
    const empAddressFormGroup = this.employementDetailsForm.get('employeaddress') as FormGroup;
    if (isSingapore) {
      empAddressFormGroup.addControl('empPostalCode', new FormControl(
        this.formValues.empPostalCode, [Validators.required, Validators.pattern(RegexConstants.SixDigitNumber)]));
      empAddressFormGroup.addControl('empUnitNo', new FormControl(
        this.formValues.empUnitNo, Validators.required));

      empAddressFormGroup.removeControl('empCity');
      empAddressFormGroup.removeControl('empState');
      empAddressFormGroup.removeControl('empZipCode');
    } else {
      empAddressFormGroup.addControl('empCity', new FormControl(
        this.formValues.empCity, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]));
      empAddressFormGroup.addControl('empState', new FormControl(
        this.formValues.empState, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]));
      empAddressFormGroup.addControl('empZipCode', new FormControl(
        this.formValues.empZipCode, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]));

      empAddressFormGroup.removeControl('empPostalCode');
      empAddressFormGroup.removeControl('empUnitNo');
    }
  }

  observeEmpAddressCountryChange() {
    this.employementDetailsForm.get('employeaddress').get('empCountry').valueChanges.subscribe((value) => {
      this.addOrRemoveAdditionalControlsMailing(value);
    });
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
      if (this.isEditProfile) {
        this.investmentAccountService.updateEmployerAddress(form.getRawValue()).subscribe((data) => {
          if (data.responseMessage.responseCode === 6000) {
            // tslint:disable-next-line:max-line-length
            this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
          }
        });
      } else {
        this.investmentAccountService.setEmployeAddressFormData(form.getRawValue());
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FINANICAL_DETAILS]);
      }
    }
  }

  isDisabled() {
    return this.investmentAccountService.isDisabled('occupation');
  }
}
