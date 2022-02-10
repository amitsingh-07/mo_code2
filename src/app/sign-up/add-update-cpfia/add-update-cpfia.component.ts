import { Component, HostListener, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subject, Subscription } from 'rxjs';

import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { InvestmentEngagementJourneyService } from '../../investment/investment-engagement-journey/investment-engagement-journey.service';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';

import { InvestmentCommonService } from '../../investment/investment-common/investment-common.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-add-update-cpfia',
  templateUrl: './add-update-cpfia.component.html',
  styleUrls: ['./add-update-cpfia.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUpdateCpfiaComponent implements OnInit {
  pageTitle: string;
  addUpdateCpfFrom: FormGroup;
  formValues;
  investmentAccountFormValues;
  fundingMethods: any;
  cpfAgentBankList;
  cpfDetail;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  subscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private footerService: FooterService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpService: SignUpService,
    private authService: AuthenticationService,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    public readonly translate: TranslateService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit(): void {
    this.subscribeBackEvent();
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('ADD_UPDATE_CPF.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.footerService.setFooterVisibility(false);
  }
  subscribeBackEvent() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE])
      }
    });
  }
}
