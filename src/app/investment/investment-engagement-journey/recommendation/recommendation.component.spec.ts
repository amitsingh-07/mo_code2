
import { RecommendationComponent } from './recommendation.component';
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { mockInvestmentEngagementJourneyService } from './../../../../assets/mocks/service/shared-service';
import { concat, Observable, of, throwError } from 'rxjs';

import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewEncapsulation
} from '@angular/core';

import { Injector,NO_ERRORS_SCHEMA } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { appConstants } from '../../../app.constants';


import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';

import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { AppService } from './../../../app.service';

import { ProfileIcons } from './profileIcons';
import { RiskProfile } from './riskprofile';


describe('RecommendationComponent', () => {
  let component: RecommendationComponent;
  let fixture: ComponentFixture<RecommendationComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let signUpService: SignUpService;
  let authService: AuthenticationService;
  let translateService: TranslateService;
  let investmentAccountService: InvestmentAccountService;
  let investmentCommonService: InvestmentCommonService;
  let investAccountService: mockInvestmentEngagementJourneyService;
  let loader: LoaderService;
  let injector: Injector;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let appService:AppService;
  let currencyPipe: CurrencyPipe;
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');
 const ProfileIcons = [
    { id: 1, icon: 'assets/images/conservative.svg' },
    { id: 2, icon: 'assets/images/moderate.svg' },
    { id: 3, icon: 'assets/images/balanced.svg' },
    { id: 4, icon: 'assets/images/growth.svg' },
    { id: 5, icon: 'assets/images/equity.svg' },
    { id: 6, icon: 'assets/images/nosutable.svg' },
    { id: 7, icon: 'assets/images/investment-account/wise-saver-icon.svg'}
  ];
   const icon ={};
   
  beforeEach(async(() => {
     TestBed.configureTestingModule({
        declarations: [RecommendationComponent],
        imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
          ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
        providers: [NgbActiveModal, AuthenticationService, DatePipe, TranslateService,
          InvestmentAccountService,
          LoaderService,
          CurrencyPipe,
        
          { provide: AppService, useValue: mockAppService },
          { provide: InvestmentAccountService, useClass: mockInvestmentEngagementJourneyService }],
          schemas: [NO_ERRORS_SCHEMA]
      })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [] } })
      .compileComponents()
       
    }));
  

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationComponent);
    component = fixture.componentInstance;
    injector = getTestBed();
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = TestBed.get(TranslateService);
    investmentAccountService = TestBed.get(InvestmentAccountService);
    investmentCommonService = TestBed.get(InvestmentCommonService);
    ngbModalService = TestBed.get(NgbModal);
    appService = TestBed.get(AppService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    
  });
  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('RISK_PROFILE.TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('RISK_PROFILE.TITLE');
  });

  it('Go To Homepage', () => {
    spyOn(component, 'goToHomepage').and.returnValue({});
    component.goToHomepage();
  });

  it('should dismissFlashScreen', () => {
    spyOn(component, 'dismissFlashScreen').and.returnValue({});
    component.dismissFlashScreen();
  });
  it('should showButton', () => {
    spyOn(component, 'showButton').and.returnValue({});
    component.showButton();
  });


});
