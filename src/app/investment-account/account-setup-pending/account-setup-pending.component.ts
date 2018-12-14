import { SIGN_UP_ROUTE_PATHS } from 'src/app/sign-up/sign-up.routes.constants';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-account-setup-pending',
  templateUrl: './account-setup-pending.component.html',
  styleUrls: ['./account-setup-pending.component.scss']
})
export class AccountSetupPendingComponent implements OnInit {

  status: string;
  statuses;

  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private formBuilder: FormBuilder,
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
    this.navbarService.setNavbarDirectGuided(false);
    this.footerService.setFooterVisibility(false);
    this.statuses = INVESTMENT_ACCOUNT_CONFIG.status;
    this.status = this.investmentAccountService.getAccountCreationStatus();
    console.log(this.status);
  }
  redirectToDashboard() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
}

}
