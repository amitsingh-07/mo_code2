import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location, APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule, Router, Routes, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, throwError } from 'rxjs';
import 'rxjs/add/observable/of';

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

import { tokenGetterFn } from
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

  let httpClientSpy;
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };
  let translations: any = '';
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
        NgbModule.forRoot(),
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetterFn
          }
        }),
        HttpClientTestingModule,
        HttpModule,
        RouterTestingModule.withRoutes(routes),
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
        { provide: CurrencyPipe, useValue: CurrencyPipe },
        { provide: AppService, useValue: mockAppService },
        FooterService,
        NavbarService,
        HeaderService,
        LoaderService,
        FormBuilder,
        ComprehensiveService,
        ComprehensiveApiService,
        { provide: appConstants, useValue: appConstants },
        { provide: XHRBackend, useClass: MockBackend },
        MockBackend,
        AboutAge,
        RoutingService,
       // { provide: APP_BASE_HREF, useValue: '/' },
       // { provide: Router, useClass: RouterStub }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorModalComponent, StepIndicatorComponent] } })
      .compileComponents();
    router = TestBed.get(Router);
    router.initialNavigation();
    spyOn(router, 'navigateByUrl');
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
    comprehensiveService = TestBed.get(ComprehensiveService);
    comprehensiveAPiService = TestBed.get(comprehensiveAPiService);
    //router = new RouterStub();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    //router = TestBed.get(Router);
    translations = {
      CMP: {
        "COMPREHENSIVE_STEPS": {
          "STEP": "Step",
          "STEP_1_TITLE": "What's On Your Shoulders",
          "STEP_1_DESC": "Your family commitments will impact your financial planning. Let's list it down now.",
          "STEP_1_DESC_LITE": "Your family commitments will impact your financial planning.",
          "STEP_2_TITLE": "Your Finances",
          "STEP_2_DESC": "This information helps us to estimate your financial health, your protection needs, and what you can save and invest.",
          "STEP_3_TITLE": "Risk-Proof Your Journey",
          "STEP_3_DESC": "Let's find out how protected you are in case of unexpected events.",
          "STEP_4_TITLE_NAV": "Retirement Planning",
          "STEP_4_TITLE": "Financial Independence, Retire Early",
          "STEP_4_DESC": "Tell us when you wish to retire!",
          "STEP_4_TITLE_LITE": "Your Risk Profile",
          "STEP_4_DESC_LITE": "Let us know your willingness to stay invested for retirement.",
          "STEP_5_TITLE": "Congratulations!",
          "STEP_5_DESC2": "Your data is submitted.",
          "STEP_5_TITLE_NAV": "Result"
        },
        "MY_LIABILITIES": {
          "TITLE": "What You Owe",
          "HEADER": "Sometimes, we borrow to fund our assets or spending. These liabilities have to be repaid over time.",
          "LIABILITIES_BUCKETS": "Your Liabilities Bucket",
          "HOME_LOAN_OUTSTANDING": "Home Loan Outstanding",
          "ADD_OTHER_PROPERTY_lOAN": "Add other Property Loan",
          "OTHER_PROPERTY_LOAN": "Other Property Loan",
          "OTHER_LOANS_AMOUNT_OUTSTANDING": "Other Loan Outstanding",
          "CAR_LOANS": "Car Loan Outstanding",
          "LIABILITIES_BUCKETS_TOTAL": "in total",
          "LIABILITIES_BUCKETS_NOTE": "Your liabilities bucket",
          "FORM": {
            "LOAN_PLACEHOLDER": "Enter Amount"
          },
          "TOOLTIP": {
            "HOME_LOAN_OUTSTANDING_TITLE": "Home Loan Outstanding",
            "HOME_LOAN_OUTSTANDING_MESSAGE": "This is the total outstanding loan for the home you live in that has yet to be paid off, not the monthly instalment.",
            "OTHER_LOAN_TITLE": "Other Loan Outstanding",
            "OTHER_LOAN_MESSAGE": "Add up your outstanding renovation loan, credit lines etc. This is the total loan amount that have yet to be paid off, not the monthly instalments.",
            "OTHER_PROPERTY_LOAN_TITLE": "Other Property Loan",
            "OTHER_PROPERTY_LOAN_MESSAGE": "Add up the outstanding loan amounts for all other properties. This is the total loan amount that have yet to be paid off, not the monthly instalments.",
            "CAR_LOANS_TITLE": "Car Loan Outstanding",
            "CAR_LOANS_MESSAGE": "This is the total outstanding loan for any motor vehicle you own that has yet to be paid off, not the monthly instalment."
          },
          "OPTIONAL_VALIDATION_FLAG": false
        },
      },
      COMMON: {
      }
    };
    translateService.setTranslation('en', translations);

    fixture.detectChanges();
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
});
