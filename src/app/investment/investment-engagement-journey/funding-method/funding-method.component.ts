import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { SrsTooltipComponent } from '../srs-tooltip/srs-tooltip.component';

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
  fundingMethods;
  formValues;

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    private modal: NgbModal,
    private _location: Location,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    public signUpService: SignUpService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    private investmentAccountService: InvestmentAccountService,
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
    this.getOptionListCollection();
    this.formValues = this.investmentCommonService.getFundingMethod();
    this.fundingMethodForm = new FormGroup({
      initialFundingMethodId: new FormControl(
        this.formValues.initialFundingMethodId, Validators.required)
    });
  }

  getOptionListCollection() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.fundingMethods = data.objectList.portfolioFundingMethod;
     },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  goToNext(form) {
    this.investmentCommonService.setInitialFundingMethod(form.value);
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  showHelpModal() {
    const ref = this.modal.open(SrsTooltipComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('FUNDING_METHOD.HELP_MODAL.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'FUNDING_METHOD.HELP_MODAL.DESC1'
    );
  }
}
