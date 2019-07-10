import { AfterViewInit, Component, OnInit, Renderer2, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
  showTwoPortfolio = false;
  showSinglePortfolio = false;
  showNoPortfolio = false;
  time;
  selectedRiskProfileId;
  portfolioButtonLabel;

  constructor(
    public readonly translate: TranslateService,
    public activeModal: NgbActiveModal,
    private router: Router,
    public headerService: HeaderService,
    private portfolioService: PortfolioService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2
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
    if (this.selectedRiskProfile.alternateRiskProfileId) {
    this.secondIcon = ProfileIcons[this.selectedRiskProfile.alternateRiskProfileId - 1]['icon'];
  }
    this.showButton();
    this. buttonLabel();
  }

  ngAfterViewInit() {
    if (this.portfolioService.getPortfolioRecommendationModalCounter() === 0) {
      this.renderer.addClass(document.body, 'modal-open'); // disable scroll to body
      this.portfolioService.setPortfolioSplashModalCounter(1);
      this.time = setTimeout(() => {
        this.animateStaticModal = true;
      }, 3000);

      setTimeout(() => {
        this.hideStaticModal = true;
        this.renderer.removeClass(document.body, 'modal-open'); // enable scroll to body
      }, 4000);
    } else {
      this.hideStaticModal = true;
    }
    this.cd.detectChanges();
  }
  dismissFlashScreen() {
    clearTimeout(this.time);
    this.animateStaticModal = true;
    this.hideStaticModal = true;
    this.renderer.removeClass(document.body, 'modal-open'); // enable scroll to body
   }
  goToNext(RiskProfileID) {
    this.portfolioService.setSelectedRiskProfileId(RiskProfileID);
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
  showButton() {
    if (this.selectedRiskProfile.riskProfileId === PORTFOLIO_CONFIG.risk_profile.should_not_invest_id) {
      this.showNoPortfolio = true;
    } else if (this.selectedRiskProfile.riskProfileId && this.selectedRiskProfile.alternateRiskProfileId) {
       // #this.showTwoPortfolio = true;
        this.showSinglePortfolio = true;
    } else {
      this.showSinglePortfolio = true;
    }
  }
  buttonLabel() {
    this.portfolioButtonLabel = {
      firstPortfolio: this.selectedRiskProfile.riskProfileName,
      secondPortfolio: this.selectedRiskProfile.alternateRiskProfileType,
     };
  }
}
