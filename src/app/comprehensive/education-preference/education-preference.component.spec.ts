import { IComprehensiveDetails } from './../comprehensive-types';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location, APP_BASE_HREF, DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule, Router, Routes, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, throwError } from 'rxjs';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';



import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { APP_ROUTES } from '../../app-routes.constants';
import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { SignUpService } from '../../sign-up/sign-up.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyProfile } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { environment } from './../../../environments/environment';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import {
  LoginCreateAccountModelComponent
} from './../../shared/modal/login-create-account-model/login-create-account-model.component';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Util } from './../../shared/utils/util';




import { tokenGetterFn, mockCurrencyPipe } from
  '../../../assets/mocks/service/shared-service';


import { HeaderService } from './../../shared/header/header.service';
import { createTranslateLoader } from '../comprehensive.module';

import { ApiService } from './../../shared/http/api.service';

import { StepIndicatorComponent } from './../../shared/components/step-indicator/step-indicator.component';
import { COMPREHENSIVE_ROUTES } from './../comprehensive-routes.constants';
import { AboutAge } from './../../shared/utils/about-age.util';
import { RoutingService } from './../../shared/Services/routing.service';

import { FileUtil } from './../../shared/utils/file.util';



class MockRouter {
  navigateByUrl(url: string) { return url; }
}
import { EducationPreferenceComponent } from './education-preference.component';

describe('EducationPreferenceComponent', () => {
  let component: EducationPreferenceComponent;
  let fixture: ComponentFixture<EducationPreferenceComponent>;

  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;

  let footerService: FooterService;
  let translateService: TranslateService;
  let http: HttpTestingController;
  let navbarService: NavbarService;
  let appService: AppService;
  let authService: AuthenticationService;
  let apiService: ApiService;
  let comprehensiveService: ComprehensiveService;
  let loader: LoaderService;
  let comprehensiveAPiService: ComprehensiveApiService;
  let router: Router;
  const route = ({ routeConfig: { component: { name: 'DependantSelectionComponent' } } } as any) as ActivatedRoute;
  let httpClientSpy;
  let currencyPipe: CurrencyPipe;
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };
  //let translations: any = '';
  let translations = require('../../../assets/i18n/comprehensive/en.json');
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EducationPreferenceComponent, ErrorModalComponent, StepIndicatorComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        }),
        NgbModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetterFn
          }
        }),
        HttpClientTestingModule,
        //RouterTestingModule.withRoutes(routes),
        RouterTestingModule.withRoutes([]),
        //RouterModule.forRoot(routes)
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        NgbModal,
        NgbActiveModal,
        EducationPreferenceComponent,
        ApiService,
        AuthenticationService,
        TranslateService,
        CurrencyPipe,
        DatePipe,
        { provide: CurrencyPipe, useValue: mockCurrencyPipe },
        { provide: AppService, useValue: mockAppService },
        FooterService,
        NavbarService,
        HeaderService,
        LoaderService,
        FormBuilder,
        ComprehensiveService,
        ComprehensiveApiService,
        AboutAge,
        RoutingService,
        JwtHelperService,
        FileUtil,

        // { provide: APP_BASE_HREF, useValue: '/' },
        // { provide: Router, useClass: RouterStub },

        { provide: ActivatedRoute, useValue: route }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorModalComponent, StepIndicatorComponent] } })
      .compileComponents();
    router = TestBed.get(Router);
    //router.initialNavigation();
    //spyOn(router, 'navigateByUrl');
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(EducationPreferenceComponent);
    component = fixture.componentInstance;

    ngbModalService = TestBed.get(NgbModal);
    injector = getTestBed();
    loader = TestBed.get(LoaderService);
    location = TestBed.get(Location);
    http = TestBed.get(HttpTestingController);
    formBuilder = TestBed.get(FormBuilder);

    appService = TestBed.get(AppService);
    apiService = TestBed.get(ApiService);
    authService = TestBed.get(AuthenticationService);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    translateService = injector.get(TranslateService);
    //translateService.use('en');
    comprehensiveService = TestBed.get(ComprehensiveService);
    //comprehensiveAPiService = TestBed.get(comprehensiveAPiService);

    //router = new RouterStub();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);


    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });


  afterEach(() => {
    TestBed.resetTestingModule();
    const summaryData: any =  {"comprehensiveEnquiry":{"enquiryId":130580,"sessionTrackerId":51756,"type":"Comprehensive","hasComprehensive":true,"hasDependents":true,"hasEndowments":"0","hasRegularSavingsPlans":true,"generatedTokenForReportNotification":null,"stepCompleted":4,"subStepCompleted":0,"reportStatus":"submitted","isValidatedPromoCode":true,"homeLoanUpdatedByLiabilities":false,"isLocked":true,"isDobUpdated":false,"dobPopUpEnable":false,"isDobChangedInvestment":null,"isConfirmationEmailSent":true,"paymentStatus":"PENDING","reportSubmittedTimeStamp":"2020-12-08T04:34:48.000+0000"},"baseProfile":{"firstName":"sws m","lastName":"sws","dateOfBirth":"25/04/1969","dateOfBirthInvestment":"","nation":null,"gender":"male","genderInvestment":"","email":"ntpraveen22@yopmail.com","mobileNumber":"98982222","nationalityStatus":"Others","dobUpdateable":true,"journeyType":null,"staff":false,"smoker":false},"dependentsSummaryList":{"dependentsList":[{"id":5723,"enquiryId":130580,"name":"ch","relationship":"Child","gender":"Female","dateOfBirth":"24/12/2004","nation":"Singaporean","isInsuranceNeeded":false},{"id":5724,"enquiryId":130580,"name":"ede","relationship":"Parent","gender":"Male","dateOfBirth":"23/05/1987","nation":"Singaporean","isInsuranceNeeded":false}],"noOfHouseholdMembers":3,"houseHoldIncome":"$5,001 to $6,500","noOfYears":null},"dependentEducationPreferencesList":[{"id":1399,"dependentId":5723,"enquiryId":130580,"location":null,"educationCourse":null,"endowmentMaturityAmount":1000.0,"endowmentMaturityYears":2020,"educationSpendingShare":53}],"comprehensiveIncome":{"enquiryId":130580,"employmentType":"Employed","monthlySalary":10000.0,"monthlyRentalIncome":0.0,"otherMonthlyWorkIncome":600.0,"otherMonthlyIncome":null,"annualBonus":8887.0,"annualDividends":88.0,"otherAnnualIncome":80.0},"comprehensiveSpending":{"enquiryId":130580,"monthlyLivingExpenses":4000.0,"adHocExpenses":700.0,"homeLoanPayOffUntil":2020,"mortgagePaymentUsingCPF":null,"mortgagePaymentUsingCash":null,"mortgageTypeOfHome":null,"mortgagePayOffUntil":null,"carLoanPayment":77.0,"carLoanPayoffUntil":2020,"otherLoanPayment":22.0,"otherLoanPayoffUntil":2020,"HLMortgagePaymentUsingCPF":77.0,"HLMortgagePaymentUsingCash":1000.0,"HLtypeOfHome":"New HDB"},"comprehensiveRegularSavingsList":[{"enquiryId":130580,"regularUnitTrust":"MoneyOwl - Equity","amount":55.0,"fundType":"Cash"},{"enquiryId":130580,"regularUnitTrust":"","fundType":null,"amount":null}],"comprehensiveDownOnLuck":{"enquiryId":130580,"badMoodMonthlyAmount":500.0,"hospitalPlanId":5,"hospitalPlanName":"Government Hospital Ward B2/C"},"comprehensiveAssets":{"enquiryId":130580,"cashInBank":100.0,"savingsBonds":200.0,"cpfOrdinaryAccount":null,"cpfSpecialAccount":null,"cpfMediSaveAccount":null,"cpfRetirementAccount":null,"schemeType":null,"estimatedPayout":null,"topupAmount":null,"withdrawalAmount":null,"retirementSum":null,"homeMarketValue":1000.0,"investmentPropertiesValue":100.0,"assetsInvestmentSet":[{"assetId":866,"typeOfInvestment":"MoneyOwl - Growth","investmentAmount":100.0}],"otherAssetsValue":100.0,"source":"MANUAL"},"comprehensiveLiabilities":{"enquiryId":130580,"homeLoanOutstandingAmount":null,"otherPropertyLoanOutstandingAmount":null,"otherLoanOutstandingAmount":null,"carLoansAmount":null},"comprehensiveInsurancePlanning":{"id":null,"enquiryId":130580,"haveHospitalPlan":null,"haveCPFDependentsProtectionScheme":null,"lifeProtectionAmount":0.0,"haveHDBHomeProtectionScheme":null,"homeProtectionCoverageAmount":null,"otherLifeProtectionCoverageAmount":0.0,"criticalIllnessCoverageAmount":0.0,"disabilityIncomeCoverageAmount":0.0,"haveLongTermElderShield":null,"longTermElderShieldAmount":0,"isDefaultLifeProtectionAmount":null,"haveHospitalPlanWithRider":0,"otherLongTermCareInsuranceAmount":0.0,"shieldType":"elderShield","haveTakenCareShieldQuestions":true,"haveLongTermPopup":false,"calculatedMonthlyPayout":null},"comprehensiveRetirementPlanning":{"enquiryId":130580,"retirementAge":"52","haveOtherSourceRetirementIncome":false,"retirementIncomeSet":[],"lumpSumBenefitSet":[]},"recommendedPortfolio":null,"riskAssessmentAnswer":null};
    comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
    comprehensiveService.setComprehensiveSummary(summaryData);
    spyOn(comprehensiveService, 'getComprehensiveVersion').and.returnValue(true);
    spyOn(comprehensiveService, 'getChildEndowment').and.returnValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngInit', () => {
    component.ngOnInit();
  
  });
   it('ngAfterViewInit', () => {
    component.ngAfterViewInit();
    //component.ciMultiplierSliders['_results'][0].writeValue(100);
  
  });
  it('ngOnDestroy', () => {
    component.ngOnDestroy();
  
  });
  
  it('build Education Form', () => {
    component.buildEducationPreferenceForm();
  
  });
  
  it('TootLtip', () => {
    component.showToolTipModal('CHILD_EDUCATION_EXPENSES_TITLE','CHILD_EDUCATION_EXPENSES_MESSAGE');
  
  });
  it('slider', () => {
    component.onSliderChange(0,0);
  
  });
  
    it('should call go next', () => {
      spyOn(router, 'navigate');
      component.goToNext(component.EducationPreferenceForm);
      expect(router.navigate).toHaveBeenCalledWith([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST]);
    });
  
  
  
  it('Validate', () => {
    component.validateEducationPreference(component.EducationPreferenceForm);
  
  });

  it('Validate', () => {
    component.selectLocation("singapore",0);
  
  });
  it('Validate', () => {
    component.selectCourse("Medicine",0);
  
  });
  it('Validate', () => {
    component. buildPreferenceDetailsForm({});
  
  });
 
  
 
  // it('should execute ngOnInit', () => {
  //   const setNavbarModeSpy = spyOn( component.ciMultiplierSliders['_results'][1], 'writeValue');
  //   component.ngAfterViewInit();
  //   expect(setNavbarModeSpy).toHaveBeenCalledWith(1);

  // });
  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitleWithIcon');
    component.setPageTitle('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE', { id: 'EducationPreferenceComponent', iconClass: 'navbar__menuItem--journey-map' });
  });

});
