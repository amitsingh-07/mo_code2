import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../manage-investments/manage-investments-routes.constants';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../investment-account.constant';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountStatusComponent implements OnInit {
  status: string;
  fundingMethod: string;
  pageTitle: string;
  pageDesc: string;
  showAccountCreationPending = false;
  showDocumentsPending = false;
  showSrsAccountSuccess = false;
  showCashAccountSuccess = false;

  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    private investmentCommonService: InvestmentCommonService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {});
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.fundingMethod = this.investmentCommonService.getConfirmedFundingMethodName();
    this.status = this.investmentAccountService.getAccountCreationStatus();
    this.investmentAccountService.clearInvestmentAccountFormData();
    this.investmentCommonService.clearJourneyData();
    this.investmentAccountService.restrictBackNavigation();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      if (this.status.toUpperCase() === INVESTMENT_ACCOUNT_CONSTANTS.status.account_creation_confirmed.toUpperCase()) {
        if ((this.fundingMethod).toUpperCase() === 'CASH') {
          this.showCashAccountSuccess = true;
          this.pageTitle = this.translate.instant(
            'ACCOUNT_CREATION_STATUS.CASH_ACCOUNT_SUCCESS.TITLE'
          );
          this.pageDesc = this.translate.instant(
            'ACCOUNT_CREATION_STATUS.CASH_ACCOUNT_SUCCESS.DESC'
          );
        } else {
          this.showSrsAccountSuccess = true;
          this.pageTitle = this.translate.instant(
            'ACCOUNT_CREATION_STATUS.SRS_ACCOUNT_SUCCESS.TITLE'
          );
          this.pageDesc = this.translate.instant(
            'ACCOUNT_CREATION_STATUS.SRS_ACCOUNT_SUCCESS.DESC'
          );
        }
      } else if (this.status.toUpperCase() === INVESTMENT_ACCOUNT_CONSTANTS.status.account_creation_pending.toUpperCase()) {
        this.showAccountCreationPending = true;
        this.pageTitle = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.TITLE'
        );
        this.pageDesc = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.DESC'
        );
      } else if (this.status.toUpperCase() === INVESTMENT_ACCOUNT_CONSTANTS.status.documents_pending.toUpperCase()) {
        this.showDocumentsPending = true;
        this.pageTitle = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.TITLE'
        );
        this.pageDesc = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.DESC'
        );
        } else {
        this.showAccountCreationPending = true;
        this.pageTitle = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.ADDITIONAL_DECLARATION_SUBMITTED.TITLE'
        );
        this.pageDesc = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.ADDITIONAL_DECLARATION_SUBMITTED.DESC'
        );
      }
    });
  }
  redirectToDashboard() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
  redirectToFundAccount() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUND_INTRO]);
  }
  redirectToYourInvestment() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
  }

}
