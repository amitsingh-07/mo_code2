import { IComprehensiveDetails } from './../comprehensive-types';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl  } from '@angular/forms';
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
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, throwError } from 'rxjs';

import { MyAssetsComponent } from './my-assets.component';
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
import { MyInfoService } from '../../shared/Services/my-info.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
export class TestComponent {
}
export const routes: Routes = [
  {
    path: COMPREHENSIVE_ROUTES.MY_ASSETS,
    component: TestComponent
  },
  { path: COMPREHENSIVE_ROUTES.MY_LIABILITIES, component: TestComponent },
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
  saveAssets(reportData): Observable<any> {
    return of({});
  }
}

describe('MyAssetsComponent', () => {
  let component: MyAssetsComponent;
  let fixture: ComponentFixture<MyAssetsComponent>;

  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;
  let formArray: FormArray;

  let routerNavigateSpy: jasmine.Spy;

  let comp: MyAssetsComponent;
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
  let myInfoService: MyInfoService;
  let parserFormatter: NgbDateParserFormatter;
  const route = ({ routeConfig: { component: { name: 'MyAssetsComponent'} } } as any) as ActivatedRoute;
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
    component.myAssetsForm.controls['cashInBank'].setValue(userInfo.cashInBank);
    component.myAssetsForm.controls['savingsBonds'].setValue(userInfo.savingsBonds);
    component.myAssetsForm.controls['cpfOrdinaryAccount'].setValue(userInfo.cpfOrdinaryAccount);
    component.myAssetsForm.controls['cpfSpecialAccount'].setValue(userInfo.cpfSpecialAccount);
    component.myAssetsForm.controls['cpfMediSaveAccount'].setValue(userInfo.cpfMediSaveAccount);
    component.myAssetsForm.controls['cpfRetirementAccount'].setValue(userInfo.cpfRetirementAccount);
    component.myAssetsForm.controls['schemeType'].setValue(userInfo.schemeType);
    component.myAssetsForm.controls['estimatedPayout'].setValue(userInfo.estimatedPayout);
    component.myAssetsForm.controls['retirementSum'].setValue(userInfo.retirementSum);
    component.myAssetsForm.controls['topupAmount'].setValue(userInfo.topupAmount);
    component.myAssetsForm.controls['withdrawalAmount'].setValue(userInfo.withdrawalAmount);
    component.myAssetsForm.controls['homeMarketValue'].setValue(userInfo.homeMarketValue);
    component.myAssetsForm.controls['investmentPropertiesValue'].setValue(userInfo.investmentPropertiesValue);
   // component.myAssetsForm.controls['assetsInvestmentSet'].setValue(userInfo.assetsInvestmentSet);
    component.myAssetsForm.controls['otherAssetsValue'].setValue(userInfo.otherAssetsValue);
    //component.myAssetsForm.controls['source'].setValue(userInfo.source);
    let array: FormGroup[] = [];
    array.push(new FormGroup({
        typeOfInvestment: new FormControl(),
        investmentAmount: new FormControl()
    }));
    const formSetArray = new FormArray(array);
    component.myAssetsForm.controls['assetsInvestmentSet'] = formSetArray;
  }
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyAssetsComponent, ErrorModalComponent, StepIndicatorComponent],
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
        MyAssetsComponent,
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

       {provide: ActivatedRoute, useValue: route},
       MyInfoService,
       { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorModalComponent, StepIndicatorComponent] } })
      .compileComponents();
    router = TestBed.get(Router);	
    //router.initialNavigation();
    //spyOn(router, 'navigateByUrl');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAssetsComponent);
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
    myInfoService = TestBed.get(MyInfoService);
    parserFormatter = TestBed.get(NgbDateParserFormatter);
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
    expect(setPageTitleSpy).toHaveBeenCalledWith('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE', { id: 'MyAssetsComponent', iconClass: 'navbar__menuItem--journey-map' });
  });
  

  it('should progressService', () => {
    const progressTrackerServiceSpy = spyOn(progressTrackerService, 'setProgressTrackerData').and.returnValue({});
    const summaryData: any = {};
    component.ngOnInit();
    expect(progressTrackerServiceSpy).toHaveBeenCalledWith(summaryData);
  });
  
  it('form valid', () => {
    expect(component.myAssetsForm.valid).toBe(true);
  });

  it('Assets form valid', () => {
    const userInfo = {
      enquiryId: 123,
      cashInBank: 200,
      savingsBonds: 100,
      cpfOrdinaryAccount: 200,
      cpfSpecialAccount: 200,
      cpfMediSaveAccount: 200,
      cpfRetirementAccount: 200,
      schemeType: 'Retirement Sum',
      estimatedPayout: 100,
      retirementSum: 200,
      topupAmount: 270,
      withdrawalAmount: 200,
      homeMarketValue: 270,
      investmentPropertiesValue: 200,
      assetsInvestmentSet: [{
                              enquiryId: 123,
                              typeOfInvestment: 'MoneyOwl - Equity',
                              investmentAmount: 123
                          }],
      otherAssetsValue: 270,
      source: 'MANUAL'
    };

    updateForm(userInfo);
    expect(component.myAssetsForm.valid).toBe(true);

    //component.save();
  });

  it('Trigger Tooltip', () => {
	const showModal = component.showToolTipModal('CASH_TITLE', 'CASH_MESSAGE');
  });

  it('Trigger Tooltip SET_RETIREMENT_SUM_TITLE', () => {
	const showModal = component.showToolTipModal('SET_RETIREMENT_SUM_TITLE', 'SET_RETIREMENT_SUM_MESSAGE');
  });


  it('should redirect to my-liabilities', () => {
    const navigateSpy = spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledWith(['../comprehensive/my-liabilities']);
  });
  
  it('should trigger OnChange', () => {
    component.onChange();
  });

  it('should trigger ngOnInit MyAssetsComponent', () => {
    component.pageId = 'MyAssetsComponent';
    component.assetDetails = {
      enquiryId: 123,
      cashInBank: 200,
      savingsBonds: 100,
      cpfOrdinaryAccount: 200,
      cpfSpecialAccount: 200,
      cpfMediSaveAccount: 200,
      cpfRetirementAccount: 200,
      schemeType: 'Retirement Sum',
      estimatedPayout: 100,
      retirementSum: 200,
      topupAmount: 270,
      withdrawalAmount: 200,
      homeMarketValue: 270,
      investmentPropertiesValue: 0,
      assetsInvestmentSet: [{
                              enquiryId: 123,
                              typeOfInvestment: 'MoneyOwl - Equity',
                              investmentAmount: 123
                          }],
      otherAssetsValue: 270,
      source: 'MANUAL',
      totalAnnualAssets: 20000
    };
    component.ngOnInit();
  });

  it('should trigger ngOnInit MyAssetsComponent myInvestmentProperties', () => {
    component.pageId = 'MyAssetsComponent';
    component.assetDetails = {
      enquiryId: 123,
      cashInBank: 200,
      savingsBonds: 100,
      cpfOrdinaryAccount: 200,
      cpfSpecialAccount: 200,
      cpfMediSaveAccount: 200,
      cpfRetirementAccount: 200,
      schemeType: 'Retirement Sum',
      estimatedPayout: 100,
      retirementSum: 200,
      topupAmount: 270,
      withdrawalAmount: 200,
      homeMarketValue: 270,
      investmentPropertiesValue: 200,
      assetsInvestmentSet: [{
                              enquiryId: 123,
                              typeOfInvestment: 'MoneyOwl - Equity',
                              investmentAmount: 123
                          }],
      otherAssetsValue: 270,
      source: 'MANUAL',
      totalAnnualAssets: 20000
    };
    component.ngOnInit();
  });

  it('should trigger ngOnInit', () => {
    component.pageId = '';
    component.ngOnInit();
  });

  it('should trigger ngOnDestroy', () => {
    component.ngOnDestroy();
  });
    
  it('should trigger goToNext true', () => {
    component.viewMode = true;
    spyOn(comprehensiveApiService, 'saveAssets').and.returnValue({ subscribe: () => { } });
    component.goToNext(component.myAssetsForm);
  });
   
  it('should trigger goToNext false', () => {
    component.viewMode = false;
    spyOn(comprehensiveApiService, 'saveAssets').and.returnValue({ subscribe: () => { } });
    const userInfo = {
      enquiryId: 123,
      cashInBank: 200,
      savingsBonds: 100,
      cpfOrdinaryAccount: 200,
      cpfSpecialAccount: 200,
      cpfMediSaveAccount: 200,
      cpfRetirementAccount: 200,
      schemeType: 'Retirement Sum',
      estimatedPayout: 100,
      retirementSum: 200,
      topupAmount: 270,
      withdrawalAmount: 200,
      homeMarketValue: 270,
      investmentPropertiesValue: 200,
      assetsInvestmentSet: [{
                              enquiryId: 123,
                              typeOfInvestment: 'MoneyOwl - Equity',
                              investmentAmount: 123
                          }],
      otherAssetsValue: 270,
      source: 'MANUAL'
    };

    updateForm(userInfo);
    component.goToNext(component.myAssetsForm);
  });  
  
  it('should trigger buildMyAssetsForm()', () => {
    component.viewMode = true;
    component.buildMyAssetsForm();
  }); 
  
  it('should trigger buildMyAssetsForm() false', () => {
    component.viewMode = false;
    component.assetDetails = {
      enquiryId: 123,
      cashInBank: 200,
      savingsBonds: 100,
      cpfOrdinaryAccount: 200,
      cpfSpecialAccount: 200,
      cpfMediSaveAccount: 200,
      cpfRetirementAccount: 200,
      schemeType: 'Retirement Sum',
      estimatedPayout: 100,
      retirementSum: 200,
      topupAmount: 270,
      withdrawalAmount: 200,
      homeMarketValue: 270,
      investmentPropertiesValue: 200,
      assetsInvestmentSet: [],
      otherAssetsValue: 270,
      source: 'MANUAL',
      totalAnnualAssets: 20000
    };
    component.buildMyAssetsForm();
  }); 
  
  it('should trigger buildMyAssetsForm() investmentSet', () => {
    component.viewMode = false;
    component.assetDetails = {
      enquiryId: 123,
      cashInBank: 200,
      savingsBonds: 100,
      cpfOrdinaryAccount: 200,
      cpfSpecialAccount: 200,
      cpfMediSaveAccount: 200,
      cpfRetirementAccount: 200,
      schemeType: 'Retirement Sum',
      estimatedPayout: 100,
      retirementSum: 200,
      topupAmount: 270,
      withdrawalAmount: 200,
      homeMarketValue: 270,
      investmentPropertiesValue: 200,
      assetsInvestmentSet: [{
                              enquiryId: 123,
                              typeOfInvestment: 'MoneyOwl - Equity',
                              investmentAmount: 123
                          }],
      otherAssetsValue: 270,
      source: 'MANUAL',
      totalAnnualAssets: 20000
    };
    component.buildMyAssetsForm();
  }); 
  
  it('should trigger getMyInfoData() ', () => {
    component.getMyInfoData();
  });

  it('should call onTotalAssetsBucket and get response as zero', () => {
    //component.totalOutstanding = 0;
    spyOn(comprehensiveService, 'additionOfCurrency').and.returnValue(0);
    spyOn(comprehensiveService, 'setBucketImage').and.returnValue('emptyBucket');
    fixture.detectChanges();
    component.onTotalAssetsBucket();
  });  
  
  it('should trigger cancelMyInfo() ', () => {
    component.getMyInfoData();
  }); 
  
  it('should trigger closeMyInfoPopup() ', () => {
    myInfoService.isMyInfoEnabled = true;
    spyOn(myInfoService, 'closeFetchPopup').and.returnValue(of(true));
    component.closeMyInfoPopup();
  }); 
  
  it('should trigger closeMyInfoPopup() false', () => {
    spyOn(myInfoService, 'closeFetchPopup').and.returnValue(of(true));
    myInfoService.isMyInfoEnabled = false;
    component.closeMyInfoPopup();
  }); 
  
  it('should trigger openModal() ', () => {
    component.viewMode = true;
    component.openModal();
  });
  
  it('should trigger openModal() false', () => {
    component.viewMode = false;
    component.openModal();
  });
  
  it('should trigger addOtherInvestment() ', () => {
    component.myInvestmentProperties = true;
    component.addOtherInvestment();
  });
  
  it('should trigger addOtherInvestment() false', () => {
    component.myInvestmentProperties = false;
    component.addOtherInvestment();
  });
  
  it('should trigger addInvestment() ', () => {
    component.addInvestment();
  });

  it('should trigger buildInvestmentForm() ', () => {
    component.viewMode = true;
    component.buildMyAssetsForm();
    component.buildInvestmentForm('', 1);
  });

  it('should trigger buildInvestmentForm() false', () => {
    component.viewMode = false;
    component.buildMyAssetsForm();
    component.buildInvestmentForm('', 0);
  });

  it('should trigger buildInvestmentForm() two', () => {
    component.viewMode = false;
    component.buildMyAssetsForm();
    component.buildInvestmentForm('', 2);
  });

  it('should trigger buildInvestmentForm() three', () => {
    component.viewMode = false;
    component.buildMyAssetsForm();
    component.buildInvestmentForm({
                                      enquiryId: 123,
                                      typeOfInvestment: 'MoneyOwl - Equity',
                                      investmentAmount: 123
                                  }, 0); 
  });
  
  it('should trigger removeInvestment() ', () => {
    component.removeInvestment(1);
  });
  
  it('should trigger selectInvestType() ', () => {
    let array: FormGroup[] = [];
    array.push(new FormGroup({ 
        typeOfInvestment: new FormControl(),
        investmentAmount: new FormControl()
    }));
    const formSetArray = new FormArray(array);
    component.myAssetsForm.controls['assetsInvestmentSet'] = formSetArray;
    component.selectInvestType({ text: 'MoneyOwl - Equity', value: 'MoneyOwl - Equity' }, 0);
  });
  
  it('should trigger selectSchemeType() false', () => {
    component.viewMode = false;
    component.selectSchemeType({ text: 'Retirement Sum', value: 'Retirement Sum' });
  });
  
  it('should trigger selectSchemeType() ', () => {
    component.viewMode = true;
    component.selectSchemeType({ text: 'Retirement Sum', value: 'Retirement Sum' });
  });
  
  it('should trigger setInvestValidation() ', () => {
    let array: FormGroup[] = [];
    array.push(new FormGroup({ 
        typeOfInvestment: new FormControl(),
        investmentAmount: new FormControl()
    }));
    const formSetArray = new FormArray(array);
    component.myAssetsForm.controls['assetsInvestmentSet'] = formSetArray;
    component.setInvestValidation(1);
  });
  
  it('should trigger validateAssets() ', () => {
    const spyService = spyOn(comprehensiveService, 'getReportStatus').and.returnValue('new');
    component.validateAssets(component.myAssetsForm);
    expect(spyService).toHaveBeenCalled();
  });

  it('should trigger validateAssets() submitted', () => {
    const spyService = spyOn(comprehensiveService, 'getReportStatus').and.returnValue('submitted');
    component.validateAssets(component.myAssetsForm);
    expect(spyService).toHaveBeenCalled();
  });
  
  it('should trigger investTypeValidation() ', () => {

    let array: FormGroup[] = [];
    array.push(new FormGroup({ 
        typeOfInvestment: new FormControl('MoneyOwl - Equity'),
        investmentAmount: new FormControl(123)
    }));
    const formSetArray = new FormArray(array);
    component.myAssetsForm.controls['assetsInvestmentSet'] = formSetArray;
    component.investTypeValidation();
  });
  
  it('should trigger investTypeValidation() false', () => {

    let array: FormGroup[] = [];
    array.push(new FormGroup({ 
        typeOfInvestment: new FormControl('MoneyOwl - Equity'),
        investmentAmount: new FormControl(0)
    }));
    const formSetArray = new FormArray(array);
    component.myAssetsForm.controls['assetsInvestmentSet'] = formSetArray;
    component.investTypeValidation();
  });

  
  it('should navigate press of onPressBtn', () => {
    component.viewMode = true;
    component.goToNext(component.myAssetsForm);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../comprehensive/my-liabilities']);
    component.viewMode = false
    component.goToNext(component.myAssetsForm);
    spyOn(comprehensiveApiService, 'saveAssets').and.returnValue({ subscribe: () => { } });
    const userInfo = {
      enquiryId: 123,
      cashInBank: 200,
      savingsBonds: 100,
      cpfOrdinaryAccount: 200,
      cpfSpecialAccount: 200,
      cpfMediSaveAccount: 200,
      cpfRetirementAccount: 200,
      schemeType: 'Retirement Sum',
      estimatedPayout: 100,
      retirementSum: 200,
      topupAmount: 270,
      withdrawalAmount: 200,
      homeMarketValue: 270,
      investmentPropertiesValue: 200,
      assetsInvestmentSet: [{
                              enquiryId: 123,
                              typeOfInvestment: 'MoneyOwl - Equity',
                              investmentAmount: 123
                          }],
      otherAssetsValue: 270,
      source: 'MANUAL',
      totalAnnualAssets: 20000
    };
    comprehensiveService.setMyAssets(userInfo);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../comprehensive/my-liabilities']);
  });

  it('should set validators', () => {
    const otherInvestmentControl = component.myAssetsForm.controls['assetsInvestmentSet']['controls'][0].controls;
    otherInvestmentControl['typeOfInvestment'].setValidators([]);
    otherInvestmentControl['typeOfInvestment'].updateValueAndValidity();
    otherInvestmentControl['investmentAmount'].setValidators([]);
    otherInvestmentControl['investmentAmount'].updateValueAndValidity();
  });
});

