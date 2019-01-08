import { CurrencyPipe } from '@angular/common';
import { Token } from '@angular/compiler';
import {
  AfterContentInit, Component, HostListener, OnInit, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpService } from '../../sign-up/sign-up.service';

import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';

import { PortfolioService } from '../../portfolio/portfolio.service';

import { RiskProfile } from '../../portfolio/risk-profile/riskprofile';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';

import { TopUpAndWithdrawFormData } from '../topup-and-withdraw-form-data';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';


@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetAllocationComponent implements OnInit {
  pageTitle: string;
  portfolio;
  selectedRiskProfile: RiskProfile;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  helpDate: any;
  editPortfolio: any;
  buttonTitle: any;
  event1 = true;
  event2 = true;
  userInputSubtext;
  assetAllocation;

  constructor(
    private appService: AppService,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private currencyPipe: CurrencyPipe,
    public authService: AuthenticationService,
    public modal: NgbModal,
    public topupAndWithDrawService: TopupAndWithDrawService,
    private signUpService: SignUpService,
    private portfolioService: PortfolioService) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('Asset Allocation');

      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.assetAllocation = this.topupAndWithDrawService.getSelectedPortfolio();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  constructgetAllocationParams() {
    const formData = this.portfolioService.getRiskProfile();
    const enqId = this.authService.getEnquiryId();
    return {
      riskProfileId: formData.riskProfileId,
      enquiryId: enqId
    };
  }

  selectAllocation(event) {
    if ((!this.isAllocationOpen)) {
      this.breakdownSelectionindex = event;
      this.isAllocationOpen = true;
    } else {
      if (event !== this.breakdownSelectionindex) {
        // different tab
        this.breakdownSelectionindex = event;
        this.isAllocationOpen = true;
      } else {
        // same tab click
        this.breakdownSelectionindex = null;
        this.isAllocationOpen = false;
      }
    }
  }

  showLoginOrSignupModal() {
    const errorMessage = this.translate.instant('PRELOGIN_MODAL.DESC');
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorMessageHTML = errorMessage;
    ref.componentInstance.primaryActionLabel = this.translate.instant('PRELOGIN_MODAL.LOG_IN');
    ref.componentInstance.secondaryActionLabel = this.translate.instant('PRELOGIN_MODAL.CREATE_ACCOUNT');
    ref.componentInstance.secondaryActionDim = true;
    ref.componentInstance.primaryAction.subscribe(() => {
      // Login
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.ROOT);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    });
    ref.componentInstance.secondaryAction.subscribe(() => {
      // Sign up
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.POSTLOGIN);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
    });
  }

  goToNext() {
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    this.showLoginOrSignupModal();
  }
}
