import { CurrencyPipe } from '@angular/common';
import { Token } from '@angular/compiler';
import { AfterContentInit, AfterViewInit, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { PortfolioService } from './../portfolio.service';
import { RiskProfile } from '../risk-profile/riskprofile';

import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-portfolio-recommendation',
  templateUrl: './portfolio-recommendation.component.html',
  styleUrls: ['./portfolio-recommendation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioRecommendationComponent implements OnInit, AfterViewInit {
  animateStaticModal = false;
  hideStaticModal = false;
  pageTitle: string;
  portfolio;
  selectedRiskProfile:RiskProfile;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;

  legendColors: string[] = ['#3cdacb', '#ec681c', '#76328e'];

  helpDate: any;
  editPortfolio: any;
  constructor(
    private router: Router,
    public headerService: HeaderService,
    private translate: TranslateService,
    private currencyPipe: CurrencyPipe,
    public authService: AuthenticationService,
    public modal: NgbModal,
    private portfolioService: PortfolioService) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.TITLE');
      self.editPortfolio = this.translate.instant('PORTFOLIO_RECOMMENDATION.editModel');
      self.helpDate = this.translate.instant('PORTFOLIO_RECOMMENDATION.helpDate');
      this.setPageTitle(this.pageTitle, null, false);
    });
  }

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
    this.getPortfolioAllocationDeatails();
    this.selectedRiskProfile = this.portfolioService.getRiskProfile();
    console.log(this.selectedRiskProfile.riskProfileName); 

  }
  ngAfterViewInit() {

    if (this.portfolioService.getPortfolioRecommendationModalCounter() === 0) {
      this.portfolioService.setPortfolioRecommendationModalCounter(1);
      setInterval(() => {
        this.animateStaticModal = true;
      }, 2000);

      setInterval(() => {
        this.hideStaticModal = true;
      }, 3000);
    } else {
      this.hideStaticModal = true;
    }
  }
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }
  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.helpDate.modalTitle;
    ref.componentInstance.errorMessage = this.helpDate.modalMessage;
    return false;
  }
  showEditModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.editPortfolio.modalTitle;
    ref.componentInstance.errorMessage = this.editPortfolio.modalMessage;
  }
  showWhatTheRisk() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);

  }
  showWhatFubdDetails() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);
  }
  getPortfolioAllocationDeatails() {
    // this.authService.authenticate().subscribe((Token)=>{
    this.portfolioService.getPortfolioAllocationDeatails().subscribe((data) => {
      this.portfolio = data.objectList;
    });
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

  viewFundDetails(fund) {
    this.portfolioService.setFund(fund);
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.FUND_DETAILS])


  }
}
