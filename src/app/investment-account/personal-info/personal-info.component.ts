import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';

import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { InvestmentAccountService } from '../investment-account-service';
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements IPageComponent, OnInit {
  pageTitle: string;
  invPersonalInfoForm: FormGroup;
  formValues: any;
  passportMinDate: any;
  passportMaxDate: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public headerService: HeaderService,
    private config: NgbDatepickerConfig,
    private modal: NgbModal,
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

  ngOnInit() {
    this.invPersonalInfoForm = this.formBuilder.group({
      fullName: ['KOGANTI SAIDEVI', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      firstName: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      lastName: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      nricNumber: ['', Validators.required],
      passportNumber: ['', [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      passportExpiry: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['male', Validators.required]
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
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
      this.investmentAccountService.setPersonalInfo(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.RESIDENTIAL_ADDRESS]);
    }
  }

}
