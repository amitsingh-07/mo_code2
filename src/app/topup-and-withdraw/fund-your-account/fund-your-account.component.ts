import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { ProfileIcons } from '../../portfolio/risk-profile/profileIcons';
import { HeaderService } from '../../shared/header/header.service';
import { BankDetailsComponent } from '../../shared/modal/bank-details/bank-details.component';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { FooterService } from './../../shared/footer/footer.service';

import {
  TOPUP_AND_WITHDRAW_ROUTE_PATHS
} from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';

@Component({
  selector: 'app-fund-your-account',
  templateUrl: './fund-your-account.component.html',
  styleUrls: ['./fund-your-account.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  fundAccountContent: any;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    this.translate.get('COMMON').subscribe((result: string) => {
      this.fundAccountContent = this.translate.instant('FUND_YOUR_ACCOUNT.LOGIN_TO_NETBANKING_BANK');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
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

  showBankTransctionDetails() {
    const ref = this.modal.open(BankDetailsComponent, { centered: true, windowClass: 'full-height'});
    ref.componentInstance.errorTitle = 'Transfer Instructions';
    ref.componentInstance.errorDescription = 'Sending money via Bank Transfer:';
    ref.componentInstance.showBankTransctions = true;
    ref.componentInstance.setBankDetails = this.bankDetails;
    return false;
  }
  showPayNowDetails() {
    const ref = this.modal.open(BankDetailsComponent, { centered: true, windowClass: 'full-height' });
    ref.componentInstance.errorTitle = 'Transfer Instructions';
    ref.componentInstance.errorDescription = 'Sending money via PayNow:';
    ref.componentInstance.showPayNow = true;
    ref.componentInstance.setPaynowDetails = this.paynowDetails;
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
  showPopUp() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('FUND_YOUR_ACCOUNT.MODAL.SHOWPOPUP.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('FUND_YOUR_ACCOUNT.MODAL.SHOWPOPUP.MESSAGE');
  }
  setBankPayNowDetails(data) {
    this.bankDetails = data.filter((transferType) => transferType.institutionType === 'bank')[0];
    this.paynowDetails = data.filter((transferType) => transferType.institutionType === 'PayNow')[0];
  }

  oneTimeOrMonthlySufficient() {
    return ( (this.fundDetails.fundingType === 'ONETIME' || this.fundDetails.fundingType === 'MONTHLY')
      && !this.fundDetails.isAmountExceedBalance);
  }
  goToNext() {
    // redirect to dashboard
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
  // tslint:disable-next-line
  buyPortfolio() {
    if (this.fundDetails.oneTimeInvestment) {
      this.topUpOneTime();

    } else {
      this.topUpMonthly();
    }
  }
  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }
  // ONETIME INVESTMENT
  topUpOneTime() {
    this.topupAndWithDrawService.buyPortfolio(this.fundDetails).subscribe((response) => {
      if (response.responseMessage.responseCode < 6000) {
        if (response.objectList && response.objectList.serverStatus && response.objectList.serverStatus.errors.length) {
          this.showCustomErrorModal('Error!', response.objectList.serverStatus.errors[0].msg);
        }
      } else {
        if (!this.fundDetails.isAmountExceedBalance) {
          this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/success']);
        } else {
          this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/pending']);
        }
      }
    },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant('COMMON_ERRORS.API_FAILED.TITLE');
        ref.componentInstance.errorMessage = this.translate.instant('COMMON_ERRORS.API_FAILED.DESC');
      });
  }
  // MONTHLY INVESTMENT
  topUpMonthly() {
    this.topupAndWithDrawService.monthlyInvestment(this.fundDetails).subscribe((response) => {
      if (response.responseMessage.responseCode < 6000) {
        if (response.objectList && response.objectList.serverStatus && response.objectList.serverStatus.errors.length) {
          this.showCustomErrorModal('Error!', response.objectList.serverStatus.errors[0].msg);
        }
      } else {
        if (!this.fundDetails.isAmountExceedBalance) {
          this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/success']);
        } else {
          this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/pending']);
        }
      }
    },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant('COMMON_ERRORS.API_FAILED.TITLE');
        ref.componentInstance.errorMessage = this.translate.instant('COMMON_ERRORS.API_FAILED.DESC');
      });
  }
 // tslint:disable-next-line
} 