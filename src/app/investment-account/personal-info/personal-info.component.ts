import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class PersonalInfoComponent implements IPageComponent, OnInit {
  @ViewChild('expiryInput') expiryInput;
  @ViewChild('dobInput') dobInput;
  pageTitle: string;
  invPersonalInfoForm: FormGroup;
  formValues: any;
  passportMinDate: any;
  passportMaxDate: any;
  selectedNationalityFormValues: any;
  unitedStatesResident: string;
  showPassport = false;
  showNric = true;
  disabledFullName: true;
  userProfileInfo;
  constructor(
    private router: Router,
    private myInfoService: MyInfoService,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    private config: NgbDatepickerConfig,
    private modal: NgbModal,
    private signUpService: SignUpService,
    private investmentAccountService: InvestmentAccountService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PERSONAL_INFO.TITLE');
      this.setPageTitle(this.pageTitle);
      const today: Date = new Date();
      config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
      config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
      this.passportMinDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
      this.passportMaxDate = { year: (today.getFullYear() + 20), month: (today.getMonth() + 1), day: today.getDate() };
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.selectedNationalityFormValues = this.investmentAccountService.getNationality();
    // get profile
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.populateFullName();
    if (this.selectedNationalityFormValues.nationality.nationality === 'SINGAPOREAN' ||
      this.selectedNationalityFormValues.singaporeanResident === 'yes') {
      this.invPersonalInfoForm = this.buildFormForNricNumber();
      this.showPassport = false;
      this.showNric = true;
    } else {
      this.invPersonalInfoForm = this.buildFormForPassportDetails();
      this.showPassport = true;
      this.showNric = false;
    }
  }

  buildFormForNricNumber(): FormGroup {
    return this.formBuilder.group({
      fullName: [{ value: this.formValues.fullName, disabled: true },
      [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      firstName: [{ value: this.formValues.firstName, disabled: this.investmentAccountService.isDisabled('firstName') },
      [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      lastName: [{ value: this.formValues.lastName, disabled: this.investmentAccountService.isDisabled('lastName') },
      [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      nricNumber: [{ value: this.formValues.nricNumber, disabled: this.investmentAccountService.isDisabled('nricNumber') },
      [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      dob: [{ value: this.formValues.dob, disabled: this.investmentAccountService.isDisabled('dob') },
      Validators.required],
      gender: [{
        value: this.formValues.gender ? this.formValues.gender : 'male',
        disabled: this.investmentAccountService.isDisabled('gender')
      },
      Validators.required]
    }, { validator: this.validateName() });
  }
  buildFormForPassportDetails(): FormGroup {
    return this.formBuilder.group({
      fullName: [{ value: this.formValues.fullName, disabled: true },
      [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      firstName: [{ value: this.formValues.firstName, disabled: this.investmentAccountService.isDisabled('firstName') },
      [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      lastName: [{ value: this.formValues.lastName, disabled: this.investmentAccountService.isDisabled('lastName') },
      [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      passportNumber: [{ value: this.formValues.passportNumber, disabled: this.investmentAccountService.isDisabled('passportNumber') },
      [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      passportExpiry: [{
        value: this.formValues.passportExpiry,
        disabled: this.investmentAccountService.isDisabled('passportExpiry')
      }, Validators.required],
      dob: [{ value: this.formValues.dob, disabled: this.investmentAccountService.isDisabled('dob') },
      Validators.required],
      gender: [{
        value: this.formValues.gender ? this.formValues.gender : 'male',
        disabled: this.investmentAccountService.isDisabled('gender')
      },
      Validators.required]
    }, { validator: this.validateName() });
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
  populateFullName() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.formValues.firstName = this.formValues.firstName ? this.formValues.firstName : this.userProfileInfo.firstName;
    this.formValues.lastName = this.formValues.lastName ? this.formValues.lastName : this.userProfileInfo.lastName;
    this.formValues.fullName = this.formValues.fullName ? this.formValues.fullName :
      this.userProfileInfo.firstName + ' ' + this.userProfileInfo.lastName;
  }
  toggleDate(openEle, closeEle) {
    openEle.toggle();
    closeEle.close();
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
      this.investmentAccountService.setPersonalInfo(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.RESIDENTIAL_ADDRESS]);
    }
  }
  private validateName() {
    return (group: FormGroup) => {
      const name = group.controls['firstName'].value + ' ' + group.controls['lastName'].value;
      const fullName = group.controls['fullName'].value;
      if (fullName !== name) {
        return group.controls['firstName'].setErrors({ nameMatch: true });
      } else {
        return group.controls['firstName'].setErrors(null);
      }
    };
  }
}
