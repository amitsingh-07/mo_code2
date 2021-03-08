import { IComprehensiveDetails } from './../comprehensive-types';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location, APP_BASE_HREF } from '@angular/common';
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

import { BadMoodFundComponent } from './bad-mood-fund.component';

import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyLiabilities, IMySummaryModal } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Util } from './../../shared/utils/util';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

import { CurrencyPipe } from '@angular/common';
import { appConstants } from './../../app.constants';

import { tokenGetterFn, mockCurrencyPipe } from
  '../../../assets/mocks/service/shared-service';

import { FooterService } from './../../shared/footer/footer.service';
import { HeaderService } from './../../shared/header/header.service';
import { createTranslateLoader } from '../comprehensive.module';
import { AppService } from './../../app.service';
import { ApiService } from './../../shared/http/api.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

import { ErrorModalComponent } from './../../shared/modal/error-modal/error-modal.component';
import { StepIndicatorComponent } from './../../shared/components/step-indicator/step-indicator.component';
import { COMPREHENSIVE_ROUTES } from './../comprehensive-routes.constants';
import { AboutAge } from './../../shared/utils/about-age.util';
import { RoutingService } from './../../shared/Services/routing.service';
export class TestComponent {
}
export const routes: Routes = [
  {
    path: COMPREHENSIVE_ROUTES.MY_ASSETS,
    component: TestComponent
  },
  { path: COMPREHENSIVE_ROUTES.BAD_MOOD_FUND, component: TestComponent },
  { path: COMPREHENSIVE_ROUTES.STEPS + '/3', component: TestComponent },
];
class MockRouter {
  navigateByUrl(url: string) { return url; }
}


// tslint:disable-next-line: max-classes-per-file
export class RouterStub {
  public url: string = COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES;
  constructor() { }
  navigate(url: any) {
    return this.url = url;
  }
}

describe('BadMoodFundComponent', () => {
  let component: BadMoodFundComponent;
  let fixture: ComponentFixture<BadMoodFundComponent>;
  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;


  let comp: BadMoodFundComponent;
  let progressTrackerService: ProgressTrackerService;
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
  const route = ({ routeConfig: { component: { name: 'BadMoodFundComponent'} } } as any) as ActivatedRoute;
  let httpClientSpy;
  let currencyPipe: CurrencyPipe;
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };
  //let translations: any = '';
  let translations = require('../../../assets/i18n/comprehensive/en.json');
  function updateForm(userInfo) {
    component.hospitalPlanForm.controls['hospitalPlanId'].setValue(userInfo.hospitalPlanId);
    component.hospitalPlanForm.controls['badMoodMonthlyAmount'].setValue(userInfo.badMoodMonthlyAmount);   
  }
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BadMoodFundComponent, ErrorModalComponent, StepIndicatorComponent],
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
        BadMoodFundComponent,
        ApiService,
        AuthenticationService,
        TranslateService,
        CurrencyPipe,
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
        ProgressTrackerService,
       // { provide: APP_BASE_HREF, useValue: '/' },
       // { provide: Router, useClass: RouterStub },

       {provide: ActivatedRoute, useValue: route}
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorModalComponent, StepIndicatorComponent] } })
      .compileComponents();
    router = TestBed.get(Router);	
    //router.initialNavigation();
    //spyOn(router, 'navigateByUrl');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadMoodFundComponent);
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
    progressTrackerService = TestBed.get(ProgressTrackerService);
    //router = new RouterStub();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    //router = TestBed.get(Router);
	
    translateService.setTranslation('en', translations);
	translateService.use('en');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    const summaryData: any = { comprehensiveEnquiry:{ enquiryId:131297,sessionTrackerId:55877,type:'Comprehensive-Lite',hasComprehensive:true,hasDependents:false,hasEndowments:'0',hasRegularSavingsPlans:false,generatedTokenForReportNotification:null,stepCompleted:4,subStepCompleted:0,reportStatus:'edit',isValidatedPromoCode:false,homeLoanUpdatedByLiabilities:null,isLocked:false,isDobUpdated:true,dobPopUpEnable:false,isDobChangedInvestment:null,isConfirmationEmailSent:null,paymentStatus:null,reportSubmittedTimeStamp:'2020-05-06T21:31:35.000+0000'},baseProfile:{firstName:'rini',lastName:'test',dateOfBirth:'06/10/1988',dateOfBirthInvestment:'06/10/1988',nation:null,gender:'male',genderInvestment:'male',email:'mo2uatapr2_1@yopmail.com',mobileNumber:'8998110734',nationalityStatus:'Singapore PR',dobUpdateable:false,journeyType:'Investment',smoker:false},"dependentsSummaryList":{"dependentsList":[],"noOfHouseholdMembers":2,"houseHoldIncome":"Below $2,000","noOfYears":0},"dependentEducationPreferencesList":[],comprehensiveIncome:{enquiryId:131297,employmentType:'Employed',monthlySalary:70000.0,monthlyRentalIncome:0.0,otherMonthlyWorkIncome:0.0,otherMonthlyIncome:0.0,annualBonus:null,annualDividends:0.0,otherAnnualIncome:0.0},comprehensiveSpending:{enquiryId:131297,monthlyLivingExpenses:60000.0,adHocExpenses:null,homeLoanPayOffUntil:null,mortgagePaymentUsingCPF:0.0,mortgagePaymentUsingCash:0.0,mortgageTypeOfHome:'',mortgagePayOffUntil:null,carLoanPayment:0.0,carLoanPayoffUntil:null,otherLoanPayment:null,otherLoanPayoffUntil:null,HLMortgagePaymentUsingCPF:null,HLMortgagePaymentUsingCash:null,HLtypeOfHome:''},comprehensiveRegularSavingsList:[],comprehensiveDownOnLuck:{enquiryId:131297,badMoodMonthlyAmount:300.0,hospitalPlanId:2,hospitalPlanName:'Government Hospital Ward A'},comprehensiveAssets:{enquiryId:131297,cashInBank:7000.0,savingsBonds:8000.0,cpfOrdinaryAccount:null,cpfSpecialAccount:null,cpfMediSaveAccount:null,cpfRetirementAccount:null,schemeType:null,estimatedPayout:null,topupAmount:null,withdrawalAmount:null,retirementSum:null,homeMarketValue:0.0,investmentPropertiesValue:0.0,assetsInvestmentSet:[{assetId:628,typeOfInvestment:'MoneyOwl - Equity',investmentAmount:null}],otherAssetsValue:0.0,source:'MANUAL'},comprehensiveLiabilities:{enquiryId:131297,homeLoanOutstandingAmount:null,otherPropertyLoanOutstandingAmount:0.0,otherLoanOutstandingAmount:null,carLoansAmount:0.0},comprehensiveInsurancePlanning:null,comprehensiveRetirementPlanning:{enquiryId:131297,retirementAge:'45',haveOtherSourceRetirementIncome:null,retirementIncomeSet:[],lumpSumBenefitSet:[]}};
    comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.LITE);
    comprehensiveService.setComprehensiveSummary(summaryData);
    spyOn(comprehensiveService, 'getComprehensiveVersion').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitleWithIcon');
    component.setPageTitle('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE', { id: 'RegularSavingPlanComponent', iconClass: 'navbar__menuItem--journey-map' });
  });
  
  it('form valid', () => {
    expect(component.hospitalPlanForm.valid).toBe(true);
  });

  it('Bad mood fund form valid', () => {
    const userInfo = {
      hospitalPlanId: 1,
      badMoodMonthlyAmount: 0
    };

    updateForm(userInfo);
    expect(component.hospitalPlanForm.valid).toBe(true);

    //component.save();
  });

  it('Trigger Tooltip', () => {
	const showModal = component.showToolTipModal('TITLE', 'DESCRIPTION');
  });
  
  it('should redirect to Bad mood', () => {
    const navigateSpy = spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledWith(['../comprehensive/my-assets']);
  });

  it('should trigger ngOnInit', () => {
    component.ngOnInit();
  });

  it('should trigger ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should trigger ngAfterViewInit', () => {
    component.ngAfterViewInit();
  });
  
  it('should trigger goToNext', () => {
    component.goToNext(component.hospitalPlanForm);
  });
  
  it('should trigger updateProgressTracker()() ', () => {
    component.updateProgressTracker() ;
  });
  
  it('should trigger buildDownOnLuckForm() ', () => {
    component.buildDownOnLuckForm();
  });
  
  it('should trigger validateForm ', () => {
    component.validateForm(component.hospitalPlanForm);
  });
  
  it('should trigger onSliderChange ', () => {
    component.onSliderChange(0);
  });  

});
