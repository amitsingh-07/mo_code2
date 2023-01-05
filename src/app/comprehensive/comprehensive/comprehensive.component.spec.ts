import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
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
import { COMPREHENSIVE_ROUTE_PATHS } from './../comprehensive-routes.constants';
import { AboutAge } from './../../shared/utils/about-age.util';
import { RoutingService } from './../../shared/Services/routing.service';
import { ComprehensiveComponent } from './comprehensive.component';
class MockRouter {
  navigateByUrl(url: string) { return url; }
}
describe('ComprehensiveComponent', () => {
  let component: ComprehensiveComponent;
  let fixture: ComponentFixture<ComprehensiveComponent>;
  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let formBuilder: FormBuilder;


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
  const route = ({ routeConfig: { component: { name: 'ComprehensiveComponent' } } } as any) as ActivatedRoute;
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
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComprehensiveComponent, ErrorModalComponent, StepIndicatorComponent],
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
        ComprehensiveComponent,
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
        ProgressTrackerService,
        { provide: ActivatedRoute, useValue: route }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorModalComponent, StepIndicatorComponent] } })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprehensiveComponent);
    component = fixture.componentInstance;

    ngbModalService = TestBed.inject(NgbModal);
    injector = getTestBed();
    loader = TestBed.inject(LoaderService);
    location = TestBed.inject(Location);
    http = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);

    appService = TestBed.inject(AppService);
    apiService = TestBed.inject(ApiService);
    authService = TestBed.inject(AuthenticationService);
    navbarService = TestBed.inject(NavbarService);
    footerService = TestBed.inject(FooterService);
    translateService = injector.get(TranslateService);
    comprehensiveService = TestBed.inject(ComprehensiveService);
    comprehensiveAPiService = TestBed.get(comprehensiveAPiService);
    progressTrackerService = TestBed.inject(ProgressTrackerService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });


  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    navbarService.setNavbarComprehensive(true);
    footerService.setFooterVisibility(false);
    appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
  });

  it('ngOnDestroy', () => {
    component.ngOnInit();
  });

  it('should call go', () => {
    component.redirect();
  });

  it('getStarted', () => {
    spyOn(router, 'navigate');
    component.getStarted();
    if (authService.isSignedUser()) {
      expect(router.navigate).toHaveBeenCalledWith([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    }
  });

  it('getStarted', () => {
    spyOn(router, 'navigate');
    component.getStarted();
  });

  it('getPromoCode', () => {
    appService.setAction(COMPREHENSIVE_CONST.PROMO_CODE.GET);
  });

  it('showLoginOrSignUpModal', () => {
    component.showLoginOrSignUpModal();
  });

  it('isCurrentDateInRange', () => {
    component.isCurrentDateInRange(0, 0);
  });

});
