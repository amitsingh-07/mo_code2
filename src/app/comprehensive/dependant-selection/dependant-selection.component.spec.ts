import { DependantSelectionComponent } from './dependant-selection.component';
import { waitForAsync, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Location, DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router, Routes, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../app.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { FooterService } from './../../shared/footer/footer.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { tokenGetterFn, mockCurrencyPipe } from '../../../assets/mocks/service/shared-service';
import { HeaderService } from './../../shared/header/header.service';
import { createTranslateLoader } from '../comprehensive.module';
import { ApiService } from './../../shared/http/api.service';
import { StepIndicatorComponent } from './../../shared/components/step-indicator/step-indicator.component';
import { COMPREHENSIVE_ROUTES } from './../comprehensive-routes.constants';
import { AboutAge } from './../../shared/utils/about-age.util';
import { RoutingService } from './../../shared/Services/routing.service';
import { FileUtil } from './../../shared/utils/file.util';
import { NavbarService } from './../../shared/navbar/navbar.service';
export class TestComponent {
}
export const routes: Routes = [
  {
    path: COMPREHENSIVE_ROUTES.DEPENDANT_DETAILS ,
    component: TestComponent
  },
  { path: COMPREHENSIVE_ROUTES.DEPENDANT_SELECTION + '/summary', component: TestComponent },
  { path: COMPREHENSIVE_ROUTES.STEPS + '/2', component: TestComponent },
]; 
class MockRouter {
  navigateByUrl(url: string) { return url; }
}
describe('DependantSelectionComponent', () => {
  let component: DependantSelectionComponent;
  let fixture: ComponentFixture<DependantSelectionComponent>;
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
  let translations = require('../../../assets/i18n/comprehensive/en.json');
  let commonTranslation = require('../../../assets/i18n/app/en.json');
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DependantSelectionComponent, ErrorModalComponent, StepIndicatorComponent],
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
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        NgbModal,
        NgbActiveModal,
        DependantSelectionComponent,
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
        { provide: ActivatedRoute, useValue: route }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorModalComponent, StepIndicatorComponent] } })
      .compileComponents();
      router = TestBed.get(Router);
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DependantSelectionComponent);
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
    comprehensiveService = TestBed.get(ComprehensiveService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    const summaryData: any = {
      comprehensiveEnquiry: { enquiryId: 131297, sessionTrackerId: 55877, type: 'Comprehensive-Lite', hasComprehensive: true, hasDependents: null, hasEndowments: '0', hasRegularSavingsPlans: false, generatedTokenForReportNotification: null, stepCompleted: 4, subStepCompleted: 0, reportStatus: 'edit', isValidatedPromoCode: false, homeLoanUpdatedByLiabilities: null, isLocked: false, isDobUpdated: true, dobPopUpEnable: false, isDobChangedInvestment: null, isConfirmationEmailSent: null, paymentStatus: null, reportSubmittedTimeStamp: '2020-05-06T21:31:35.000+0000' }, baseProfile: { firstName: 'rini', lastName: 'test', dateOfBirth: '06/10/1988', dateOfBirthInvestment: '06/10/1988', nation: null, gender: 'male', genderInvestment: 'male', email: 'mo2uatapr2_1@yopmail.com', mobileNumber: '8998110734', nationalityStatus: 'Singapore PR', dobUpdateable: false, journeyType: 'Investment', smoker: false }, dependentsSummaryList: {
        dependentsList: [{
          id: 1,
          customerId: 0,
          name: "Navin",
          relationship: 'Brother',
          gender: 'Male',
          dateOfBirth: '25/12/1996',
          nation: 'singaporean'
        }], noOfHouseholdMembers: null, houseHoldIncome: null, noOfYears: 0
      }, dependentEducationPreferencesList: [{
        id: 0,
        dependentId: 1,
        enquiryId: 131297,
        location: 'singapore',
        educationCourse: null,
        educationSpendingShare: 50,
        endowmentMaturityAmount: 100,
        endowmentMaturityYears: 2021
      }], comprehensiveIncome: { enquiryId: 131297, employmentType: 'Employed', monthlySalary: 70000.0, monthlyRentalIncome: 0.0, otherMonthlyWorkIncome: 0.0, otherMonthlyIncome: 0.0, annualBonus: null, annualDividends: 0.0, otherAnnualIncome: 0.0 }, comprehensiveSpending: { enquiryId: 131297, monthlyLivingExpenses: 60000.0, adHocExpenses: null, homeLoanPayOffUntil: null, mortgagePaymentUsingCPF: 0.0, mortgagePaymentUsingCash: 0.0, mortgageTypeOfHome: '', mortgagePayOffUntil: null, carLoanPayment: 0.0, carLoanPayoffUntil: null, otherLoanPayment: null, otherLoanPayoffUntil: null, HLMortgagePaymentUsingCPF: null, HLMortgagePaymentUsingCash: null, HLtypeOfHome: '' }, comprehensiveRegularSavingsList: [], comprehensiveDownOnLuck: { enquiryId: 131297, badMoodMonthlyAmount: 300.0, hospitalPlanId: 2, hospitalPlanName: 'Government Hospital Ward A' }, comprehensiveAssets: { enquiryId: 131297, cashInBank: 7000.0, savingsBonds: 8000.0, cpfOrdinaryAccount: null, cpfSpecialAccount: null, cpfMediSaveAccount: null, cpfRetirementAccount: null, schemeType: null, estimatedPayout: null, topupAmount: null, withdrawalAmount: null, retirementSum: null, homeMarketValue: 0.0, investmentPropertiesValue: 0.0, assetsInvestmentSet: [{ assetId: 628, typeOfInvestment: 'MoneyOwl - Equity', investmentAmount: null }], otherAssetsValue: 0.0, source: 'MANUAL' }, comprehensiveLiabilities: { enquiryId: 131297, homeLoanOutstandingAmount: null, otherPropertyLoanOutstandingAmount: 0.0, otherLoanOutstandingAmount: null, carLoansAmount: 0.0 }, comprehensiveInsurancePlanning: null, comprehensiveRetirementPlanning: { enquiryId: 131297, retirementAge: '45', haveOtherSourceRetirementIncome: null, retirementIncomeSet: [], lumpSumBenefitSet: [] }
    };
    comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
    comprehensiveService.setComprehensiveSummary(summaryData);
    spyOn(comprehensiveService, 'getMyDependant').and.returnValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('form invalid when empty', () => {
    expect(component.dependantSelectionForm.valid).toBeFalsy();
  });

  it('has dependants  validity', () => {
    let errors = {};
    const hasDependant = component.dependantSelectionForm.controls['dependantSelection'];
    expect(hasDependant.valid).toBeFalsy();

    // Check for invalid has Dependant name
    hasDependant.setValue(null);
    errors = hasDependant.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for valid has Dependant name
    hasDependant.setValue(true);
    errors = hasDependant.errors || {};
    expect(errors['required']).toBeFalsy();

  });
  it('has dependant  validity', () => {
    let errors = {};
    const noOfHouseholdMembers = component.dependantSelectionForm.controls['noOfHouseholdMembers'];
    expect(noOfHouseholdMembers.valid).toBeFalsy();

    // Check for invalid has Dependant name
    noOfHouseholdMembers.setValue(null);
    errors = noOfHouseholdMembers.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for valid has Dependant name
    noOfHouseholdMembers.setValue(1);
    errors = noOfHouseholdMembers.errors || {};
    expect(errors['required']).toBeFalsy();

  });
  it('has dependant  validity', () => {
    let errors = {};
    const houseHoldIncome = component.dependantSelectionForm.controls['houseHoldIncome'];
    expect(houseHoldIncome.valid).toBeFalsy();

    // Check for invalid has Dependant name
    houseHoldIncome.setValue(null);
    errors = houseHoldIncome.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for valid has Dependant name
    houseHoldIncome.setValue(1);
    errors = houseHoldIncome.errors || {};
    expect(errors['required']).toBeFalsy();

  });

  it('submitting a form emits user info', () => {
    expect(component.dependantSelectionForm.valid).toBeFalsy();
    const hasDependant = component.dependantSelectionForm.controls['dependantSelection'];
    const noOfHouseholdMembers = component.dependantSelectionForm.controls['noOfHouseholdMembers'];
    const houseHoldIncome = component.dependantSelectionForm.controls['houseHoldIncome'];
    hasDependant.setValue(true);
    noOfHouseholdMembers.setValue(1);
    houseHoldIncome.setValue("Below $2,000");
    component.goToNext(component.dependantSelectionForm);
  });

  it('should call go back', () => {
    spyOn(navbarService, 'goBack');
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarComprehensive');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(true);
  });

  it('buildMyDependantSelectionForm', () => {
    component.buildMyDependantSelectionForm();
  });

  it('selectHouseHoldMembers', () => {
    component.selectHouseHoldMembers(1);
  });

  it('selectHouseHoldIncome', () => {
    component.selectHouseHoldIncome("Below $2,000");
  });

  it('showSummaryModal', () => {
    component.showSummaryModal();
    component.summaryModalDetails = {
      setTemplateModal: 1, dependantModelSel: false,
      contentObj: component.childrenEducationNonDependantModal,
      nonDependantDetails: {
        livingCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.EXPENSE,
        livingPercent: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.PERCENT,
        livingEstimatedCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.COMPUTED_EXPENSE,
        medicalBill: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.EXPENSE,
        medicalYear: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.PERCENT,
        medicalCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.COMPUTED_EXPENSE
      },
      nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2',
      routerEnabled: component.summaryRouterFlag
    };
    comprehensiveService.openSummaryPopUpModal(component.summaryModalDetails);
  });

  it('ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call go next', () => {
    spyOn(router, 'navigate');
    component.goToNext(component.dependantSelectionForm);
    component.viewMode=true;
    expect(router.navigate).toHaveBeenCalledWith([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION_SUMMARY]);
  });

  it('should call go next', () => {
    spyOn(router, 'navigate');
    component.goToNext(component.dependantSelectionForm);
    component.viewMode=false;
   comprehensiveService.setDependantSelection(component.dependantSelectionForm.value.dependantSelection)
  });

  it('should call go next', () => {
    spyOn(router, 'navigate');
    component.routerPath(component.dependantSelectionForm);
    expect(router.navigate).toHaveBeenCalledWith([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION_SUMMARY]);
  });

  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitleWithIcon');
    component.setPageTitle('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE', { id: 'DependantSelectionComponent', iconClass: 'navbar__menuItem--journey-map' });
  });
});
