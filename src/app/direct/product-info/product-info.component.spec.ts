import { waitForAsync, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormArray  } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { ProductInfoComponent } from './product-info.component';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import { CurrencyPipe, TitleCasePipe } from '@angular/common';

import { tokenGetterFn, mockCurrencyPipe } from
  '../../../assets/mocks/service/shared-service';

import { FooterService } from './../../shared/footer/footer.service';
import { HeaderService } from './../../shared/header/header.service';
import { AppService } from './../../app.service';
import { ApiService } from './../../shared/http/api.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { RoutingService } from './../../shared/Services/routing.service';
import { MyInfoService } from '../../shared/Services/my-info.service';

import { ProductDetailComponent } from '../../shared/components/product-detail/product-detail.component';
import { createTranslateLoader } from '../direct.module';

import { DirectService } from './../direct.service';
import { AboutAge } from '../../shared/utils/about-age.util';
import { DirectApiService } from './../direct.api.service';

describe('ProductInfoComponent', () => {
  let component: ProductInfoComponent;
  let fixture: ComponentFixture<ProductInfoComponent>;
  let translations = require('../../../assets/i18n/direct/en.json');
  let navbarService: NavbarService;
  let directService: DirectService;
  let directApiService: DirectApiService;
  let injector: Injector;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;
  let formArray: FormArray;

  let routerNavigateSpy: jasmine.Spy;

  let comp: ProductInfoComponent;
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
  const route = ({ routeConfig: { component: { name: 'ProductInfoComponent'} } } as any) as ActivatedRoute;
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
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInfoComponent, ProductDetailComponent ],
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
    fixture = TestBed.createComponent(ProductInfoComponent);
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
      component.pageTitle = translateService.instant('RESULTS.TITLE');      
    
    });
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger ngOnInit', () => {
    component.ngOnInit();
  });
  
  it('should trigger initCategorySetup() greater', () => {
    component.innerWidth = 500; component.mobileThreshold = 600;
    component.initCategorySetup();
  });
  
  it('should trigger initCategorySetup()', () => {
    component.innerWidth = 700; component.mobileThreshold = 600;
    component.initCategorySetup();
  });
  
  it('should trigger getProductCategoryList()', () => {
    component.getProductCategoryList();
  });
  
  it('should trigger getProductCategory()', () => {
    component.getProductCategory();
  });
  
  it('should trigger setSelectedCategory() greater', () => {
    component.innerWidth = 500; component.mobileThreshold = 600;
    component.setSelectedCategory();
  });
  
  it('should trigger setSelectedCategory()', () => {
    component.innerWidth = 700; component.mobileThreshold = 600;
    component.setSelectedCategory();
  });
  
  it('should trigger ngOnDestroy()', () => {
    component.ngOnDestroy();
  });
  
  it('should trigger initDisplaySetup()', () => {
    component.initDisplaySetup();
  });
  
  it('should trigger search()', () => {
    component.search('');
  });
  
  it('should trigger editProdInfo() greater', () => {
    component.innerWidth = 500; component.mobileThreshold = 600;
    component.editProdInfo();
  });
  
  it('should trigger editProdInfo()', () => {
    component.innerWidth = 700; component.mobileThreshold = 600;
    component.editProdInfo();
  });
  
  it('should trigger minProdInfo()', () => {
    component.minProdInfo();
  });
  
  it('should trigger closeModal()', () => {
    component.closeModal();
  });
  
  it('should trigger openProductCategory()', () => {
    component.openProductCategory('');
  });
  
  it('should trigger selectProductCategory()', () => {
    component.selectProductCategory({id:1, prodCatName: 'Product'}, 1);
  });
  
  it('should trigger setActiveProductCategory()', () => {
    component.setActiveProductCategory('');
  });
  
  it('should trigger setActiveProductCategory()', () => {
    component.setActiveProductCategory(1);
  });
  
  it('should trigger closeModal()', () => {
    component.closeModal();
  });
  
  it('should trigger formSubmitted()', () => {
    component.formSubmitted({});
  });
  
  it('should trigger openToolTipModal()', () => {
    component.openToolTipModal({title: 'title', message: 'message'});
  });
});
