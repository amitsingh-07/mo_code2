import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './../manage-investments-routes.constants';

import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { SignUpApiService } from '../../../sign-up/sign-up.api.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../../manage-investments/manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';

@Component({
  selector: 'app-topup-status',
  templateUrl: './topup-status.component.html',
  styleUrls: ['./topup-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopupStatusComponent implements OnInit, OnDestroy {
  status;
  activeMode = 'BANK';
  fundDetails;
  bankDetails;
  paynowDetails;
  showBankTransferSteps = true;
  cashBalance;
  oneTimeMonthlyMsg: string;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private modal: NgbModal,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public manageInvestmentsService: ManageInvestmentsService,
    private signUpService: SignUpService,
    private signUpApiService: SignUpApiService,
    private investmentAccountService: InvestmentAccountService,
    private navbarService: NavbarService
  ) {
    this.fundDetails = this.manageInvestmentsService.getFundingDetails();
    if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME) {
      this.oneTimeMonthlyMsg = this.translate.instant('TOPUP_REQUEST.ONE_TIME_MSG');
    } else if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY) {
      this.oneTimeMonthlyMsg = this.translate.instant('TOPUP_REQUEST.MONTHLY_MSG');
    }
    this.getTransferDetails();
  }
  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.manageInvestmentsService.clearTopUpData();
    this.route.params.subscribe((params) => {
      this.status = params['status'];
    });
    this.refreshUserProfileInfo();
    document.body.classList.add('bg-color');
    this.cashBalance = this.manageInvestmentsService.getUserCashBalance();
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-color');
  }

  refreshUserProfileInfo() {
    this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
      if (userInfo.responseMessage.responseCode < 6000) {
        // ERROR SCENARIO
        if (
          userInfo.objectList &&
          userInfo.objectList.length &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors[0].msg
          );
        } else if (userInfo.responseMessage && userInfo.responseMessage.responseDescription) {
          const errorResponse = userInfo.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.investmentAccountService.showGenericErrorModal();
        }
      } else {
        this.signUpService.setUserProfileInfo(userInfo.objectList);
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  // Transfer Details Related
  selectFundingMethod(mode) {
    this.activeMode = mode;
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

  getTransferDetails() {
    const customerPortfolioId = this.fundDetails['portfolio']['customerPortfolioId'];
    this.manageInvestmentsService.getTransferDetails(customerPortfolioId).subscribe((data) => {
      this.setBankPayNowDetails(data.objectList);
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  setBankPayNowDetails(data) {
    this.bankDetails = data.filter(
      (transferType) => transferType.institutionType === 'bank'
    )[0];
    this.paynowDetails = data.filter(
      (transferType) => transferType.institutionType === 'PayNow'
    )[0];
  }

  goToNext() {
    this.manageInvestmentsService.clearTopUpData();
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
  }
}
