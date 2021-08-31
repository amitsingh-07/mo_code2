import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';

@Component({
  selector: 'app-select-portfolio-type',
  templateUrl: './select-portfolio-type.component.html',
  styleUrls: ['./select-portfolio-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectPortfolioTypeComponent implements OnInit {

  pageTitle: string;
  selectedPortfolio: any;
  portfolioTypeForm: FormGroup;
  constructor(
    private router: Router,
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService

    ) { 
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
        this.pageTitle = this.translate.instant('SELECT_PORTFOLIO_TYPE.PAGE_TITLE');
        this.setPageTitle(this.pageTitle);
      });
    }

  ngOnInit() {
    this.buildPortfolioFormType();
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  goToNext() {
    if (this.portfolioTypeForm.valid) {
      if (this.authService.isSignedUser()) {
        this.portfolioTypeForm.value?.portfolioType === '2' ? this.selectedPortfolio = INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT : this.selectedPortfolio = INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.PERSONAL_ACCOUNT;
        this.selectedPortfolio === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT ? this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.ADD_SECONDARY_HOLDER_DETAILS]) : this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
      } 
    }
  }
  buildPortfolioFormType() {
    this.portfolioTypeForm = new FormGroup({
      portfolioType: new FormControl('', Validators.required)
    });
  }
}
