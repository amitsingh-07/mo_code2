import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';

import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';

import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

import { BankDetailsComponent } from '../../shared/modal/bank-details/bank-details.component';

import { TopUpAndWithdrawFormData } from '../../topup-and-withdraw/topup-and-withdraw-form-data';


import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';

@Component({
  selector: 'app-fund-your-account',
  templateUrl: './fund-your-account.component.html',
  styleUrls: ['./fund-your-account.component.scss']
})
export class FundYourAccountComponent implements OnInit {

  uploadForm: FormGroup;
  pageTitle: string;
  formValues;
  isUserNationalitySingapore;
  activeTabIndex = 0;
  topupFormValues;
  topup = true;
  setOnetimeInvestmentAmount;
  setMonthlyInvestmentAmount;
  fundDetails;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.topupFormValues = this.topupAndWithDrawService.getTopUp();
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();

    this.setOnetimeInvestmentAmount = this.topupFormValues.oneTimeInvestmentAmount;
    this.setMonthlyInvestmentAmount = this.topupFormValues.MonthlyInvestmentAmount;
    if (this.fundDetails) {
      if (this.fundDetails.topupportfolioamount >= 0 &&
        this.fundDetails.Investment === 'One-time Investment') {
        this.topup = true;
      } else if (this.fundDetails.Investment === 'Monthly Investment') {
        this.topup = true;
      } else {
        this.topup = false;
      }
    } else {
      this.topup = true;
    }
    this.translate.get('COMMON').subscribe((result: string) => {
      if (this.fundDetails) {
        if (this.fundDetails.Investment === 'One-time Investment') {
          this.pageTitle = this.translate.instant('One Time investment');
        } else {
          this.pageTitle = this.translate.instant('Monthly Investment');
        }
      } else {
        this.pageTitle = this.translate.instant('Fund Your Account ');
      }

      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.topupFormValues = this.topupAndWithDrawService.getTopUp();
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    console.log(this.topupFormValues);
  }

  showBankDetails() {
    const ref = this.modal.open(BankDetailsComponent, { centered: true });
    ref.componentInstance.errorTitle = 'Select Your Bank';
    ref.componentInstance.errorDescription = 'You will be transferring funds from:';
    return false;

  }
  selectFundingMethod(index) {
    this.activeTabIndex = index;
  }
  goToNext() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST]);
  }

}
