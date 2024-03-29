import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { BankDetailsComponent } from '../../../shared/modal/bank-details/bank-details.component';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { FormatCurrencyPipe } from '../../../shared/Pipes/format-currency.pipe';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';

import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import {
  MANAGE_INVESTMENTS_ROUTE_PATHS
} from '../../manage-investments/manage-investments-routes.constants';
import {
  MANAGE_INVESTMENTS_CONSTANTS
} from '../../manage-investments/manage-investments.constants';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { InvestmentCommonService } from '../investment-common.service';
import { environment } from './../../../../environments/environment';
import { PromoCodeService } from '../../../promo-code/promo-code.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { InvestmentEngagementJourneyService } from './../../investment-engagement-journey/investment-engagement-journey.service';
@Component({
  selector: 'app-funding-instructions',
  templateUrl: './funding-instructions.component.html',
  styleUrls: ['./funding-instructions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingInstructionsComponent implements OnInit {
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
  monthlyAmount;
  timelineMessage;
  showBankTransferSteps = true;
  PortfolioName: any;
  showFixedToastMessage: boolean;
  toastMsg: any;
  portfolioArray: any;
  portfolioCatagories;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public manageInvestmentsService: ManageInvestmentsService,
    public investmentAccountService: InvestmentAccountService,
    public investmentCommonService: InvestmentCommonService,
    private loaderService: LoaderService,
    private formatCurrencyPipe: FormatCurrencyPipe,
    private promoCodeService: PromoCodeService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService
  ) {
    this.translate.use('en');
    this.fundDetails = this.manageInvestmentsService.getFundingDetails();
    this.portfolioArray = this.investmentCommonService.getPortfolioType();
    this.translate.get('COMMON').subscribe((result: string) => {
      this.fundAccountContent = this.translate.instant(
        'FUNDING_INSTRUCTIONS.LOGIN_TO_NETBANKING_BANK'
      );
      this.pageTitle = this.getPageTitleBySource(
        this.fundDetails.source,
        this.fundDetails.fundingType
      );
      this.setPageTitle(this.pageTitle);
      this.timelineMessage = this.constructProcessTime(this.fundDetails);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(105);
    } else {
      this.navbarService.setNavbarMode(103);
    }
    this.footerService.setFooterVisibility(false);
    this.getBankDetailsList();
    this.getTransferDetails();
    this.portfolioCatagories = INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY;
    if (this.fundDetails.portfolio.riskProfile) {
      if (this.fundDetails.portfolio.portfolioCategory === this.portfolioCatagories.WISESAVER) {
        this.riskProfileImg = ProfileIcons[6]['icon'];
      } else {
        ProfileIcons[this.fundDetails.portfolio.riskProfile.id - 1]['icon'];
        this.riskProfileImg = this.investmentEngagementJourneyService.getRiskProfileIcon(this.fundDetails.portfolio.riskProfile.type, false);
      }
    }
    this.PortfolioName = this.investmentCommonService.getConfirmPortfolioName();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  getBankDetailsList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.bankDetailsList = data.objectList.bankList;
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
      'FUNDING_INSTRUCTIONS.TRANSFER_INSTRUCTION'
    );
    ref.componentInstance.errorDescription = this.translate.instant(
      'FUNDING_INSTRUCTIONS.VIA_BANK_ONE'
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
      'FUNDING_INSTRUCTIONS.TRANSFER_INSTRUCTION'
    );
    ref.componentInstance.errorDescription = this.translate.instant(
      'FUNDING_INSTRUCTIONS.VIA_PAYNOW_ONE'
    );
    ref.componentInstance.showPayNow = true;
    ref.componentInstance.setPaynowDetails = this.paynowDetails;
    return false;
  }

  getPageTitleBySource(source, type) {
    let pageTitle;
    if (source === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.FUNDING) {
      pageTitle = this.translate.instant('FUNDING_INSTRUCTIONS.TITLE');
    } else if (source === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.TOPUP) {
      if (type === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME) {
        pageTitle = this.translate.instant('FUNDING_INSTRUCTIONS.ONE_TIME_INVESTMENT');
      } else {
        pageTitle = this.translate.instant('FUNDING_INSTRUCTIONS.MONTHLY_INVESTMENT');
      }
    }
    return pageTitle;
  }

  getTransferDetails() {
    const customerPortfolioId = this.fundDetails.customerPortfolioId;
    this.manageInvestmentsService.getTransferDetails(customerPortfolioId).subscribe((data) => {
      this.setBankPayNowDetails(data.objectList);
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
      'FUNDING_INSTRUCTIONS.MODAL.SHOWPOPUP.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'FUNDING_INSTRUCTIONS.MODAL.SHOWPOPUP.MESSAGE'
    );
  }
  showTipModal() {
    this.showPopUp();
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
        MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME ||
        this.fundDetails.fundingType ===
        MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY) &&
      !this.fundDetails.isAmountExceedBalance
    );
  }
  goToNext(target) {
    switch (target) {
      case 'YOUR_INVESTMENT':
        this.manageInvestmentsService.activateToastMessage();
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT], {
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
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
        desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
      });
      this.manageInvestmentsService.buyPortfolio(this.fundDetails).subscribe(
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
            // On success remove the applied promo code
            this.promoCodeService.removeAppliedPromo();
            if (!this.fundDetails.isAmountExceedBalance) {
              this.router.navigate([
                MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP_STATUS + '/success'
              ]);
            } else {
              this.router.navigate([
                MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP_STATUS + '/pending'
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
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.TITLE'),
        desc: this.translate.instant('TOPUP.TOPUP_REQUEST_LOADER.DESC')
      });
      this.manageInvestmentsService.monthlyInvestment(this.fundDetails).subscribe(
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
                MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP_STATUS + '/success'
              ]);
            } else {
              this.router.navigate([
                MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP_STATUS + '/pending'
              ]);
            }
            // On success remove the applied promo code
            this.promoCodeService.removeAppliedPromo();
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
  constructProcessTime(fundDetails) {
    let timelineMessage;
    if (fundDetails.monthlyInvestment && !fundDetails.oneTimeInvestment) {
      const monthlyAmount = {
        month: this.formatCurrencyPipe.transform(
          this.fundDetails.monthlyInvestment
        )
      };
      timelineMessage = this.translate.instant('FUNDING_INSTRUCTIONS.MONTHLY_TIME_INFO', monthlyAmount);
    } else {
      timelineMessage = this.translate.instant('FUNDING_INSTRUCTIONS.PROCESS_TIME_INFO');
    }
    return timelineMessage;
  }

  notify(event) {
    const toasterMsg = {
      desc: this.translate.instant('TRANSFER_INSTRUCTION.COPIED')
    };

    this.toastMsg = toasterMsg;
    this.showFixedToastMessage = true;
    this.hideToastMessage();
  }

  hideToastMessage() {
    setTimeout(() => {
      this.showFixedToastMessage = false;
      this.toastMsg = null;
    }, 3000);
  }
}
