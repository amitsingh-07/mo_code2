import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PORTFOLIO_CONFIG } from '../../portfolio/portfolio.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';
import { RiskProfile } from '../risk-profile/riskprofile';
import { ProfileIcons } from './profileIcons';

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RiskProfileComponent implements OnInit, AfterViewInit {
  animateStaticModal = false;
  hideStaticModal = false;
  iconImage;
  profileid: number;
  riskProfile: string;
  htmlDescription: string;
  selectedRiskProfile: RiskProfile;
  formValues;
  pageTitle: string;
  secondIcon;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public headerService: HeaderService,
    private portfolioService: PortfolioService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RISK_PROFILE.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.selectedRiskProfile = this.portfolioService.getRiskProfile();
    this.iconImage = ProfileIcons[this.selectedRiskProfile.riskProfileId - 1]['icon'];
    this.secondIcon = ProfileIcons[this.selectedRiskProfile.alternateRiskProfileId - 1]['icon'];
  }

  ngAfterViewInit() {
    if (this.portfolioService.getPortfolioRecommendationModalCounter() === 0) {
      this.portfolioService.setPortfolioSplashModalCounter(1);
      setTimeout(() => {
        this.animateStaticModal = true;
      }, 3000);

      setTimeout(() => {
        this.hideStaticModal = true;
      }, 4000);
    } else {
      this.hideStaticModal = true;
    }
  }

  goToNext() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.PORTFOLIO_RECOMMENDATION]);
  }
  goToHomepage() {
    this.router.navigate(['home']);
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  canProceed() {
    return (
      this.selectedRiskProfile.riskProfileId !==
      PORTFOLIO_CONFIG.risk_profile.should_not_invest_id
    );
  }
}
