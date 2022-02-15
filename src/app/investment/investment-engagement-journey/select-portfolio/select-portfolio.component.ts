import { Location } from '@angular/common';
import {
  Component, HostListener, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { NgbNavChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { appConstants } from '../../../app.constants';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { InvestmentCommonService } from './../../investment-common/investment-common.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { SeoServiceService } from './../../../shared/Services/seo-service.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';

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
  cpfEnabled = false;
  investmentMoreInfoShow: boolean = false;
  wiseSaverMoreInfoShow: boolean = false;
  wiseIncomeMoreInfoShow: boolean = false;
  activeTabId = 1;
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
  cpfProgressAvailable: boolean;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private appService: AppService,
    public headerService: HeaderService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    private _location: Location,
    private seoService: SeoServiceService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal
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
    this.userPortfolioType = investmentEngagementJourneyService.getUserPortfolioType();
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getCKAData(); 
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
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO_GOAL_MORE_INFO]);
  }
  setSelectPortfolioType(value,form) {
    this.selectPortfolioForm.controls.selectPortfolioType.setValue(value);
    if (value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO) {
      this.investmentEnabled = !this.investmentEnabled;
      this.wiseSaverEnabled = false;
      this.wiseIncomeEnabled = false;
      this.cpfEnabled = false; // cpf portfolio flag
    }
    if (value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO) {
      this.wiseSaverEnabled = !this.wiseSaverEnabled;
      this.investmentEnabled = false;
      this.wiseIncomeEnabled = false;
      this.cpfEnabled = false; // cpf portfolio flag
    }
    if (value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO) {
      this.wiseIncomeEnabled = !this.wiseIncomeEnabled;
      this.investmentEnabled = false;
      this.wiseSaverEnabled = false;
      this.cpfEnabled = false; // cpf portfolio flag
    }
    if (value === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.CPF_PORTFOLIO) {
      this.cpfEnabled = !this.cpfEnabled;
      this.investmentEnabled = false;
      this.wiseSaverEnabled = false;
      this.wiseIncomeEnabled = false;
    }
    this.goNext(form);
  }
  isJointAccount(){
    const userPortfolioType = this.investmentEngagementJourneyService.getUserPortfolioType();
    return userPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT_ID;
  }
  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }
  getCKAData() {
    this.showLoader();
    this.investmentCommonService.getCKAAssessmentStatus().subscribe((data) => {
      this.loaderService.hideLoaderForced();
      const responseMessage = data.responseMessage;
      if (responseMessage && responseMessage.responseCode === 6000) {
          console.log(data.objectList);
          if(data.objectList) {
            this.cpfProgressAvailable = data.objectList.cpfProgressAvailable;
          } else {
            this.cpfProgressAvailable = false;
          }
        }
    }, () => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  onNavChange(changeEvent: NgbNavChangeEvent) {
    console.log(changeEvent.nextId);
    if (changeEvent.nextId === 2 && this.cpfProgressAvailable) {
      this.showProgressModal();
      changeEvent.preventDefault();
    }
  }
  showProgressModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'PORTFOLIO.PROGRESS_POPUP.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'PORTFOLIO.PROGRESS_POPUP.DESCRIPTION'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'PORTFOLIO.PROGRESS_POPUP.BUTTON'
    );
    ref.componentInstance.closeBtn = false;
  }
}
