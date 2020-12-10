import { InvestmentPeriodComponent } from './investment-period.component';
import { IntroScreenComponent } from '../intro-screen/intro-screen.component';
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import { TranslateService } from '@ngx-translate/core';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NouisliderComponent } from 'ng2-nouislider';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { IPageComponent } from '../../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';
import { HttpClientModule } from '@angular/common/http';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { DatePipe } from '@angular/common';

describe('InvestmentPeriodComponent', () => {
  let component: InvestmentPeriodComponent;
  let fixture: ComponentFixture<InvestmentPeriodComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let translateService: TranslateService
  let injector: Injector;
  let investmentEngagementJourneyService: InvestmentEngagementJourneyService;
  let signUpService: SignUpService;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentPeriodComponent, NouisliderComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        HttpClientModule,
      JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal,
        InvestmentEngagementJourneyService,
        SignUpService,
        DatePipe],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentPeriodComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    translateService = TestBed.get(TranslateService);
    translateService = injector.get(TranslateService);
    signUpService: TestBed.get(SignUpService);
    investmentEngagementJourneyService = TestBed.get(InvestmentEngagementJourneyService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();

  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    console.log(component);
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

  it('should call go next', () => {
    let investmentPeriod = component.personalInfoForm.controls['investmentPeriod'];
    expect(investmentPeriod.valid).toBeFalsy();
    component.goToNext(investmentPeriod);
    spyOn(router, 'navigate');
    component.save(investmentPeriod);
    expect(router.navigate).toHaveBeenCalledWith([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
  });
  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('PERSONAL_INFO.STEP_1_LABEL');
    expect(setPageTitleSpy).toHaveBeenCalledWith('PERSONAL_INFO.STEP_1_LABEL', undefined, undefined, undefined, undefined, 'Step 1');
  });
  it('should set page isValueBetweenRange()', () => {
    component.isValueBetweenRange(12, 1, 40);
  });
  it('should set page isValueBetweenRange()', () => {
    component.showModalPopUp(4);

  });
});
