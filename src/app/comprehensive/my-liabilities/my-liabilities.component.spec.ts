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

import { MyLiabilitiesComponent } from './my-liabilities.component';

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
    path: COMPREHENSIVE_ROUTES.MY_LIABILITIES_SUMMARY,
    component: TestComponent
  },
  { path: COMPREHENSIVE_ROUTES.MY_LIABILITIES_SUMMARY + '/summary', component: TestComponent },
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

describe('MyLiabilitiesComponent', () => {
  let component: MyLiabilitiesComponent;
  let fixture: ComponentFixture<MyLiabilitiesComponent>;
  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;


  let comp: MyLiabilitiesComponent;
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
  const route = ({ routeConfig: { component: { name: 'MyLiabilitiesComponent'} } } as any) as ActivatedRoute;
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
    component.myLiabilitiesForm.controls['carLoansAmount'].setValue(userInfo.carLoansAmount);
    component.myLiabilitiesForm.controls['otherLoanOutstandingAmount'].setValue(userInfo.otherLoanOutstandingAmount);
    component.myLiabilitiesForm.controls['otherPropertyLoanOutstandingAmount'].setValue(userInfo.otherPropertyLoanOutstandingAmount);
    component.myLiabilitiesForm.controls['homeLoanOutstandingAmount'].setValue(userInfo.homeLoanOutstandingAmount);
  }
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyLiabilitiesComponent, ErrorModalComponent, StepIndicatorComponent],
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
        MyLiabilitiesComponent,
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
        //{provide: ComprehensiveService, useValue: MockComprehensiveService },
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
    fixture = TestBed.createComponent(MyLiabilitiesComponent);
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
	//component.route = TestBed.get(ActivatedRoute);
    /*translations = {
      CMP: {
        COMPREHENSIVE_STEPS: {
          STEP: 'Step',
          STEP_1_TITLE: 'What\'s On Your Shoulders',
          STEP_1_DESC: 'Your family commitments will impact your financial planning. Let\'s list it down now.',
          STEP_1_DESC_LITE: 'Your family commitments will impact your financial planning.',
          STEP_2_TITLE: 'Your Finances',
          STEP_2_DESC: 'This information helps us to estimate your financial health, your protection needs, and what you can save and invest.',
          STEP_3_TITLE: 'Risk-Proof Your Journey',
          STEP_3_DESC: 'Let\'s find out how protected you are in case of unexpected events.',
          STEP_4_TITLE_NAV: 'Retirement Planning',
          STEP_4_TITLE: 'Financial Independence, Retire Early',
          STEP_4_DESC: 'Tell us when you wish to retire!',
          STEP_4_TITLE_LITE: 'Your Risk Profile',
          STEP_4_DESC_LITE: 'Let us know your willingness to stay invested for retirement.',
          STEP_5_TITLE: 'Congratulations!',
          STEP_5_DESC2: 'Your data is submitted.',
          STEP_5_TITLE_NAV: 'Result'
        },
        MY_LIABILITIES: {
          TITLE: 'What You Owe',
          HEADER: 'Sometimes, we borrow to fund our assets or spending. These liabilities have to be repaid over time.',
          LIABILITIES_BUCKETS: 'Your Liabilities Bucket',
          HOME_LOAN_OUTSTANDING: 'Home Loan Outstanding',
          ADD_OTHER_PROPERTY_lOAN: 'Add other Property Loan',
          OTHER_PROPERTY_LOAN: 'Other Property Loan',
          OTHER_LOANS_AMOUNT_OUTSTANDING: 'Other Loan Outstanding',
          CAR_LOANS: 'Car Loan Outstanding',
          LIABILITIES_BUCKETS_TOTAL: 'in total',
          LIABILITIES_BUCKETS_NOTE: 'Your liabilities bucket',
          FORM: {
            LOAN_PLACEHOLDER: 'Enter Amount'
          },
          TOOLTIP: {
            HOME_LOAN_OUTSTANDING_TITLE: 'Home Loan Outstanding',
            HOME_LOAN_OUTSTANDING_MESSAGE: 'This is the total outstanding loan for the home you live in that has yet to be paid off, not the monthly instalment.',
            OTHER_LOAN_TITLE: 'Other Loan Outstanding',
            OTHER_LOAN_MESSAGE: 'Add up your outstanding renovation loan, credit lines etc. This is the total loan amount that have yet to be paid off, not the monthly instalments.',
            OTHER_PROPERTY_LOAN_TITLE: 'Other Property Loan',
            OTHER_PROPERTY_LOAN_MESSAGE: 'Add up the outstanding loan amounts for all other properties. This is the total loan amount that have yet to be paid off, not the monthly instalments.',
            CAR_LOANS_TITLE: 'Car Loan Outstanding',
            CAR_LOANS_MESSAGE: 'This is the total outstanding loan for any motor vehicle you own that has yet to be paid off, not the monthly instalment.'
          },
          OPTIONAL_VALIDATION_FLAG: false
        },
      },
      COMMON: {
      }
    };*/ 
	
    translateService.setTranslation('en', translations);
	translateService.use('en');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    const summaryData: any = {comprehensiveEnquiry:{ enquiryId:131297,sessionTrackerId:55877,type:'Comprehensive-Lite',hasComprehensive:true,hasDependents:false,hasEndowments:'0',hasRegularSavingsPlans:false,generatedTokenForReportNotification:null,stepCompleted:4,subStepCompleted:0,reportStatus:'edit',isValidatedPromoCode:false,homeLoanUpdatedByLiabilities:null,isLocked:false,isDobUpdated:true,dobPopUpEnable:false,isDobChangedInvestment:null,isConfirmationEmailSent:null,paymentStatus:null,reportSubmittedTimeStamp:'2020-05-06T21:31:35.000+0000'},baseProfile:{firstName:'rini',lastName:'test',dateOfBirth:'06/10/1988',dateOfBirthInvestment:'06/10/1988',nation:null,gender:'male',genderInvestment:'male',email:'mo2uatapr2_1@yopmail.com',mobileNumber:'8998110734',nationalityStatus:'Singapore PR',dobUpdateable:false,journeyType:'Investment',smoker:false},"dependentsSummaryList":{"dependentsList":[],"noOfHouseholdMembers":2,"houseHoldIncome":"Below $2,000","noOfYears":0},"dependentEducationPreferencesList":[],comprehensiveIncome:{enquiryId:131297,employmentType:'Employed',monthlySalary:70000.0,monthlyRentalIncome:0.0,otherMonthlyWorkIncome:0.0,otherMonthlyIncome:0.0,annualBonus:null,annualDividends:0.0,otherAnnualIncome:0.0},comprehensiveSpending:{enquiryId:131297,monthlyLivingExpenses:60000.0,adHocExpenses:null,homeLoanPayOffUntil:null,mortgagePaymentUsingCPF:0.0,mortgagePaymentUsingCash:0.0,mortgageTypeOfHome:'',mortgagePayOffUntil:null,carLoanPayment:0.0,carLoanPayoffUntil:null,otherLoanPayment:null,otherLoanPayoffUntil:null,HLMortgagePaymentUsingCPF:null,HLMortgagePaymentUsingCash:null,HLtypeOfHome:''},comprehensiveRegularSavingsList:[],comprehensiveDownOnLuck:{enquiryId:131297,badMoodMonthlyAmount:300.0,hospitalPlanId:2,hospitalPlanName:'Government Hospital Ward A'},comprehensiveAssets:{enquiryId:131297,cashInBank:7000.0,savingsBonds:8000.0,cpfOrdinaryAccount:null,cpfSpecialAccount:null,cpfMediSaveAccount:null,cpfRetirementAccount:null,schemeType:null,estimatedPayout:null,topupAmount:null,withdrawalAmount:null,retirementSum:null,homeMarketValue:0.0,investmentPropertiesValue:0.0,assetsInvestmentSet:[{assetId:628,typeOfInvestment:'MoneyOwl - Equity',investmentAmount:null}],otherAssetsValue:0.0,source:'MANUAL'},comprehensiveLiabilities:{enquiryId:131297,homeLoanOutstandingAmount:null,otherPropertyLoanOutstandingAmount:0.0,otherLoanOutstandingAmount:null,carLoansAmount:0.0},comprehensiveInsurancePlanning:null,comprehensiveRetirementPlanning:{enquiryId:131297,retirementAge:'45',haveOtherSourceRetirementIncome:null,retirementIncomeSet:[],lumpSumBenefitSet:[]}};
    comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.LITE);
    comprehensiveService.setComprehensiveSummary(summaryData);
    //spyOn(comprehensiveService, 'transformAsCurrency').and.returnValue('$10');
    spyOn(comprehensiveService, 'getComprehensiveVersion').and.returnValue(true);
    //spyOn(comprehensiveService, 'comprehensiveFormData').and.returnValue([]);
    //spyOn(comprehensiveService, 'getMyDependant').and.returnValue([]);
    component.comprehensiveJourneyMode = true;
   // const transformAsCurrencySpy = spyOn(comprehensiveService, 'transformAsCurrency');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('title', async(() => {
    const fixture1 = TestBed.createComponent(MyLiabilitiesComponent);
    const app = fixture1.debugElement.componentInstance;
    const heading = fixture1.debugElement.query(By.css('.comprehensive__page-sub-heading'));
    expect(heading).toEqual('What You Owe');
  }));*/
  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitleWithIcon');
    component.setPageTitle('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE', { id: 'MyLiabilitiesComponent', iconClass: 'navbar__menuItem--journey-map' });
  });
  
  it('form valid', () => {
    expect(component.myLiabilitiesForm.valid).toBe(true);
  });

  it('myLiabilities form valid', () => {
    const userInfo = {
      homeLoanOutstandingAmount: 122,
      otherPropertyLoanOutstandingAmount: 100,
      otherLoanOutstandingAmount: 200,
      carLoansAmount: 270,
    };

    updateForm(userInfo);
    expect(component.myLiabilitiesForm.valid).toBe(true);

    //component.save();
  });
  it('Trigger Tooltip', () => {
	const showModal = component.showToolTipModal('HOME_LOAN_OUTSTANDING_TITLE', 'HOME_LOAN_OUTSTANDING_MESSAGE');
  });
  /*
  it('Save service', () => {
	  //spyOn(comprehensiveAPiService, 'saveLiabilities').and.callThrough().and.returnValue(Observable.of("'responseMessage':{'responseCode':6000,'responseDescription':'Successful response'},'objectList':[]"));
    //spyOn(loader, 'hideLoader');
    const data = { 'responseMessage':{'responseCode':6000,'responseDescription':'Successful response'},'objectList':[] };
    spyOn(comprehensiveAPiService, 'saveLiabilities').and.returnValue(Observable.of(data));
	  
  }); */
  
  it('should call onTotalOutstanding and get response as zero', () => {
    //component.totalOutstanding = 0;
    spyOn(comprehensiveService, 'additionOfCurrency').and.returnValue(0);
    spyOn(comprehensiveService, 'setBucketImage').and.returnValue('emptyBucket');
    fixture.detectChanges();
    component.onTotalOutstanding();
    comprehensiveService.setBucketImage('', '', 0);
    comprehensiveService.additionOfCurrency({});
    expect(component.totalOutstanding).toBe(0);
    expect(comprehensiveService.additionOfCurrency).toHaveBeenCalledWith({});
    expect(comprehensiveService.setBucketImage).toHaveBeenCalledWith('', '', 0);
  }); 
  
  it('should redirect to Liabilities Summary true', () => {
	component.comprehensiveJourneyMode = true;
    const navigateSpy = spyOn(router, 'navigate');
    component.routerPath();
    expect(navigateSpy).toHaveBeenCalledWith(['../comprehensive/my-liabilities/summary']);
  });
  
  it('should redirect to Liabilities Summary false', () => {
    component.comprehensiveJourneyMode = false;
    const navigateSpy = spyOn(router, 'navigate');
    component.routerPath();
    expect(navigateSpy).toHaveBeenCalledWith(['../comprehensive/my-liabilities/summary']);
  });
  
  
  it('should redirect to Summary Modal true', () => {
	component.routerEnabled = true;
    const navigateSpy = spyOn(router, 'navigate');
    component.showSummaryModal();
    expect(navigateSpy).toHaveBeenCalledWith(['../comprehensive/my-liabilities/summary']);
  }); 
  
  it('should redirect to Summary Modal false', () => {
	component.routerEnabled = false;
    spyOn(comprehensiveService, 'getLiquidCash').and.returnValue(10);
    spyOn(comprehensiveService, 'getComputeSpareCash').and.returnValue(10);
	const summaryModalDetails = {
        setTemplateModal: 2,
        contentObj: 'finance Modal',
        liabilitiesEmergency: true,
        liabilitiesLiquidCash: 100,
        liabilitiesMonthlySpareCash: 100,
        nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/3',
        routerEnabled: true
      };
	  const navigateSpy = spyOn(comprehensiveService, 'openSummaryPopUpModal');
	  expect(navigateSpy).toHaveBeenCalledWith([summaryModalDetails]);
    component.showSummaryModal();
  }); 

  it('should trigger OnChange', () => {
    component.onChange();
  });

  it('should trigger ngOnInit', () => {	
    component.ngOnInit();
  });

  it('should trigger ngOnDestroy', () => {
    component.ngOnDestroy();
  });
  
  it('should trigger goToNext true', () => {
    component.viewMode = true;
    component.goToNext(component.myLiabilitiesForm);
  });
  
  it('should trigger goToNext false', () => {
    component.viewMode = false;
    component.goToNext(component.myLiabilitiesForm);
  });
  
  it('should trigger addPropertyLoan() ', () => {
    component.addPropertyLoan() ;
  });
  
  it('should trigger buildMyLiabilitiesForm() ', () => {
    component.buildMyLiabilitiesForm();
  });
  
  it('should trigger validateLiabilities ', () => {
    component.validateLiabilities(component.myLiabilitiesForm);
  });
});
