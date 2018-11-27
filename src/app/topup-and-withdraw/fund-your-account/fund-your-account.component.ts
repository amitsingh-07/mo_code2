import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { ProfileIcons } from '../../portfolio/risk-profile/profileIcons';
import { HeaderService } from '../../shared/header/header.service';
import { BankDetailsComponent } from '../../shared/modal/bank-details/bank-details.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import {
  TOPUP_AND_WITHDRAW_ROUTE_PATHS
} from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';
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
  activeMode = 'BANK';
  fundDetails;
  bankDetailsList;
  bankDetails;
  paynowDetails;
  riskProfileImg: any;

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
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();

    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.getBankDetailsList();
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    this.getTransferDetails();
    const pageTitle = this.getPageTitleBySource(this.fundDetails.source, this.fundDetails.fundingType);
    this.setPageTitle(pageTitle);
    if (this.fundDetails.portfolio.riskProfile) {
      this.riskProfileImg = ProfileIcons[this.fundDetails.portfolio.riskProfile.id - 1]['icon'];
    }
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  getBankDetailsList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.bankDetailsList = data.objectList.bankList;
      console.log(this.bankDetailsList);
    });
  }
  showBankDetails() {
    const ref = this.modal.open(BankDetailsComponent, { centered: true });
    ref.componentInstance.errorTitle = 'Select Your Bank';
    ref.componentInstance.errorDescription = 'You will be transferring funds from:';
    ref.componentInstance.bankDetailsLists = this.bankDetailsList;
    console.log(this.bankDetailsList);
    return false;
  }

  getPageTitleBySource(source, type) {
    let pageTitle;
    if (source === 'FUNDING') {
      pageTitle = this.translate.instant('Fund Your Account');
    } else if (source === 'TOPUP') {
      type === 'ONETIME' ?
        pageTitle = this.translate.instant('One-time Investment') : pageTitle = this.translate.instant('Monthly Investment');
    }
    return pageTitle;
  }

  getTransferDetails() {
    this.topupAndWithDrawService.getTransferDetails().subscribe((data) => {
      this.setBankPayNowDetails(data.objectList[0]);
    });
  }

  selectFundingMethod(mode) {
    this.activeMode = mode;
  }

  setBankPayNowDetails(data) {
    this.bankDetails = data.filter((transferType) => transferType.institutionType === 'bank')[0];
    this.paynowDetails = data.filter((transferType) => transferType.institutionType === 'PayNow')[0];
  }

  oneTimeSufficient() {
    return (this.fundDetails.fundingType === 'ONETIME' && !this.fundDetails.isAmountExceedBalance);
  }

  goToNext() {
    // redirect to dashboard
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  buyPortfolio() {
    this.topupAndWithDrawService.buyPortfolio(this.fundDetails).subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) { // success scenario
        if (!this.fundDetails.isAmountExceedBalance) {
          this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/success']);
        } else {
          this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/pending']);
        }
      }
    });
  }
}
