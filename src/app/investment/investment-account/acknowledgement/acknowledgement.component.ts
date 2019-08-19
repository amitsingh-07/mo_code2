import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-acknowledgement',
  templateUrl: './acknowledgement.component.html',
  styleUrls: ['./acknowledgement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AcknowledgementComponent implements OnInit {
  pageTitle: string;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public footerService: FooterService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('ACKNOWLEDGEMENT.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }
  goNext() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.CONFIRM_PORTFOLIO]);
  }
}
