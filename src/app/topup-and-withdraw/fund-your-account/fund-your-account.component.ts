import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ProfileIcons } from '../../engagement-journey/recommendation/profileIcons';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { BankDetailsComponent } from '../../shared/modal/bank-details/bank-details.component';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import {
    TOPUP_AND_WITHDRAW_ROUTE_PATHS
} from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';

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
  isRequestSubmitted = false;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    this.translate.get('COMMON').subscribe((result: string) => {
      this.fundAccountContent = this.translate.instant(
        'FUND_YOUR_ACCOUNT.LOGIN_TO_NETBANKING_BANK'
      );
      this.pageTitle = this.getPageTitleBySource(
        this.fundDetails.source,
        this.fundDetails.fundingType
      );
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(103);
    this.footerService.setFooterVisibility(false);
    this.getBankDetailsList();
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    this.getTransferDetails();
    if (this.fundDetails.portfolio.riskProfile) {
      this.riskProfileImg =
        ProfileIcons[this.fundDetails.portfolio.riskProfile.id - 1]['icon'];
    }
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  getBankDetailsList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.bankDetailsList = data.objectList.bankList;
      console.log(this.bankDetailsList);
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  showBankTransctionDetails() {
    const ref = this.modal.open(BankDetailsComponent, {
      centered: true,
      windowClass: 'custom-full-height'
    });
    ref.componentInstance.errorTitle = this.translate.instant(
      'FUND_YOUR_ACCOUNT.TRANSFER_INSTRUCTION'
    );
    ref.componentInstance.errorDescription = this.translate.instant(
      'FUND_YOUR_ACCOUNT.VIA_BANK_ONE'
    );
    ref.componentInstance.showBankTransctions = true;
    ref.componentInstance.setBankDetails = this.bankDetails;
    return false;
  }
  showPayNowDetails() {
    const ref = this.modal.open(BankDetailsComponent, {
      centered: true,
      windowClass: 'custom-full-height'
    });
    ref.componentInstance.errorTitle = this.translate.instant(
      'FUND_YOUR_ACCOUNT.TRANSFER_INSTRUCTION'
    );
    ref.componentInstance.errorDescription = this.translate.instant(
      'FUND_YOUR_ACCOUNT.VIA_PAYNOW_ONE'
    );
    ref.componentInstance.showPayNow = true;
    ref.componentInstance.setPaynowDetails = this.paynowDetails;
    return false;
  }

  getPageTitleBySource(source, type) {
    let pageTitle;
    if (source === TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.FUNDING) {
      pageTitle = this.translate.instant('FUND_YOUR_ACCOUNT.TITLE');
    } else if (source === TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.TOPUP) {
      if (type === TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.ONETIME) {
        pageTitle = this.translate.instant('FUND_YOUR_ACCOUNT.ONE_TIME_INVESTMENT');
      } else {
        pageTitle = this.translate.instant('FUND_YOUR_ACCOUNT.MONTHLY_INVESTMENT');
      }
    }
    return pageTitle;
  }

  getTransferDetails() {
    this.topupAndWithDrawService.getTransferDetails().subscribe((data) => {
      this.setBankPayNowDetails(data.objectList[0]);
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  selectFundingMethod(mode) {
    this.activeMode = mode;
  }
  showPopUp() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'FUND_YOUR_ACCOUNT.MODAL.SHOWPOPUP.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'FUND_YOUR_ACCOUNT.MODAL.SHOWPOPUP.MESSAGE'
    );
  }
  setBankPayNowDetails(data) {
    this.bankDetails = data.filter(
      (transferType) => transferType.institutionType === 'bank'
    )[0];
    this.paynowDetails = data.filter(
      (transferType) => transferType.institutionType === 'PayNow'
    )[0];
  }

  oneTimeOrMonthlySufficient() {
    return (
      (this.fundDetails.fundingType ===
        TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.ONETIME ||
        this.fundDetails.fundingType ===
          TOPUPANDWITHDRAW_CONFIG.FUND_YOUR_ACCOUNT.MONTHLY) &&
      !this.fundDetails.isAmountExceedBalance
    );
  }
  goToNext(target) {
    switch (target) {
      case 'PORTFOLIO':
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.YOUR_INVESTMENT], {
          replaceUrl: true
        });
        break;
      case 'DASHBOARD':
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
        break;
      default:
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
        break;
    }
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
    if(!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
        desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
      });
      this.topupAndWithDrawService.buyPortfolio(this.fundDetails).subscribe(
        (response) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          if (response.responseMessage.responseCode < 6000) {
            if (
              response.objectList &&
                response.objectList.length &&
                response.objectList[response.objectList.length - 1].serverStatus &&
                response.objectList[response.objectList.length - 1].serverStatus.errors &&
                response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              this.showCustomErrorModal(
                'Error!',
                response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg
              );
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal('Error!', errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else {
            if (!this.fundDetails.isAmountExceedBalance) {
              this.router.navigate([
                TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/success'
              ]);
            } else {
              this.router.navigate([
                TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/pending'
              ]);
            }
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }
  // MONTHLY INVESTMENT
  topUpMonthly() {
    if(!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
        desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
      });
      this.topupAndWithDrawService.monthlyInvestment(this.fundDetails).subscribe(
        (response) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          if (response.responseMessage.responseCode < 6000) {
            if (
              response.objectList &&
              response.objectList.length &&
              response.objectList[response.objectList.length - 1].serverStatus &&
              response.objectList[response.objectList.length - 1].serverStatus.errors &&
              response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              this.showCustomErrorModal(
                'Error!',
                response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg
              );
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal('Error!', errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else {
            if (!this.fundDetails.isAmountExceedBalance) {
              this.router.navigate([
                TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/success'
              ]);
            } else {
              this.router.navigate([
                TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST + '/pending'
              ]);
            }
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }
  // tslint:disable-next-line
}
