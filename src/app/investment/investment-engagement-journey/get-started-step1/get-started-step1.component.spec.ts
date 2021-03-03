import { GetStartedStep1Component } from './get-started-step1.component';
import { IntroScreenComponent } from '../intro-screen/intro-screen.component';
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
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
import { Injector } from '@angular/core';


describe('GetStartedStep2Component', () => {
  let component: GetStartedStep1Component;
  let fixture: ComponentFixture<GetStartedStep1Component>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let signUpService: SignUpService;
  let authService: AuthenticationService;
  let translateService: TranslateService;
  let injector: Injector;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetStartedStep1Component, IntroScreenComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal, AuthenticationService, DatePipe, TranslateService],
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedStep1Component);
    injector = getTestBed();
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = injector.get(TranslateService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture = TestBed.createComponent(GetStartedStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create GetStarted Screen', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });
  it('should call go back', () => {
    component.goBack();
  });

  it('should call go next', () => {
    spyOn(router, 'navigate');
    component.goNext();
    expect(router.navigate).toHaveBeenCalledWith([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.PERSONAL_INFO]);
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);

  });


  it('should create GetStarted Screen title Content', () => {
    expect(component.title).toBe('Step 1');
    expect(component.description).toBe('Your Risk Ability');
    expect(component.description2).toBe('In the next step, we will assess your ability to take risk. Your inputs will determine the recommendations suggested.');
  });


});