
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl  } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location, APP_BASE_HREF, DatePipe } from '@angular/common';
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

import { ComparePlansComponent } from './compare-plans.component';

import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Util } from './../../shared/utils/util';

import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { appConstants } from './../../app.constants';

import { tokenGetterFn, mockCurrencyPipe } from
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
import { createTranslateLoader } from '../direct.module';

import { DirectService } from './../direct.service';
import { AboutAge } from '../../shared/utils/about-age.util';

describe('ComparePlansComponent', () => {
  let component: ComparePlansComponent;
  let fixture: ComponentFixture<ComparePlansComponent>;
  let translations = require('../../../assets/i18n/direct/en.json');
  let navbarService: NavbarService;
  let directService: DirectService;
  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;
  let formArray: FormArray;

  let routerNavigateSpy: jasmine.Spy;

  let comp: ComparePlansComponent;
  let progressTrackerService: ProgressTrackerService;
  let footerService: FooterService;
  let translateService: TranslateService;
  let http: HttpTestingController;
  let appService: AppService;
  let authService: AuthenticationService;
  let apiService: ApiService;
  let loader: LoaderService;
  let router: Router;
  let myInfoService: MyInfoService;
  let parserFormatter: NgbDateParserFormatter;
  const route = ({ routeConfig: { component: { name: 'ComparePlansComponent'} } } as any) as ActivatedRoute;
  let httpClientSpy;
  let currencyPipe: CurrencyPipe;
  let pageTitle: string;
  let plansData: any[] = [];
  let cashValueTooltipData;
  let underwritingTooltipData;
  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparePlansComponent, ProductDetailComponent ],
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
        AuthenticationService,
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
        AboutAge
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePlansComponent);
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
    translateService = injector.get(TranslateService);

    translateService.setTranslation('en', translations);
    translateService.use('en');
    
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    translateService.get('COMMON').subscribe((result: string) => {
      component.pageTitle = translateService.instant('COMPARE_PLANS.TITLE');
      component.cashValueTooltipData = translateService.instant('COMPARE_PLANS.CASH_VALUE_TOOLTIP');
      component.underwritingTooltipData = translateService.instant('COMPARE_PLANS.NEED_UNDERWRITING_TOOLTIP');
    
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger ngOnInit', () => {
    component.cashValueTooltipData = {
      "TITLE": "Cash Value",
      "DESCRIPTION" : "When this plan matures, you will receive a cash payout!"
    };
    component.ngOnInit();
  });

  it('should trigger setPageTitle', () => {
    component.setPageTitle('Compare Plan');
  });

  it('should trigger showCashValueTooltip', () => {     
    component.cashValueTooltipData = {
      "TITLE": "Cash Value",
      "DESCRIPTION" : "When this plan matures, you will receive a cash payout!"
    };
    component.showCashValueTooltip();
  });

  it('should trigger showUnderwritingTooltip()', () => {
    component.underwritingTooltipData = {
      "TITLE": "Requires Underwriting",
      "DESCRIPTION" : "Before you can be insured under this plan, the insurer will first evaluate you."
    }
    component.showUnderwritingTooltip();
  });

  it('should trigger viewDetails', () => {
    component.viewDetails([]);
  });

  it('should trigger close', () => {
    component.close();
  });
});
