import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { AppService } from '../../../app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { appConstants } from '../../../app.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';

@Component({
  selector: 'app-risk-acknowledgement',
  templateUrl: './risk-acknowledgement.component.html',
  styleUrls: ['./risk-acknowledgement.component.scss']
})
export class RiskAcknowledgementComponent implements OnInit {

  pageTitle: string;
  title = this.translate.instant('RISK_ACKNOWLEDGMENT.TITLE');
  description = this.translate.instant('RISK_ACKNOWLEDGMENT.DESC');
  img = 'assets/images/investment-account/risk-ack.svg';
  description2 = this.translate.instant('GETSTARTED_STEP1.DESCRIPTION');
  tab = '1';

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    private _location: Location,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    private appService: AppService,
    public modal: NgbModal,
    private signUpService: SignUpService,
    public investmentAccountService: InvestmentAccountService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private manageInvestmentsService: ManageInvestmentsService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.title = this.translate.instant('RISK_ACKNOWLEDGMENT.TITLE');
      this.description = this.translate.instant('RISK_ACKNOWLEDGMENT.DESC');

    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    if (!this.authService.isAuthenticated()) {
      this.authService.authenticate().subscribe((token) => {
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
    }
  }
  goBack() {
    this._location.back();
  }
  goNext() {
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    if (this.authService.isSignedUser()) {
      this.investmentCommonService.getAccountCreationActions().subscribe((data) => {
        if (this.investmentCommonService.isUserNotAllowed(data)) {
          this.investmentCommonService.goToDashboard();
        } else if (this.investmentCommonService.isUsersFirstPortfolio(data)) {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.START]);
        } else {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ACKNOWLEDGEMENT]);
        }
      });
    } else {
      this.showLoginOrSignupModal();
    }
  }
  showLoginOrSignupModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorMessageHTML = this.translate.instant('PRELOGIN_MODAL.DESC');
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'PRELOGIN_MODAL.LOG_IN'
    );
    ref.componentInstance.secondaryActionLabel = this.translate.instant(
      'PRELOGIN_MODAL.CREATE_ACCOUNT'
    );
    ref.componentInstance.secondaryActionDim = true;
    ref.componentInstance.primaryAction.subscribe(() => {
      // Login
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.ROOT);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    });
    ref.componentInstance.secondaryAction.subscribe(() => {
      // Sign up
      this.signUpService.setRedirectUrl(INVESTMENT_ACCOUNT_ROUTE_PATHS.START);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
    });
  }


}
