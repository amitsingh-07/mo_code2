import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ACCOUNT_CREATION_CONSTANTS } from '../account-creation.constant';
import { AccountCreationService } from '../account-creation-service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { Router } from '@angular/router';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountStatusComponent implements OnInit {
  status: string;
  pageTitle: string;
  pageDesc: string;
  showAccountCreationpending = false;
  showDocumentsPending = false;
  
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private accountCreationService: AccountCreationService,
    private modal: NgbModal,
    public footerService: FooterService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {});
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.status = this.accountCreationService.getAccountCreationStatus();
    this.accountCreationService.clearInvestmentAccountFormData();
    this.accountCreationService.restrictBackNavigation();
    console.log(this.status);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      if (this.status.toUpperCase() === ACCOUNT_CREATION_CONSTANTS.status.account_creation_pending.toUpperCase()) {
        this.showAccountCreationpending = true;
        this.pageTitle = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.TITLE'
        );
        this.pageDesc = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.DESC'
        );
      } else if (this.status.toUpperCase() === ACCOUNT_CREATION_CONSTANTS.status.documents_pending.toUpperCase()) {
        this.showDocumentsPending = true;
        this.pageTitle = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.TITLE'
        );
        this.pageDesc = this.translate.instant(
          'ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.DESC'
        );
      } else {
        this.showAccountCreationpending = true;
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

}
