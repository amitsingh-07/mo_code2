import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import {
    INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';

@Component({
  selector: 'app-funding-method',
  templateUrl: './funding-method.component.html',
  styleUrls: ['./funding-method.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingMethodComponent implements OnInit {
  pageTitle: string;
  fundingMethodForm: FormGroup;
  formBuilder: any;
  options = ['Cash', 'SRS'];
  showContentCash = false;
  showContentSrs = false;

  formValues;
  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    private _location: Location,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    public signUpService: SignUpService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('Select Funding Method');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.formValues = this.investmentEngagementJourneyService.getFundingMethod();
    this.fundingMethodForm = new FormGroup({
      fundingMethod: new FormControl(
        this.formValues.fundingMethod, Validators.required)
    });
  }
  goToNext(form) {
    this.investmentEngagementJourneyService.setFundingMethod(form.value);
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  fundChange(value) {
    if (value === 'Cash') {
        this.showContentCash = true;
        this.showContentSrs = false;
    } else {
      this.showContentSrs = true;
      this.showContentCash = false;

    }
  }
}
