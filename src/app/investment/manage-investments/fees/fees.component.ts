import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../../../app.constants';
import { AppService } from '../../../app.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { RiskProfile } from '../../investment-engagement-journey/recommendation/riskprofile';
import { ManageInvestmentsService } from '../manage-investments.service';
import { environment } from './../../../../environments/environment';
@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeesComponent implements OnInit {

  pageTitle: string;
  subTitle: string;
  feeDetails;

  constructor(
    private appService: AppService,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    public modal: NgbModal,
    private renderer: Renderer2,
    public manageInvestmentsService: ManageInvestmentsService,
    private signUpService: SignUpService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService
  ) {       
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('Fees');
      this.setPageTitle(this.pageTitle);
      this.renderer.addClass(document.body, 'portfolioname-bg');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(105);
    } else {
      this.navbarService.setNavbarMode(103);
    }
    this.footerService.setFooterVisibility(false);
    this.getFeeDetails();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  getFeeDetails(){
    this.manageInvestmentsService.getFeeDetails().subscribe((data) => {
      this.feeDetails = data.objectList;
      console.log(this.feeDetails +'Fee Details')
    });
  }
  goToNext() {
    console.log('test1');
  }
  showHide(el) {
    if (el.style.display === '' || el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'portfolioname-bg');
  }
}




