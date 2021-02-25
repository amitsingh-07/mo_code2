import { Location } from '@angular/common';
import {
  Component, HostListener, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { appConstants } from '../../../app.constants';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { SeoServiceService } from './../../../shared/Services/seo-service.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';

@Component({
  selector: 'app-select-portfolio',
  templateUrl: './select-portfolio.component.html',
  styleUrls: ['./select-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectPortfolioComponent implements OnInit {
  pageTitle: string;
  isDisabled: boolean;
  errorMsg: string;
  investmentEnabled: boolean = false;
  wiseSaverEnabled: boolean = false;
  wiseIncomeEnabled: boolean = false;
  investmentMoreInfoShow: boolean = false;
  wiseSaverMoreInfoShow: boolean = false;
  wiseIncomeMoreInfoShow: boolean = false;
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
    private _location: Location,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private seoService: SeoServiceService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO.TITLE');
      this.setPageTitle(this.pageTitle);
      // Meta Tag and Title Methods
      this.seoService.setTitle(this.translate.instant('START.META.META_TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('START.META.META_TITLE'),
        this.translate.instant('START.META.META_DESCRIPTION'),
        this.translate.instant('START.META.META_KEYWORDS'));
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.selectedPortfolioType = this.investmentEngagementJourneyService.getSelectPortfolioType();
    this.selectPortfolioForm = new FormGroup({
      selectPortfolioType: new FormControl(
        this.selectedPortfolioType, Validators.required)
    });
  }
  @HostListener('input', ['$event'])

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  goBack() {
    this._location.back();
  }
  goNext(Form) {
    this.investmentEngagementJourneyService.setSelectPortfolioType(Form.value);
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    this.redirectToNextScreen();
  }
  redirectToNextScreen() {
    if (this.selectPortfolioForm.controls.selectPortfolioType && this.selectPortfolioForm.controls.selectPortfolioType.value === 'wiseIncomePortfolio') {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WISE_INCOME_PAYOUT]);
    } else {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.FUNDING_METHOD]);
    }
  }
  investPortfolio(event) {
    this.investmentEnabled = !this.investmentEnabled;
    this.wiseSaverEnabled = false;
    this.wiseIncomeEnabled = false;
  }
  wiseSaverPortfolio(event) {
    this.wiseSaverEnabled = !this.wiseSaverEnabled;
    this.investmentEnabled = false;
    this.wiseIncomeEnabled = false;
  }
  wiseIncomePortfolio(event) {
    this.wiseIncomeEnabled = !this.wiseIncomeEnabled;
    this.investmentEnabled = false;
    this.wiseSaverEnabled = false;
  }
  investmentMoreInfo(event) {
    this.investmentMoreInfoShow = !this.investmentMoreInfoShow;
    event.stopPropagation();
  }
  wiseSaverMoreInfo(event) {
    this.wiseSaverMoreInfoShow = !this.wiseSaverMoreInfoShow;
    event.stopPropagation();
  }
  wiseIncomeMoreInfo(event) {
    this.wiseIncomeMoreInfoShow = !this.wiseIncomeMoreInfoShow;
    event.stopPropagation();
  }
  setSelectPortfolioType(value) {
    this.selectPortfolioForm.controls.selectPortfolioType.setValue(value);
    if (value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO) {
      this.investmentEnabled = !this.investmentEnabled;
      this.wiseSaverEnabled = false;
      this.wiseIncomeEnabled = false;
    }
    if (value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO) {
      this.wiseSaverEnabled = !this.wiseSaverEnabled;
      this.investmentEnabled = false;
      this.wiseIncomeEnabled = false;
    }
    if (value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO) {
      this.wiseIncomeEnabled = !this.wiseIncomeEnabled;
      this.investmentEnabled = false;
      this.wiseSaverEnabled = false;
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

}
