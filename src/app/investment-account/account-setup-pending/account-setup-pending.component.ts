import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { SIGN_UP_ROUTE_PATHS } from 'src/app/sign-up/sign-up.routes.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-account-setup-pending',
  templateUrl: './account-setup-pending.component.html',
  styleUrls: ['./account-setup-pending.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSetupPendingComponent implements OnInit {

  status: string;
  pageTitle: string;
  pageDesc: string;

  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public footerService: FooterService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(false);
    this.status = this.investmentAccountService.getAccountCreationStatus();
    this.investmentAccountService.clearInvestmentAccountFormData();
    console.log(this.status);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      if (this.status === INVESTMENT_ACCOUNT_CONFIG.status.account_creation_pending) {
        this.pageTitle = this.translate.instant('ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.TITLE');
        this.pageDesc = this.translate.instant('ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.DESC');
      } else if (this.status === INVESTMENT_ACCOUNT_CONFIG.status.documents_pending) {
        this.pageTitle = this.translate.instant('ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.TITLE');
        this.pageDesc = this.translate.instant('ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.DESC');
      } else {
        this.pageTitle = this.translate.instant('ACCOUNT_CREATION_STATUS.ADDITIONAL_DECLARATION_SUBMITTED.TITLE');
        this.pageDesc = this.translate.instant('ACCOUNT_CREATION_STATUS.ADDITIONAL_DECLARATION_SUBMITTED.DESC');
      }
    });
  }
  redirectToDashboard() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
}

}
