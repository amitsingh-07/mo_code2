import { Location } from '@angular/common';
import {
  Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation, Input
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
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { SeoServiceService } from './../../../shared/Services/seo-service.service';
import { SlickComponent } from 'ngx-slick';

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
  investmentMoreInfoShow: boolean = false;
  wiseSaverMoreInfoShow: boolean = false;
  @ViewChild('carousel') carousel: SlickComponent;

  selectPortfolioForm: FormGroup;
  formValues;


  public imgUrl = 'assets/images/';
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
    this.formValues = this.investmentEngagementJourneyService.getSelectPortfolioType();
    this.selectPortfolioForm = new FormGroup({
      selectPortfolioType: new FormControl(
        this.formValues.selectPortfolioType, Validators.required)
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
    this.investmentEngagementJourneyService.setSelectPortfolioType(Form.value)
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
    this.redirectToNextScreen();
  }
  redirectToNextScreen() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.FUNDING_METHOD]);
  }
  investPortfolio(event) {
    this.investmentEnabled = !this.investmentEnabled;
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
  setSelectPortfolioType(event, value) {
    this.selectPortfolioForm.controls.selectPortfolioType.setValue(value);
    if (value === 'investPortfolio') {
      this.investmentEnabled = !this.investmentEnabled;
      this.wiseSaverEnabled = false;
    } else {
      this.wiseSaverEnabled = !this.wiseSaverEnabled;
      this.investmentEnabled = false;
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
