import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-account-setup-completed',
  templateUrl: './account-setup-completed.component.html',
  styleUrls: ['./account-setup-completed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSetupCompletedComponent implements OnInit {
  formValues;
  pageTitle: string;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private topupAndWithDrawService: TopupAndWithDrawService,
    private modal: NgbModal,
    public footerService: FooterService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {});
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
    this.footerService.setFooterVisibility(false);
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
  }
  redirectToFund() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FUND_INTRO]);
  }
}
