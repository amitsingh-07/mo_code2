
import { waitForAsync, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Location, DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../app.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { FooterService } from './../../shared/footer/footer.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { tokenGetterFn, mockCurrencyPipe } from '../../../assets/mocks/service/shared-service';
import { HeaderService } from './../../shared/header/header.service';
import { createTranslateLoader } from '../comprehensive.module';
import { ApiService } from './../../shared/http/api.service';
import { StepIndicatorComponent } from './../../shared/components/step-indicator/step-indicator.component';
import { AboutAge } from './../../shared/utils/about-age.util';
import { RoutingService } from './../../shared/Services/routing.service';
import { ComprehensiveDashboardComponent } from './dashboard.component';
import { FileUtil } from './../../shared/utils/file.util';

class MockRouter {
  navigateByUrl(url: string) { return url; }
}
describe('DashboardComponent', () => {
  let component: ComprehensiveDashboardComponent;
  let fixture: ComponentFixture<ComprehensiveDashboardComponent>;
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
  const route = ({ routeConfig: { component: { name: 'ComprehensiveDashboardComponent' } } } as any) as ActivatedRoute;
  let httpClientSpy;
  let currencyPipe: CurrencyPipe;
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };
  let translations = require('../../../assets/i18n/app/en.json');
  const routerStub = {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComprehensiveDashboardComponent, ErrorModalComponent, StepIndicatorComponent],
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
        ComprehensiveDashboardComponent,
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
    fixture = TestBed.createComponent(ComprehensiveDashboardComponent);
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
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    spyOn(appService, 'clearPromoCode');
    component.comprehensivePlanning=4;
    component.setComprehensivePlan(true);
  });
  it('ngOnInit', () => {
    component.showFixedToastMessage = true;
    component.comprehensiveLiteEnabled =  true;
    component.ngOnInit();
  });
  it('generateReport', () => {
    component.generateReport();
  });
  it('downloadComprehensiveReport', () => {
    component.downloadComprehensiveReport();
  });
  it('goToEditProfile', () => {
    component.goToEditProfile();
  });
  it('goToCurrentStep', () => {
    component.goToCurrentStep();
  });
  it('goToEditComprehensivePlan', () => {
    component.goToEditComprehensivePlan(true);
  });
  it('getCurrentComprehensiveStep', () => {
    component.getCurrentComprehensiveStep();
  });
  it('setComprehensivePlan', () => {
    component.setComprehensivePlan(true);
  });
  it('setComprehensiveSummary', () => {
    component.setComprehensiveSummary(true,COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED);
  });
  it('setComprehensiveDashboard', () => {
    component.setComprehensiveDashboard();
  });
  it('showPaymentModal', () => {
    component.showPaymentModal();
  });
  it('showCopyToast', () => {
    component.showCopyToast(0);
  });
  it('hideToastMessage', () => {
    component.hideToastMessage();
    setTimeout(() => {
      component.showFixedToastMessage = false;
      component.toastMsg = null;
    }, 3000);
  });
  
  it('testing the proceed button', waitForAsync(() => {
    spyOn(component, 'setComprehensiveDashboard');
  }));

});