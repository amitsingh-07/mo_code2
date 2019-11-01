import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
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
  fundingMethodNameCash;
  fundingMethodNameSrs;
  loaderTitle: string;
  loaderDesc: string;

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    private modal: NgbModal,
    private loaderService: LoaderService,
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
      self.pageTitle = this.translate.instant('FUNDING_METHOD.TITLE');
      self.loaderTitle = this.translate.instant('FUNDING_METHOD.LOADER_TITLE');
      self.loaderDesc = this.translate.instant('FUNDING_METHOD.LOADER_DESC');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getOptionListCollection();
    this.formValues = this.investmentCommonService.getInitialFundingMethod();
    this.fundingMethodForm = new FormGroup({
      initialFundingMethodId: new FormControl(
        this.formValues.initialFundingMethodId, Validators.required)
    });
  }
  getOptionListCollection() {
    this.loaderService.showLoader({
      title: this.loaderTitle,
      desc: this.loaderDesc
    });
    this.investmentAccountService.getFundMethodList().subscribe((data) => {
      this.loaderService.hideLoader();
      this.fundingMethods = data.objectList.portfolioFundingMethod;
      this.investmentEngagementJourneyService.sortByProperty(this.fundingMethods, 'name', 'asc');

    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  getFundingMethodNameById(fundingMethodId, fundingOptions) {
    if (fundingMethodId && fundingOptions) {
      const fundingMethod = fundingOptions.filter(
        (prop) => prop.id === fundingMethodId
      );
      return fundingMethod[0].name;
    }
  }

  getOperatorIdByName(operatorId, OperatorOptions) {
    const OperatorBank = OperatorOptions.filter(
      (prop) => prop.id === operatorId
    );
    return OperatorBank[0];
  }

  showHelpModal() {
    const ref = this.modal.open(SrsTooltipComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('FUNDING_METHOD.HELP_MODAL.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'FUNDING_METHOD.HELP_MODAL.DESC1'
    );
  }
  goToNext(form) {
    this.investmentCommonService.setInitialFundingMethod(form.value);
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  }
}
