
import { YourInvestmentAmountComponent } from './your-investment-amount.component';

import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { concat, Observable, of, throwError } from 'rxjs';

import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { SrsTooltipComponent } from '../srs-tooltip/srs-tooltip.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IPageComponent } from '../../../shared/interfaces/page-component.interface';

import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';

describe('YourInvestmentAmountComponent', () => {
  let component: YourInvestmentAmountComponent;
  let fixture: ComponentFixture<YourInvestmentAmountComponent>;
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
  let investmentEngagementJourneyService: InvestmentEngagementJourneyService;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');

  const investmentCriteria: any = {
    "oneTimeInvestmentMinimum": 100,
    "monthlyInvestmentMinimum": 50
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YourInvestmentAmountComponent],
      imports: [BrowserAnimationsModule, FormsModule, TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, AuthenticationService, DatePipe, TranslateService,
        InvestmentAccountService,
        LoaderService,
        { provide: InvestmentAccountService }],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SrsTooltipComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourInvestmentAmountComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = TestBed.get(TranslateService);
    investmentAccountService = TestBed.get(InvestmentAccountService);
    investmentCommonService = TestBed.get(InvestmentCommonService);
    ngbModalService = TestBed.get(NgbModal);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should return data", () => {
    let investmentCriteria: { "exception": null, "objectList": { "oneTimeInvestmentMinimum": 100, "monthlyInvestmentMinimum": 50 }, "responseMessage": { "responseCode": 6000, "responseDescription": "Successful response" } }
    investmentCommonService.getInvestmentCriteria('Invest').subscribe(res => {
      console.log(investmentCriteria + '  ' + 'investmentCriteria');
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    const investmentCriteria: any = { "exception": null, "objectList": { "oneTimeInvestmentMinimum": 100, "monthlyInvestmentMinimum": 50 }, "responseMessage": { "responseCode": 6000, "responseDescription": "Successful response" } };
    console.log(investmentCriteria);
  });

  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('MY_FINANCIALS.STEP_1_LABEL');
    expect(setPageTitleSpy).toHaveBeenCalledWith('MY_FINANCIALS.STEP_1_LABEL', undefined, undefined, undefined, undefined, 'Step 1');
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
  it('should buildForm', () => {
    spyOn(component, 'buildInvestAmountForm').and.returnValue({});
    component.buildInvestAmountForm();
    // expect(loadDDCRoadmapSpy).toHaveBeenCalled();
  });
});
