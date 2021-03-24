import { SelectPortfolioComponent } from './select-portfolio.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { HttpClientModule } from '@angular/common/http';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Location } from '@angular/common';
import {
  Component, HostListener, Injector, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { appConstants } from '../../../app.constants';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { HeaderService } from '../../../shared/header/header.service';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { SeoServiceService } from './../../../shared/Services/seo-service.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';

describe('SelectPortfolioComponent', () => {
  let component: SelectPortfolioComponent;
  let fixture: ComponentFixture<SelectPortfolioComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let signUpService: SignUpService;
  let authService: AuthenticationService;
  let translateService: TranslateService;
  let currencyPipe: CurrencyPipe;
  let appService: AppService;
  let injector: Injector;
  let investmentEngagementJourneyService: InvestmentEngagementJourneyService;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPortfolioComponent, SlickCarouselComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal, AuthenticationService,
        DatePipe,
        TranslateService,
        CurrencyPipe,
        { provide: AppService, useValue: mockAppService }
      ],
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPortfolioComponent);
    // component.carousel =
    //   TestBed.createComponent(SlickCarouselComponent).componentInstance;
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = TestBed.get(TranslateService);
    investmentEngagementJourneyService = TestBed.get(InvestmentEngagementJourneyService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call go back', () => {
    component.goBack();
  });

  it('should call go next', () => {
    spyOn(router, 'navigate');
    component.redirectToNextScreen();
    expect(router.navigate).toHaveBeenCalledWith([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.FUNDING_METHOD]);
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    expect(component.selectPortfolioForm.valid).toBeFalsy();
    component.selectPortfolioForm.controls['selectPortfolioType'].setValue('wiseSaverPortfolio');
    expect(component.selectPortfolioForm.valid).toBeTruthy();
  });




  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitleWithIcon');
    // #this.pageTitle = this.translate.instant('PORTFOLIO.TITLE');

    component.setPageTitle('PORTFOLIO.TITLE');
    // expect(setPageTitleSpy).toHaveBeenCalledWith('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE', { id: 'MyLiabilitiesComponent', iconClass: 'navbar__menuItem--journey-map' });
  });

  it('should call go next', () => {
    component.goNext(component.selectPortfolioForm);
    investmentEngagementJourneyService.setSelectPortfolioType(component.selectPortfolioForm);
    component.redirectToNextScreen();
    //appService.setJourneyType(appConstants.JOURNEY_TYPE_INVESTMENT);
  });
});
