import { Location } from '@angular/common';
import {
  Component, HostListener, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

import { AppService } from '../../../app.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { InvestmentCommonService } from './../../investment-common/investment-common.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { SeoServiceService } from './../../../shared/Services/seo-service.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../../investment-common/investment-common.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';

@Component({
  selector: 'app-select-portfolio-goal-moreinfo',
  templateUrl: './select-portfolio-goal-moreinfo.component.html',
  styleUrls: ['./select-portfolio-goal-moreinfo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectPortfolioGoalMoreinfoComponent implements OnInit {
  pageTitle: string;
  isDisabled: boolean;
  errorMsg: string;
  @ViewChild('carousel') carousel: SlickCarouselComponent;

  selectPortfolioForm: FormGroup;
  selectedPortfolioType;
  public currentSlide = 0;
  // Set config for ng slick
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '',
    prevArrow: '',
    dots: true,
    infinite: false,
  };
  userPortfolioType: any;
  fundingMethods: any;
  loaderTitle: string;
  loaderDesc: string;
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private loaderService: LoaderService,
    private appService: AppService,
    public headerService: HeaderService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    private investmentCommonService: InvestmentCommonService,
    private investmentAccountService: InvestmentAccountService,
    private _location: Location,
    private seoService: SeoServiceService
  ) { 
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO.TITLE_NEW');
      this.setPageTitle(this.pageTitle);
      // Meta Tag and Title Methods
      this.seoService.setTitle(this.translate.instant('START.META.META_TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('START.META.META_TITLE'),
        this.translate.instant('START.META.META_DESCRIPTION'),
        this.translate.instant('START.META.META_KEYWORDS'));
    });
    this.userPortfolioType = investmentEngagementJourneyService.getUserPortfolioType();
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.selectedPortfolioType = this.investmentEngagementJourneyService.getSelectPortfolioType();
    this.selectPortfolioForm = new FormGroup({
      selectPortfolioType: new FormControl(
        this.selectedPortfolioType, Validators.required)
    });
    this.getOptionListCollection();
  }
  @HostListener('input', ['$event'])

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  goBack() {
    this._location.back();
  }
  goNext(Form) {
    this.redirectToNextScreen();
  }
  getOptionListCollection() {
    this.loaderService.showLoader({
      title: this.loaderTitle,
      desc: this.loaderDesc
    });
    this.investmentAccountService.getSpecificDropList('portfolioFundingMethod').subscribe((data) => {
      this.loaderService.hideLoader();
      this.fundingMethods = data.objectList.portfolioFundingMethod;
      this.investmentEngagementJourneyService.sortByProperty(this.fundingMethods, 'name', 'asc');

    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  getFundingMethodNameByName(fundingMethodName, fundingOptions) {
    if (fundingMethodName && fundingOptions) {
      const fundingMethod = fundingOptions.filter(
        (prop) => prop.name.toUpperCase() === fundingMethodName.toUpperCase()
      );
      return fundingMethod[0].id;
    } else {
      return '';
    }
  }
  redirectToNextScreen() {
    if (this.userPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT_ID) {
      const fundingMethod = this.getFundingMethodNameByName(INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.CASH, this.fundingMethods);
      this.investmentCommonService.setInitialFundingMethod({ initialFundingMethodId: fundingMethod });
      if (this.selectPortfolioForm.controls.selectPortfolioType && this.selectPortfolioForm.controls.selectPortfolioType.value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO) {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
      } else if (this.selectPortfolioForm.controls.selectPortfolioType && this.selectPortfolioForm.controls.selectPortfolioType.value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO) {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WISE_INCOME_PAYOUT]);
      }
      else {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
      }
    }
    // CPF_PORTFOLIO
    else if (this.selectPortfolioForm.controls.selectPortfolioType && this.selectPortfolioForm.controls.selectPortfolioType.value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.CPF_PORTFOLIO) {
      const fundingMethod = this.getFundingMethodNameByName(INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.CPF_OA, this.fundingMethods);
      this.investmentCommonService.setInitialFundingMethod({ initialFundingMethodId: fundingMethod });
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CPF_PREREQUISITES]);
    }
    else {
      if (this.selectPortfolioForm.controls.selectPortfolioType && this.selectPortfolioForm.controls.selectPortfolioType.value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO) {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WISE_INCOME_PAYOUT]);
      } else {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.FUNDING_METHOD]);
      }
    }
  }
  // Go to next slide
  nextSlide() {
    this.carousel.slickNext();
  }
  // Go back previous slide
  prevSlide() {
    this.carousel.slickPrev();
  }
  // Go to specific slide
  goToSlide(slide) {
    this.carousel.slickGoTo(slide);
  }
  // Setting the next slide index on beforeChange event fire
  beforeSlideChange(e) {
    this.currentSlide = e.nextSlide;
  }

  get selectPortfolioInfo() {
    return JSON.parse(sessionStorage.getItem('app_engage_journey_session')).selectPortfolioType;
  }
}
