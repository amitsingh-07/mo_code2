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
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.scss']
})
export class TopUpComponent implements OnInit {
  pageTitle: string;
  name = 'saidevi';
  investmentTypeList: any;
 showOnetimeInvestmentAmount = true;
  showmonthlyInvestmentAmount = false;
  formValues;
  topForm: FormGroup;
  balanceAmount = '$120,000';
  translator: any;
  investmentype ;
  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    private modal: NgbModal,
    public topupAndWithDrawService: TopupAndWithDrawService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('TOPUP.TITLE');
      this.setPageTitle(this.pageTitle);
    });

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.formValues = this.topupAndWithDrawService.getTopUpFormData();
    this.topForm = this.investmentype === 'Monthly Investment' ?
    this.buildFormMonthlyInvestment()
    : this.buildFormOneTimeInvestment();
  }

  buildFormOneTimeInvestment(): FormGroup {
    return this.formBuilder.group({
      oneTimeInvestmentAmount: [this.formValues.oneTimeInvestmentAmount, Validators.required],
      investment: [this.formValues.investment, Validators.required]
    });
    this.topForm.removeControl('MonthlyInvestmentAmount');
  }

  buildFormMonthlyInvestment(): FormGroup {
    return this.formBuilder.group({
      MonthlyInvestmentAmount: [this.formValues.MonthlyInvestmentAmount, Validators.required],
      investment: [this.formValues.investment, Validators.required]
    });
    this.topForm.removeControl('oneTimeInvestmentAmount');
  }
  setInvestmentType(investmentype) {
    this.investmentype = investmentype;
    console.log(this.investmentype);
    if (this.investmentype === 'Monthly Investment') {
      this.buildFormMonthlyInvestment();
      this.showOnetimeInvestmentAmount = false;
      this.showmonthlyInvestmentAmount = true;
    } else {
      this.buildFormOneTimeInvestment();
      this.showOnetimeInvestmentAmount = true;
      this.showmonthlyInvestmentAmount = false;
    }
  }
  goToNext(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
    }
    const error = this.topupAndWithDrawService.doFinancialValidations(form);
    console.log('error' + error);
    if (error) {
      // tslint:disable-next-line:no-commented-code
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      // tslint:disable-next-line:triple-equals

    } else {
      this.saveAndProceed(form);
    }
  }
  saveAndProceed(form: any) {
    this.router.navigate(['home']);
    //this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP2]);
    // CALL API
    // this.portfolioService.savePersonalInfo().subscribe((data) => {
    // if (data) {
    //  this.authService.saveEnquiryId(data.objectList.enquiryId);
    //  }
    //});
  }
}