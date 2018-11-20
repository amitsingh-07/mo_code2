import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

import { TopUpAndWithdrawFormData } from '../topup-and-withdraw-form-data';

import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';

import { HostListener } from '@angular/core';

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
  portfolio;
  investment;
  portfolioList;
  topupportfolio = false;
  amount: number;
  topupportfolioamount: any;
  investmentTypeList: any;
  showOnetimeInvestmentAmount = true;
  showmonthlyInvestmentAmount = false;
  formValues;
  topForm: FormGroup;
  enteringAmount;
  balanceAmount = 120000;
  translator: any;
  investmentype;
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

  validateAmonut(amount) {
    this.amount = amount;
    console.log(this.amount);
    console.log(this.balanceAmount);
    if (this.amount > this.balanceAmount) {
      this.topupportfolioamount = this.amount - this.balanceAmount;
      this.topupportfolio = true;
    } else {
      this.topupportfolio = false;
    }
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarDirectGuided(true);
    this.navbarService.setNavbarMode(2);
    this.getPortfolioList();
    if (this.amount > this.balanceAmount) {
      this.topupportfolio = true;
    }
    this.topupAndWithDrawService.getTopupInvestmentList().subscribe((data) => {
      this.investmentTypeList = data.objectList; // Getting the information from the API
      console.log(this.investmentTypeList);
    });
    this.formValues = this.topupAndWithDrawService.getTopUpFormData();
    this.topForm = this.formBuilder.group({
      portfolio: [this.formValues.portfolio, Validators.required],
      Investment: [this.formValues.Investment, Validators.required],
      oneTimeInvestmentAmount: [this.formValues.oneTimeInvestmentAmount, Validators.required]
      //MonthlyInvestmentAmount: [this.formValues.MonthlyInvestmentAmount, Validators.required]
    });
    //this.buildFormInvestment();
  }
  getPortfolioList() {
    this.topupAndWithDrawService.getPortfolioList().subscribe((data) => {
      this.portfolioList = data.objectList;
      console.log(this.portfolioList + 'dfsdfsfsdf');
    });
  }
  setDropDownValue(key, value) {
    this.topForm.controls[key].setValue(value);
  }

  buildFormInvestment() {
    if (this.investment.name === 'One-time Investment') {
      this.topForm.addControl('oneTimeInvestmentAmount', new FormControl('', Validators.required));
      this.topForm.removeControl('MonthlyInvestmentAmount');
      this.showOnetimeInvestmentAmount = true;
      this.showmonthlyInvestmentAmount = false;
    } else {
      this.topForm.addControl('MonthlyInvestmentAmount', new FormControl('', Validators.required));
      this.topForm.removeControl('oneTimeInvestmentAmount');
      this.showOnetimeInvestmentAmount = false;
      this.showmonthlyInvestmentAmount = true;
    }
  }
  selectedInvestment(investmenttype) {
    this.investment = investmenttype;
    this.buildFormInvestment();
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
    form.value.topupportfolioamount = this.topupportfolioamount;
    this.topupAndWithDrawService.setTopUp(form.value);
    this.saveFundingDetails();
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
  }
  saveFundingDetails() {
    const topupValues = {
      oneTimeInvestmentAmount: this.formValues.oneTimeInvestmentAmount,
      MonthlyInvestmentAmount: this.formValues.MonthlyInvestmentAmount,
      topupportfolioamount: this.formValues.topupportfolioamount,
      Investment: this.formValues.Investment,
      portfolio: this.formValues.portfolio
    };
    this.topupAndWithDrawService.setFundingDetails(topupValues);
  }
}