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

import { MySpendingsComponent } from './my-spendings.component';

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
    path: COMPREHENSIVE_ROUTES.MY_SPENDINGS,
    component: TestComponent
  },
  { path: COMPREHENSIVE_ROUTES.REGULAR_SAVING_PLAN, component: TestComponent },
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

class MockComprehensiveApiService {
  generateComprehensiveReport(reportData): Observable<any> {
    return of({});
  }
  saveExpenses(reportData): Observable<any> {
    return of({});
  }
}

describe('MySpendingsComponent', () => {
  let component: MySpendingsComponent;
  let fixture: ComponentFixture<MySpendingsComponent>;
  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;

  let routerNavigateSpy: jasmine.Spy;

  let comp: MySpendingsComponent;
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
  let comprehensiveApiService: ComprehensiveApiService;
  let router: Router;
  const route = ({ routeConfig: { component: { name: 'MySpendingsComponent'} } } as any) as ActivatedRoute;
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
    component.mySpendingsForm.controls['monthlyLivingExpenses'].setValue(userInfo.monthlyLivingExpenses);
    component.mySpendingsForm.controls['adHocExpenses'].setValue(userInfo.adHocExpenses);
    component.mySpendingsForm.controls['HLMortgagePaymentUsingCPF'].setValue(userInfo.HLMortgagePaymentUsingCPF);
    component.mySpendingsForm.controls['HLMortgagePaymentUsingCash'].setValue(userInfo.HLMortgagePaymentUsingCash);
    component.mySpendingsForm.controls['HLtypeOfHome'].setValue(userInfo.HLtypeOfHome);
    component.mySpendingsForm.controls['homeLoanPayOffUntil'].setValue(userInfo.homeLoanPayOffUntil);
    component.mySpendingsForm.controls['mortgagePaymentUsingCPF'].setValue(userInfo.mortgagePaymentUsingCPF);
    component.mySpendingsForm.controls['mortgagePaymentUsingCash'].setValue(userInfo.mortgagePaymentUsingCash);
    component.mySpendingsForm.controls['mortgageTypeOfHome'].setValue(userInfo.mortgageTypeOfHome);
    component.mySpendingsForm.controls['mortgagePayOffUntil'].setValue(userInfo.mortgagePayOffUntil);
    component.mySpendingsForm.controls['carLoanPayment'].setValue(userInfo.carLoanPayment);
    component.mySpendingsForm.controls['carLoanPayoffUntil'].setValue(userInfo.carLoanPayoffUntil);
    component.mySpendingsForm.controls['otherLoanPayment'].setValue(userInfo.otherLoanPayment);
    component.mySpendingsForm.controls['otherLoanPayoffUntil'].setValue(userInfo.otherLoanPayoffUntil);
  }
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MySpendingsComponent, ErrorModalComponent, StepIndicatorComponent],
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
        MySpendingsComponent,
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
        {provide: ComprehensiveApiService, useValue: MockComprehensiveApiService },
        //ComprehensiveApiService,
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
    fixture = TestBed.createComponent(MySpendingsComponent);
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
    comprehensiveApiService = TestBed.get(ComprehensiveApiService);
    progressTrackerService = TestBed.get(ProgressTrackerService);
    //router = new RouterStub();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    //router = TestBed.get(Router);
	
    routerNavigateSpy = spyOn(TestBed.get(Router), 'navigate');
    translateService.setTranslation('en', translations);
	translateService.use('en');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    const summaryData: any = {comprehensiveEnquiry:{ enquiryId:131297,sessionTrackerId:55877,type:'Comprehensive-Lite',hasComprehensive:true,hasDependents:false,hasEndowments:'0',hasRegularSavingsPlans:false,generatedTokenForReportNotification:null,stepCompleted:4,subStepCompleted:0,reportStatus:'edit',isValidatedPromoCode:false,homeLoanUpdatedByLiabilities:null,isLocked:false,isDobUpdated:true,dobPopUpEnable:false,isDobChangedInvestment:null,isConfirmationEmailSent:null,paymentStatus:null,reportSubmittedTimeStamp:'2020-05-06T21:31:35.000+0000'},baseProfile:{firstName:'rini',lastName:'test',dateOfBirth:'06/10/1988',dateOfBirthInvestment:'06/10/1988',nation:null,gender:'male',genderInvestment:'male',email:'mo2uatapr2_1@yopmail.com',mobileNumber:'8998110734',nationalityStatus:'Singapore PR',dobUpdateable:false,journeyType:'Investment',smoker:false},"dependentsSummaryList":{"dependentsList":[],"noOfHouseholdMembers":2,"houseHoldIncome":"Below $2,000","noOfYears":0},"dependentEducationPreferencesList":[],comprehensiveIncome:{enquiryId:131297,employmentType:'Employed',monthlySalary:70000.0,monthlyRentalIncome:0.0,otherMonthlyWorkIncome:0.0,otherMonthlyIncome:0.0,annualBonus:null,annualDividends:0.0,otherAnnualIncome:0.0},comprehensiveSpending:{enquiryId:131297,monthlyLivingExpenses:60000.0,adHocExpenses:null,homeLoanPayOffUntil:null,mortgagePaymentUsingCPF:0.0,mortgagePaymentUsingCash:0.0,mortgageTypeOfHome:'',mortgagePayOffUntil:null,carLoanPayment:0.0,carLoanPayoffUntil:null,otherLoanPayment:null,otherLoanPayoffUntil:null,HLMortgagePaymentUsingCPF:null,HLMortgagePaymentUsingCash:null,HLtypeOfHome:''},comprehensiveRegularSavingsList:[],comprehensiveDownOnLuck:{enquiryId:131297,badMoodMonthlyAmount:300.0,hospitalPlanId:2,hospitalPlanName:'Government Hospital Ward A'},comprehensiveAssets:{enquiryId:131297,cashInBank:7000.0,savingsBonds:8000.0,cpfOrdinaryAccount:null,cpfSpecialAccount:null,cpfMediSaveAccount:null,cpfRetirementAccount:null,schemeType:null,estimatedPayout:null,topupAmount:null,withdrawalAmount:null,retirementSum:null,homeMarketValue:0.0,investmentPropertiesValue:0.0,assetsInvestmentSet:[{assetId:628,typeOfInvestment:'MoneyOwl - Equity',fundType:'Cash',investmentAmount:null}],otherAssetsValue:0.0,source:'MANUAL'},comprehensiveLiabilities:{enquiryId:131297,homeLoanOutstandingAmount:null,otherPropertyLoanOutstandingAmount:0.0,otherLoanOutstandingAmount:null,carLoansAmount:0.0},comprehensiveInsurancePlanning:null,comprehensiveRetirementPlanning:{enquiryId:131297,retirementAge:'45',haveOtherSourceRetirementIncome:null,retirementIncomeSet:[],lumpSumBenefitSet:[]}};
    comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.LITE);
    comprehensiveService.setComprehensiveSummary(summaryData);
    //spyOn(comprehensiveService, 'transformAsCurrency').and.returnValue('$10');
    spyOn(comprehensiveService, 'getComprehensiveVersion').and.returnValue(true);
    spyOn(comprehensiveService, 'getReportStatus').and.returnValue('new');
    //spyOn(comprehensiveService, 'comprehensiveFormData').and.returnValue([]);
    //spyOn(comprehensiveService, 'getMyDependant').and.returnValue([]);
    component.comprehensiveJourneyMode = true;
   // const transformAsCurrencySpy = spyOn(comprehensiveService, 'transformAsCurrency');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitleWithIcon');
    component.setPageTitle('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE', { id: 'MySpendingsComponent', iconClass: 'navbar__menuItem--journey-map' });
  });
  
  it('form valid', () => {
    expect(component.mySpendingsForm.valid).toBe(true);
  });

  it('myLiabilities form valid', () => {
    const userInfo = {
      monthlyLivingExpenses: 200,
      adHocExpenses: 100,
      HLMortgagePaymentUsingCPF: 200,
      HLMortgagePaymentUsingCash: 200,
      HLtypeOfHome: 'Private',
      homeLoanPayOffUntil: 200,
      mortgagePaymentUsingCPF: 200,
      mortgagePaymentUsingCash: 100,
      mortgageTypeOfHome: 'Private',
      mortgagePayOffUntil: 270,
      carLoanPayment: 200,
      carLoanPayoffUntil: 270,
      otherLoanPayment: 200,
      otherLoanPayoffUntil: 270,
    };

    updateForm(userInfo);
    expect(component.mySpendingsForm.valid).toBe(true);

    //component.save();
  });

  it('Trigger Tooltip', () => {
	const showModal = component.showToolTipModal('HOME_LOAN_TITLE', 'HOME_LOAN_MESSAGE');
  });

  it('should call onTotalAnnualSpendings and get response as zero', () => {
    //component.totalOutstanding = 0;
    spyOn(comprehensiveService, 'additionOfCurrency').and.returnValue(0);
    spyOn(comprehensiveService, 'setBucketImage').and.returnValue('emptyBucket');
    fixture.detectChanges();
    component.onTotalAnnualSpendings();
    comprehensiveService.setBucketImage('', '', 0);
    comprehensiveService.additionOfCurrency({});
    expect(component.onTotalAnnualSpendings).toBe(0);
    expect(comprehensiveService.additionOfCurrency).toHaveBeenCalledWith({});
    expect(comprehensiveService.setBucketImage).toHaveBeenCalledWith('', '', 0);
  }); 
  it('should redirect to regular-saving-plan', () => {
    const navigateSpy = spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledWith(['../comprehensive/regular-saving-plan']);
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
    component.goToNext(component.mySpendingsForm);
  });
  
  it('should trigger goToNext false', () => {
    component.viewMode = false;
    component.goToNext(component.mySpendingsForm);
  });
  
  it('should trigger addOtherMortage() true', () => {
    component.otherMortage = true;
    component.validationFlag = true;
    component.addOtherMortage();
  });
  
  it('should trigger addOtherMortage() false', () => {
    component.otherMortage = false;
    component.validationFlag = true;
    component.addOtherMortage();
  });
  
  it('should trigger addOtherMortage() validationFlag  true', () => {
    component.otherMortage = true;
    component.validationFlag = false;
    component.addOtherMortage();
  });
  
  it('should trigger addOtherMortage() validationFlag false', () => {
    component.otherMortage = false;
    component.validationFlag = false;
    component.addOtherMortage();
  });
  
  it('should trigger validatePayoff() ', () => {
    component.validatePayoff();
  });
  
  it('should trigger buildMySpendingForm() ', () => {
    component.buildMySpendingForm();
  });
  
  it('should trigger validateSpendings ', () => {
    component.validateSpendings(component.mySpendingsForm);
    //spyOn(comprehensiveService, 'getReportStatus').and.returnValue('new');
  });
  
  it('should trigger payOffYearValid() enable', () => {
    component.payOffYearValid('');
  });
  
  it('should trigger selectMortgageHomeType()', () => {
    component.selectMortgageHomeType('Private');
  });
  
  it('should trigger selectHLHomeType()', () => {
    component.selectHLHomeType('Private');
  });
  
  it('should clear validators', () => {
    component.mySpendingsForm.controls['mortgagePayOffUntil'].clearValidators();
  });

  it('should set validators', () => {
    component.mySpendingsForm.controls['mortgagePayOffUntil'].setValidators(component.payOffYearValid);
  });
  
  it('should navigate press of onPressBtn', () => {
    component.viewMode = true;
    component.goToNext(component.mySpendingsForm);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../comprehensive/regular-saving-plan']);
    component.viewMode = false
    component.goToNext(component.mySpendingsForm);
    spyOn(comprehensiveApiService, 'saveExpenses').and.returnValue({ subscribe: () => { } });
    const userInfo = {
      enquiryId: 123,
      monthlyLivingExpenses: 123,
      adHocExpenses: 123,
      HLMortgagePaymentUsingCPF: 123,
      HLMortgagePaymentUsingCash: 123,
      HLtypeOfHome: 'private',
      homeLoanPayOffUntil: 123,
      mortgagePaymentUsingCPF: 123,
      mortgagePaymentUsingCash: 123,
      mortgageTypeOfHome: 'private',
      mortgagePayOffUntil: 123,
      carLoanPayment: 123,
      carLoanPayoffUntil: 123,
      otherLoanPayment: 123,
      otherLoanPayoffUntil: 123,
      totalAnnualExpenses: 123,
    };
    comprehensiveService.setMySpendings(userInfo);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../comprehensive/regular-saving-plan']);
  });
});

