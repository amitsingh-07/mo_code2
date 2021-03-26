import { PreLoginComponent } from './../../sign-up/pre-login/pre-login.component';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl  } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location, APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA, QueryList, ViewChildren } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule, Router, Routes, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, throwError } from 'rxjs';

import { DirectResultsComponent } from './direct-results.component';

import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Util } from './../../shared/utils/util';

import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { appConstants } from './../../app.constants';

import { tokenGetterFn, mockCurrencyPipe, mockAuthService } from
  '../../../assets/mocks/service/shared-service';

import { FooterService } from './../../shared/footer/footer.service';
import { HeaderService } from './../../shared/header/header.service';
import { AppService } from './../../app.service';
import { ApiService } from './../../shared/http/api.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

import { ErrorModalComponent } from './../../shared/modal/error-modal/error-modal.component';
import { RoutingService } from './../../shared/Services/routing.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';

import { ProductDetailComponent } from '../../shared/components/product-detail/product-detail.component';
//import { createTranslateLoader } from '../direct.module';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { StateStoreService } from '../../shared/Services/state-store.service';
import { PRODUCT_CATEGORY_INDEX } from '../direct.constants';
import { FBPixelService } from '../../shared/analytics/fb-pixel.service';
import { MobileModalComponent } from './../../guide-me/mobile-modal/mobile-modal.component';
import {
  CreateAccountModelComponent
} from './../../guide-me/recommendations/create-account-model/create-account-model.component';
import { ToolTipModalComponent } from './../../shared/modal/tooltip-modal/tooltip-modal.component';
import { SelectedPlansService } from './../../shared/Services/selected-plans.service';
import { Formatter } from './../../shared/utils/formatter.util';
import { PlanWidgetComponent } from './../../shared/widgets/plan-widget/plan-widget.component';
import { SettingsWidgetComponent } from './../../shared/widgets/settings-widget/settings-widget.component';
import { DIRECT_ROUTE_PATHS } from './../direct-routes.constants';
import { DirectApiService } from './../direct.api.service';
import { DirectService } from './../direct.service';
import { DirectResultsState } from './direct-results.state';
import { AboutAge } from '../../shared/utils/about-age.util';

class MockDirectApiService {
  getSearchResults(reportData) {
    return of({"responseMessage":{"responseCode":6000,"responseDescription":"Successful response"},"objectList":[{"enquiryId":138805,"productProtectionTypeList":[{"protectionType":"Life Protection","productList":[{"id":"P226","productName":"MyProtector Term II","purposeId":0,"objectiveId":0,"typeId":0,"searchCount":0,"whyBuy":"I am concerned that I may have to stop work temporarily due to a severe or less severe critical illness hence income loss. I am also concerned my family cannot cope financially with the loss of income upon my demise.","payOut":"A lump sum benefit upon death, terminal illness (TI), total and permanent disability (TPD), early stage critical illness and recurrent late stage critical ilness.","underWritting":"Yes","rebate":"Eligible","cashValue":"No","cashPayoutFrequency":"NA","coverageDuration":"Till age 55,60, 65 or 70.","premiumDuration":"Throughout policy duration","features":"~No waiting period between early and late stage critical illness diagnosis ~Choice of term period from a minimum of 5 years to age 99 ~Covers Juvenile and Special conditions ","productDescription":"This Term policy provides high protection at low cost with death or terminal illness (TI), total and permanent disability (TPD), and early to late stage recurrent critical illness coverage. The Multipay Critical Illness rider offers coverage for a total of 105 early, intermendiate and late stage critical illnesses, 11 juvenile conditions and 13 special conditions. ","status":"Active","brochureLink":"https://www.aviva.com.sg/en/insurance/life-and-health/my-protector-series/","isAuthorised":false,"insurer":{"id":"AVV","insurerName":"Aviva","logoName":"logo-aviva.png","url":"https://www.aviva.com.sg","rating":"A+"},"premium":{"id":1214028,"productId":"P226","gender":"Male","minimumAge":41,"coverageName":"MyProtector Term II","durationName":"till age 65","premiumTerm":"24 Years","savingsDuration":"0","retirementPayoutAmount":"0","retirementPayoutDuration":"0","premiumAmount":184.1,"premiumAmountYearly":2157.25,"premiumFrequency":"yearly","intrestRateOfReturn":"0.00","ranking":1,"sumAssured":600000.0,"ciSumAssured":50000.0,"incomePayoutDuration":null,"payoutDuration":null,"claimCriteria":null,"claimFeature":null,"numberOfADL":null,"hospitalPlanType":null,"payoutAge":null,"gaurenteedMonthlyIncome":null,"monthlyBenefit":null,"multiplierRef":null,"rankingGroupId":32,"deferredPeriod":null,"escalatingBenefit":null,"totalGuaranteedPayout":null,"totalProjectedPayout475":null,"totalProjectedPayout325":null,"intrestRateOfReturn325":null,"retirementPayPeriodDisplay":null,"retirementPayFeatureDisplay":null,"payoutType":null,"smoker":false},"promotion":null,"rider":{"id":6,"riderName":"MultiPay Critical Illness Rider","riderType":null},"brochureLinkSize":"NA","authorised":false}]}]}]});
  }
}
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './../../../assets/i18n/app/', suffix: '.json' },
      { prefix: './../../../assets/i18n/direct/', suffix: '.json' }
    ]);
}
describe('DirectResultsComponent', () => {
  let component: DirectResultsComponent;
  let fixture: ComponentFixture<DirectResultsComponent>;
  let translations = require('./../../../assets/i18n/direct/en.json');
  let navbarService: NavbarService;
  let directService: DirectService;
  let directApiService: DirectApiService;
  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;
  let formArray: FormArray;
  let state: DirectResultsState = new DirectResultsState();
  let routerNavigateSpy: jasmine.Spy;

  let comp: DirectResultsComponent;
  let progressTrackerService: ProgressTrackerService;
  let footerService: FooterService;
  let translate: TranslateService;
  let http: HttpTestingController;
  let appService: AppService;
  let authService: AuthenticationService;
  let apiService: ApiService;
  let loader: LoaderService;
  let router: Router;
  let myInfoService: MyInfoService;
  let parserFormatter: NgbDateParserFormatter;
  const route = ({ routeConfig: { component: { name: 'DirectResultsComponent'} } } as any) as ActivatedRoute;
  let httpClientSpy;
  let currencyPipe: CurrencyPipe;
  let pageTitle: string;
  let plansData: any[] = [];
  let cashValueTooltipData;
  let underwritingTooltipData;
  let selectedPlansService: SelectedPlansService;
 // @ViewChildren('planWidget') planWidgets: QueryList<PlanWidgetComponent>;
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectResultsComponent, ProductDetailComponent, PlanWidgetComponent, SettingsWidgetComponent, ToolTipModalComponent, CreateAccountModelComponent ],
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
        ApiService,
        { provide: AuthenticationService, useValue: mockAuthService },
        TranslateService,
        CurrencyPipe,
        { provide: CurrencyPipe, useValue: mockCurrencyPipe },
        TitleCasePipe, 
        FooterService,
        NavbarService,
        HeaderService,
        LoaderService,
        FormBuilder,
        //ComprehensiveApiService,
        RoutingService,
        JwtHelperService,
        DirectService,
        DatePipe,
        //{ provide: DirectApiService, useValue: MockDirectApiService },
        DirectApiService,
        SelectedPlansService,
        AboutAge     
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    translate = injector.get(TranslateService);
    directService = injector.get(DirectService);
    directApiService = injector.get(DirectApiService);
    selectedPlansService = injector.get(SelectedPlansService);
    translate.setTranslation('en', translations);
    translate.use('en');
    
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    translate.get('COMMON').subscribe((result: string) => {
      component.pageTitle = translate.instant('COMPARE_PLANS.TITLE');
    
    });
    component.state.filterTypes = { CLAIM_CRITERIA: "Claim Criteria",
      CLAIM_FEATURE: "Claim Feature",
      DEFERRED_PERIOD: "Deferred Period",
      ESCALATING_BENEFIT: "Escalating Benefit",
      FULL_PARTIAL_RIDER: "Full / Partial Rider",
      INSURANCE_FINANCIAL_RATING: "Insurers' Financial Rating",
      INSURERS: "Insurers",
      PAYOUT_YEARS: "Payout Years",
      PREMIUM_FREQUENCY: "Premium Frequency"
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger ngOnInit', () => {
    component.state.filterTypes = { CLAIM_CRITERIA: "Claim Criteria",
      CLAIM_FEATURE: "Claim Feature",
      DEFERRED_PERIOD: "Deferred Period",
      ESCALATING_BENEFIT: "Escalating Benefit",
      FULL_PARTIAL_RIDER: "Full / Partial Rider",
      INSURANCE_FINANCIAL_RATING: "Insurers' Financial Rating",
      INSURERS: "Insurers",
      PAYOUT_YEARS: "Payout Years",
      PREMIUM_FREQUENCY: "Premium Frequency"
    };
    component.ngOnInit();
  });

  it('should trigger setPageTitle', () => {
    component.setPageTitle('Direct Results');
  });

  it('should trigger viewDetails', () => {
    component.viewDetails([]);
  });
  
  it('should trigger initRecommendationsCall', () => {
    component.componentName = 'DirectResultsComponent';
    //directApiService.getSearchResults({});
    const testData = {"responseMessage":{"responseCode":6000,"responseDescription":"Successful response"},"objectList":[{"enquiryId":138805,"productProtectionTypeList":[{"protectionType":"Life Protection","productList":[{"id":"P226","productName":"MyProtector Term II","purposeId":0,"objectiveId":0,"typeId":0,"searchCount":0,"whyBuy":"I am concerned that I may have to stop work temporarily due to a severe or less severe critical illness hence income loss. I am also concerned my family cannot cope financially with the loss of income upon my demise.","payOut":"A lump sum benefit upon death, terminal illness (TI), total and permanent disability (TPD), early stage critical illness and recurrent late stage critical ilness.","underWritting":"Yes","rebate":"Eligible","cashValue":"No","cashPayoutFrequency":"NA","coverageDuration":"Till age 55,60, 65 or 70.","premiumDuration":"Throughout policy duration","features":"~No waiting period between early and late stage critical illness diagnosis ~Choice of term period from a minimum of 5 years to age 99 ~Covers Juvenile and Special conditions ","productDescription":"This Term policy provides high protection at low cost with death or terminal illness (TI), total and permanent disability (TPD), and early to late stage recurrent critical illness coverage. The Multipay Critical Illness rider offers coverage for a total of 105 early, intermendiate and late stage critical illnesses, 11 juvenile conditions and 13 special conditions. ","status":"Active","brochureLink":"https://www.aviva.com.sg/en/insurance/life-and-health/my-protector-series/","isAuthorised":false,"insurer":{"id":"AVV","insurerName":"Aviva","logoName":"logo-aviva.png","url":"https://www.aviva.com.sg","rating":"A+"},"premium":{"id":1214028,"productId":"P226","gender":"Male","minimumAge":41,"coverageName":"MyProtector Term II","durationName":"till age 65","premiumTerm":"24 Years","savingsDuration":"0","retirementPayoutAmount":"0","retirementPayoutDuration":"0","premiumAmount":184.1,"premiumAmountYearly":2157.25,"premiumFrequency":"yearly","intrestRateOfReturn":"0.00","ranking":1,"sumAssured":600000.0,"ciSumAssured":50000.0,"incomePayoutDuration":null,"payoutDuration":null,"claimCriteria":null,"claimFeature":null,"numberOfADL":null,"hospitalPlanType":null,"payoutAge":null,"gaurenteedMonthlyIncome":null,"monthlyBenefit":null,"multiplierRef":null,"rankingGroupId":32,"deferredPeriod":null,"escalatingBenefit":null,"totalGuaranteedPayout":null,"totalProjectedPayout475":null,"totalProjectedPayout325":null,"intrestRateOfReturn325":null,"retirementPayPeriodDisplay":null,"retirementPayFeatureDisplay":null,"payoutType":null,"smoker":false},"promotion":null,"rider":{"id":6,"riderName":"MultiPay Critical Illness Rider","riderType":null},"brochureLinkSize":"NA","authorised":false}]}]}]};
    spyOn(directApiService, 'getSearchResults').and.returnValue(of(testData));
    component.initRecommendationsCall();
  });
  
  it('should trigger ngAfterContentChecked', () => {
    component.state.filterTypes = { CLAIM_CRITERIA: "Claim Criteria",
      CLAIM_FEATURE: "Claim Feature",
      DEFERRED_PERIOD: "Deferred Period",
      ESCALATING_BENEFIT: "Escalating Benefit",
      FULL_PARTIAL_RIDER: "Full / Partial Rider",
      INSURANCE_FINANCIAL_RATING: "Insurers' Financial Rating",
      INSURERS: "Insurers",
      PAYOUT_YEARS: "Payout Years",
      PREMIUM_FREQUENCY: "Premium Frequency"
    };
    component.ngAfterContentChecked();
  });
  
  it('should trigger ngOnDestroy()', () => {
    component.ngOnDestroy();
  });
  
  it('should trigger getRecommendations()', () => {
    component.state.premiumFrequencyType = 'monthly';
    component.state.selectedCategory = {active: true, id: 1,  prodCatIcon: "LifeProtection-icon--teal.svg",
    prodCatIconAlt: "LifeProtection-icon--white.svg", prodCatName: "Life Protection", prodLink: "life-protection"};
    spyOn(directService, 'getProductCategory').and.returnValue(component.state.selectedCategory);
    const testData = {"responseMessage":{"responseCode":6000,"responseDescription":"Successful response"},"objectList":[{"enquiryId":138805,"productProtectionTypeList":[{"protectionType":"Life Protection","productList":[{"id":"P226","productName":"MyProtector Term II","purposeId":0,"objectiveId":0,"typeId":0,"searchCount":0,"whyBuy":"I am concerned that I may have to stop work temporarily due to a severe or less severe critical illness hence income loss. I am also concerned my family cannot cope financially with the loss of income upon my demise.","payOut":"A lump sum benefit upon death, terminal illness (TI), total and permanent disability (TPD), early stage critical illness and recurrent late stage critical ilness.","underWritting":"Yes","rebate":"Eligible","cashValue":"No","cashPayoutFrequency":"NA","coverageDuration":"Till age 55,60, 65 or 70.","premiumDuration":"Throughout policy duration","features":"~No waiting period between early and late stage critical illness diagnosis ~Choice of term period from a minimum of 5 years to age 99 ~Covers Juvenile and Special conditions ","productDescription":"This Term policy provides high protection at low cost with death or terminal illness (TI), total and permanent disability (TPD), and early to late stage recurrent critical illness coverage. The Multipay Critical Illness rider offers coverage for a total of 105 early, intermendiate and late stage critical illnesses, 11 juvenile conditions and 13 special conditions. ","status":"Active","brochureLink":"https://www.aviva.com.sg/en/insurance/life-and-health/my-protector-series/","isAuthorised":false,"insurer":{"id":"AVV","insurerName":"Aviva","logoName":"logo-aviva.png","url":"https://www.aviva.com.sg","rating":"A+"},"premium":{"id":1214028,"productId":"P226","gender":"Male","minimumAge":41,"coverageName":"MyProtector Term II","durationName":"till age 65","premiumTerm":"24 Years","savingsDuration":"0","retirementPayoutAmount":"0","retirementPayoutDuration":"0","premiumAmount":184.1,"premiumAmountYearly":2157.25,"premiumFrequency":"yearly","intrestRateOfReturn":"0.00","ranking":1,"sumAssured":600000.0,"ciSumAssured":50000.0,"incomePayoutDuration":null,"payoutDuration":null,"claimCriteria":null,"claimFeature":null,"numberOfADL":null,"hospitalPlanType":null,"payoutAge":null,"gaurenteedMonthlyIncome":null,"monthlyBenefit":null,"multiplierRef":null,"rankingGroupId":32,"deferredPeriod":null,"escalatingBenefit":null,"totalGuaranteedPayout":null,"totalProjectedPayout475":null,"totalProjectedPayout325":null,"intrestRateOfReturn325":null,"retirementPayPeriodDisplay":null,"retirementPayFeatureDisplay":null,"payoutType":null,"smoker":false},"promotion":null,"rider":{"id":6,"riderName":"MultiPay Critical Illness Rider","riderType":null},"brochureLinkSize":"NA","authorised":false}]}]}]};
    spyOn(directApiService, 'getSearchResults').and.returnValue(of(testData));
    component.getRecommendations();
  });
  
  it('should trigger handleResponse()', () => {
    component.state.premiumFrequencyType = 'monthly';
    component.state.filterTypes = { CLAIM_CRITERIA: "Claim Criteria",
      CLAIM_FEATURE: "Claim Feature",
      DEFERRED_PERIOD: "Deferred Period",
      ESCALATING_BENEFIT: "Escalating Benefit",
      FULL_PARTIAL_RIDER: "Full / Partial Rider",
      INSURANCE_FINANCIAL_RATING: "Insurers' Financial Rating",
      INSURERS: "Insurers",
      PAYOUT_YEARS: "Payout Years",
      PREMIUM_FREQUENCY: "Premium Frequency"
    };
    const response = {"responseMessage":{"responseCode":6004,"responseDescription":"Your enquiry has been sent successfully. Our advisors will contact you by the end of the next working day."},"objectList":[{"enquiryId":138806,"productProtectionTypeList":[]}]};
    component.handleResponse(response);
  });
  
  it('should trigger handleResponse() Resp', () => {
    const response = {"responseMessage":{"responseCode":6000,"responseDescription":"Successful response"},"objectList":[{"enquiryId":138805,"productProtectionTypeList":[{"protectionType":"Life Protection","productList":[{"id":"P226","productName":"MyProtector Term II","purposeId":0,"objectiveId":0,"typeId":0,"searchCount":0,"whyBuy":"I am concerned that I may have to stop work temporarily due to a severe or less severe critical illness hence income loss. I am also concerned my family cannot cope financially with the loss of income upon my demise.","payOut":"A lump sum benefit upon death, terminal illness (TI), total and permanent disability (TPD), early stage critical illness and recurrent late stage critical ilness.","underWritting":"Yes","rebate":"Eligible","cashValue":"No","cashPayoutFrequency":"NA","coverageDuration":"Till age 55,60, 65 or 70.","premiumDuration":"Throughout policy duration","features":"~No waiting period between early and late stage critical illness diagnosis ~Choice of term period from a minimum of 5 years to age 99 ~Covers Juvenile and Special conditions ","productDescription":"This Term policy provides high protection at low cost with death or terminal illness (TI), total and permanent disability (TPD), and early to late stage recurrent critical illness coverage. The Multipay Critical Illness rider offers coverage for a total of 105 early, intermendiate and late stage critical illnesses, 11 juvenile conditions and 13 special conditions. ","status":"Active","brochureLink":"https://www.aviva.com.sg/en/insurance/life-and-health/my-protector-series/","isAuthorised":false,"insurer":{"id":"AVV","insurerName":"Aviva","logoName":"logo-aviva.png","url":"https://www.aviva.com.sg","rating":"A+"},"premium":{"id":1214028,"productId":"P226","gender":"Male","minimumAge":41,"coverageName":"MyProtector Term II","durationName":"till age 65","premiumTerm":"24 Years","savingsDuration":"0","retirementPayoutAmount":"0","retirementPayoutDuration":"0","premiumAmount":184.1,"premiumAmountYearly":2157.25,"premiumFrequency":"yearly","intrestRateOfReturn":"0.00","ranking":1,"sumAssured":600000.0,"ciSumAssured":50000.0,"incomePayoutDuration":null,"payoutDuration":null,"claimCriteria":null,"claimFeature":null,"numberOfADL":null,"hospitalPlanType":null,"payoutAge":null,"gaurenteedMonthlyIncome":null,"monthlyBenefit":null,"multiplierRef":null,"rankingGroupId":32,"deferredPeriod":null,"escalatingBenefit":null,"totalGuaranteedPayout":null,"totalProjectedPayout475":null,"totalProjectedPayout325":null,"intrestRateOfReturn325":null,"retirementPayPeriodDisplay":null,"retirementPayFeatureDisplay":null,"payoutType":null,"smoker":false},"promotion":null,"rider":{"id":6,"riderName":"MultiPay Critical Illness Rider","riderType":null},"brochureLinkSize":"NA","authorised":false}]}]}]};
    component.state.selectedCategory = {active: true, id: 1,  prodCatIcon: "LifeProtection-icon--teal.svg",
      prodCatIconAlt: "LifeProtection-icon--white.svg", prodCatName: "Life Protection", prodLink: "life-protection"};
    component.state.filterTypes = { CLAIM_CRITERIA: "Claim Criteria",
                                    CLAIM_FEATURE: "Claim Feature",
                                    DEFERRED_PERIOD: "Deferred Period",
                                    ESCALATING_BENEFIT: "Escalating Benefit",
                                    FULL_PARTIAL_RIDER: "Full / Partial Rider",
                                    INSURANCE_FINANCIAL_RATING: "Insurers' Financial Rating",
                                    INSURERS: "Insurers",
                                    PAYOUT_YEARS: "Payout Years",
                                    PREMIUM_FREQUENCY: "Premium Frequency"
                                  };
    component.state.toolTips = {
      CLAIM_CRITERIA:{
      DESCRIPTION: "<p><strong>Standard:</strong> To be eligible for a payout, you will have to be unable to perform 3 out of 6 Activities of Daily Living (ADLs).</p><p><strong>Lenient:</strong> To be eligible for a payout, you will have to be unable to perform 2 out of 6 Activities of Daily Living (ADLs).</p>",
      LOGO_DESCRIPTION: "",
      TITLE: "Claim Criteria"
      },
      CLIAM_FEATURE: "With a single payout feature, you will only be eligible for a one-time payout in the event you are diagnosed with either early, intermediate or late stage critical illness. A multiple payout feature allows for additional payouts to be made to you in the event of a re-diagnosis of early, intermediate or late stage critical illness.",
      DEFERRED_PERIOD: "This indicates the length of waiting time between your diagnosis of a disability and the point where the payout occurs.",
      ESCALATING_BENEFIT: "This feature gives you a 3% yearly increase in payout to help beat inflation.",
      FULL_PARTIAL_RIDER: "Full Rider: <br/>This rider provides coverage for both co-insurance and deductible components. <br/><br/>Partial Rider: <br/>This rider only provides coverage for either co-insurance or deductible."};
    component.handleResponse(response);
  });
  
  it('should trigger ciCoverDetailsPopup()', () => {
    component.ciCoverDetailsPopup();
  });
  
  it('should trigger showSettingsPopUp()', () => {
    component.showSettingsPopUp();
  });
  
  it('should trigger showSettingsToolTip()', () => {
    component.showSettingsToolTip('');
  });
  
  it('should trigger showSettingsToolTip() With Title', () => {
    const tooltip = {title: 'title', message: 'message'};
    component.state.toolTips = {
      CLAIM_CRITERIA:{
      DESCRIPTION: "<p><strong>Standard:</strong> To be eligible for a payout, you will have to be unable to perform 3 out of 6 Activities of Daily Living (ADLs).</p><p><strong>Lenient:</strong> To be eligible for a payout, you will have to be unable to perform 2 out of 6 Activities of Daily Living (ADLs).</p>",
      LOGO_DESCRIPTION: "",
      TITLE: "Claim Criteria"
      },
      CLIAM_FEATURE: "With a single payout feature, you will only be eligible for a one-time payout in the event you are diagnosed with either early, intermediate or late stage critical illness. A multiple payout feature allows for additional payouts to be made to you in the event of a re-diagnosis of early, intermediate or late stage critical illness.",
      DEFERRED_PERIOD: "This indicates the length of waiting time between your diagnosis of a disability and the point where the payout occurs.",
      ESCALATING_BENEFIT: "This feature gives you a 3% yearly increase in payout to help beat inflation.",
      FULL_PARTIAL_RIDER: "Full Rider: <br/>This rider provides coverage for both co-insurance and deductible components. <br/><br/>Partial Rider: <br/>This rider only provides coverage for either co-insurance or deductible."};
    component.state.filterTypes = { CLAIM_CRITERIA: "Claim Criteria",
      CLAIM_FEATURE: "Claim Feature",
      DEFERRED_PERIOD: "Deferred Period",
      ESCALATING_BENEFIT: "Escalating Benefit",
      FULL_PARTIAL_RIDER: "Full / Partial Rider",
      INSURANCE_FINANCIAL_RATING: "Insurers' Financial Rating",
      INSURERS: "Insurers",
      PAYOUT_YEARS: "Payout Years",
      PREMIUM_FREQUENCY: "Premium Frequency"
    };
    component.showSettingsToolTip(tooltip);
  });
  
  it('should trigger showSettingsToolTip() With CLAIM_CRITERIA', () => {
    const tooltip = {title: 'Claim Criteria', message: 'message'};
    component.state.toolTips = {
      CLAIM_CRITERIA:{
      DESCRIPTION: "<p><strong>Standard:</strong> To be eligible for a payout, you will have to be unable to perform 3 out of 6 Activities of Daily Living (ADLs).</p><p><strong>Lenient:</strong> To be eligible for a payout, you will have to be unable to perform 2 out of 6 Activities of Daily Living (ADLs).</p>",
      LOGO_DESCRIPTION: "",
      TITLE: "Claim Criteria"
      },
      CLIAM_FEATURE: "With a single payout feature, you will only be eligible for a one-time payout in the event you are diagnosed with either early, intermediate or late stage critical illness. A multiple payout feature allows for additional payouts to be made to you in the event of a re-diagnosis of early, intermediate or late stage critical illness.",
      DEFERRED_PERIOD: "This indicates the length of waiting time between your diagnosis of a disability and the point where the payout occurs.",
      ESCALATING_BENEFIT: "This feature gives you a 3% yearly increase in payout to help beat inflation.",
      FULL_PARTIAL_RIDER: "Full Rider: <br/>This rider provides coverage for both co-insurance and deductible components. <br/><br/>Partial Rider: <br/>This rider only provides coverage for either co-insurance or deductible."};
    component.state.filterTypes = { CLAIM_CRITERIA: "Claim Criteria",
      CLAIM_FEATURE: "Claim Feature",
      DEFERRED_PERIOD: "Deferred Period",
      ESCALATING_BENEFIT: "Escalating Benefit",
      FULL_PARTIAL_RIDER: "Full / Partial Rider",
      INSURANCE_FINANCIAL_RATING: "Insurers' Financial Rating",
      INSURERS: "Insurers",
      PAYOUT_YEARS: "Payout Years",
      PREMIUM_FREQUENCY: "Premium Frequency"
    };
    component.state.filterModalData = {
      DESCRIPTION: "<p><strong>Standard:</strong> To be eligible for a payout, you will have to be unable to perform 3 out of 6 Activities of Daily Living (ADLs).</p><p><strong>Lenient:</strong> To be eligible for a payout, you will have to be unable to perform 2 out of 6 Activities of Daily Living (ADLs).</p>",
      LOGO_DESCRIPTION: "",
      TITLE: "Claim Criteria"
    };
    component.showSettingsToolTip(tooltip);
  });

  it('should trigger editProdInfo()', () => {
    component.editProdInfo();
  });
  
  it('should trigger selectPlan()', () => {
    component.selectPlan({});
  });
  
  it('should trigger selectPlan() value', () => {
    const dataVal = {plan : {premium: {deferredPeriod: '70 Months',escalatingBenefit: '90 %' }}, selected: true};
    component.selectPlan(dataVal);
  });
  
  it('should trigger selectPlan() value false', () => {
    const dataVal = {plan : {premium: {deferredPeriod: '70 Months',escalatingBenefit: '90 %' }}, selected: false};
    component.selectPlan(dataVal);
  });
  
  it('should trigger updateSelectedPlanData()', () => {
    component.updateSelectedPlanData({});
  });
  
  it('should trigger comparePlan()', () => {
    component.comparePlan({});
  });
  
  it('should trigger comparePlan() value', () => {
    const dataVal = {plan : {premium: {deferredPeriod: '70 Months',escalatingBenefit: '90 %' }}, selected: true};
    component.comparePlan(dataVal);
  });
  
  it('should trigger comparePlan() value false', () => {
    const dataVal = {plan : {premium: {deferredPeriod: '70 Months',escalatingBenefit: '90 %' }}, selected: false};
    component.comparePlan(dataVal);
  });
  
  it('should trigger compare()', () => {
    component.state.searchResult = [{ protectionType: "Life Protection", productList: [{
      authorised: false,
      bestValue: true,
      brochureLink: "https://www.aviva.com.sg/en/insurance/life-and-health/my-protector-series/",
      brochureLinkSize: "NA",
      cashPayoutFrequency: "NA",
      cashValue: "No",
      coverageDuration: "Till age 55,60, 65 or 70.",
      features: "~No waiting period between early and late stage critical illness diagnosis ~Choice of term period from a minimum of 5 years to age 99 ~Covers Juvenile and Special conditions ",
      id: "P226",
      insurer: {id: "AVV",
                insurerName: "Aviva",
                logoName: "logo-aviva.png",
                rating: "A+",
                url: "https://www.aviva.com.sg"},
      isAuthorised: false,
      objectiveId: 0,
      payOut: "A lump sum benefit upon death, terminal illness (TI), total and permanent disability (TPD), early stage critical illness and recurrent late stage critical ilness.",
      premium: {ciSumAssured: 50000,
        claimCriteria: null,
        claimFeature: null,
        coverageName: "MyProtector Term II",
        deferredPeriod: null,
        durationName: "till age 70",
        escalatingBenefit: null,
        gaurenteedMonthlyIncome: null,
        gender: "Male",
        hospitalPlanType: null,
        id: 1214058,
        incomePayoutDuration: null,
        intrestRateOfReturn: "0.00",
        intrestRateOfReturn325: null,
        minimumAge: 41,
        monthlyBenefit: null,
        multiplierRef: null,
        numberOfADL: null,
        payoutAge: null,
        payoutDuration: null,
        payoutType: null,
        premiumAmount: 277.85,
        premiumAmountYearly: 3256.4,
        premiumFrequency: "yearly",
        premiumTerm: "29 Years",
        productId: "P226",
        ranking: 1,
        rankingGroupId: 32,
        retirementPayFeatureDisplay: null,
        retirementPayPeriodDisplay: null,
        retirementPayoutAmount: "0",
        retirementPayoutDuration: "0",
        savingsDuration: "0",
        smoker: false,
        sumAssured: 1000000,
        totalGuaranteedPayout: null,
        totalProjectedPayout325: null,
        totalProjectedPayout475: null
      },
      premiumDuration: "Throughout policy duration",
      productDescription: "This Term policy provides high protection at low cost with death or terminal illness (TI), total and permanent disability (TPD), and early to late stage recurrent critical illness coverage. The Multipay Critical Illness rider offers coverage for a total of 105 early, intermendiate and late stage critical illnesses, 11 juvenile conditions and 13 special conditions. ",
      productName: "MyProtector Term II",
      promotion: null,
      purposeId: 0,
      rebate: "Eligible",
      searchCount: 0,
      status: "Active",
      typeId: 0,
      underWritting: "Yes",
      whyBuy: "I am concerned that I may have to stop work temporarily due to a severe or less severe critical illness hence income loss. I am also concerned my family cannot cope financially with the loss of income upon my demise.",
      rider: {
        id: 6,
        riderName: "MultiPay Critical Illness Rider",
        riderType: null,
        searchCount: 0,
        status: "Active",
        typeId: 0,
        underWritting: "Yes",
        whyBuy: "I am concerned that I may have to stop work temporarily due" 
      }
    }]}];
    component.compare();
  });
  
  it('should trigger updateComparePlanData()', () => {
    component.updateComparePlanData({});
  });
  
  it('should trigger proceedSelection()', () => {
    component.state.selectedPlans = [];
    component.state.enquiryId = 123;
    const prod = {prodCategory : {id: 1, prodCatName: 'LP'}};
    const spyService = spyOn(authService, 'isSignedUser').and.returnValue(true);
    const spyDirectService = spyOn(directService, 'getDirectFormData').and.returnValue(prod);
    component.proceedSelection();
  }); 
  
  it('should trigger proceedSelection() value', () => {
    component.state.selectedPlans = [{type: 'LP'}];
    component.state.enquiryId = 123;
    const prod = {prodCategory : {id: 1, prodCatName: 'LP'}};
    const spyService = spyOn(authService, 'isSignedUser').and.returnValue(true);
    const spyDirectService = spyOn(directService, 'getDirectFormData').and.returnValue(prod);
    //expect(spyService).toHaveBeenCalled();
    //expect(spyDirectService).toHaveBeenCalled();
    component.proceedSelection();
  }); 
  
  it('should trigger proceedSelection() value false', () => {
    component.state.selectedPlans = [{type: 'LP'}];
    component.state.enquiryId = 123;
    const prod = {prodCategory : {id: 1, prodCatName: 'LP'}};
    const spyService = spyOn(authService, 'isSignedUser').and.returnValue(false);
    const spyDirectService = spyOn(directService, 'getDirectFormData').and.returnValue(prod);
    //expect(spyService).toHaveBeenCalled();
    //expect(spyDirectService).toHaveBeenCalled();
    component.proceedSelection();
  }); 
  
  it('should trigger toggleComparePlans()', () => {
    component.state.isComparePlanEnabled = true;
    component.planWidgets[0] = {id: 1};
    component.state.planWidgets = component.planWidgets;
    component.toggleComparePlans();
  }); 
  
  
  it('should trigger toggleComparePlans() false', () => {
    component.state.isComparePlanEnabled = false;
    component.planWidgets[0] = {id: 1};
    component.state.planWidgets = component.planWidgets;
    component.toggleComparePlans();
  }); 
  
  it('should trigger resetUI()', () => {
    component.planWidgets[0] = {};
    component.state.planWidgets = component.planWidgets;
    component.resetUI();
  }); 
  
  it('should trigger resetUI()', () => { 
    component.planWidgets[0] = {id: 1};
    component.state.planWidgets = component.planWidgets;
    component.resetUI();
  }); 
  
  it('should trigger filterProducts()', () => {
    const dataVal = {filters : {premiumFrequency: false}};
    component.planWidgets[0] = {id: 1};
    component.state.planWidgets = component.planWidgets;
    component.filterProducts(dataVal);
  });
  
  it('should trigger filterProducts()', () => {
    const dataVal = {filters : {premiumFrequency: [1,2]}};
    component.planWidgets[0] = {id: 1};
    component.state.planWidgets = component.planWidgets;
    component.filterProducts(dataVal);
  });
});

