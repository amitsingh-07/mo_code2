import { IComprehensiveDetails } from './../comprehensive-types';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Location, APP_BASE_HREF, DatePipe } from '@angular/common';
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


import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';

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
import { COMPREHENSIVE_ROUTES, COMPREHENSIVE_ROUTE_PATHS } from './../comprehensive-routes.constants';
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
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;


  let comp: ComprehensiveComponent;
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
  const route = ({ routeConfig: { component: { name: 'ComprehensiveComponent'} } } as any) as ActivatedRoute;
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
  beforeEach(async(() => {
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
        //RouterTestingModule.withRoutes(routes),
        RouterTestingModule.withRoutes([]),
        //RouterModule.forRoot(routes)
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
    fixture = TestBed.createComponent(ComprehensiveComponent);
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
    comprehensiveAPiService = TestBed.get(comprehensiveAPiService);
    progressTrackerService = TestBed.get(ProgressTrackerService);
    //router = new RouterStub();
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
    spyOn(comprehensiveService, 'getComprehensiveVersion').and.returnValue(true);
    navbarService.setNavbarComprehensive(true);
    footerService.setFooterVisibility(false);
    appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
    const comprehensiveLiteEnabled = authService.isSignedUserWithRole(COMPREHENSIVE_CONST.ROLES.ROLE_COMPRE_LITE);
    let getCurrentVersionType = comprehensiveService.getComprehensiveCurrentVersion();
    if ((getCurrentVersionType === '' || getCurrentVersionType === null ||
      getCurrentVersionType === COMPREHENSIVE_CONST.VERSION_TYPE.LITE) && comprehensiveLiteEnabled) {
      getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.LITE;
    } else {
      getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.FULL;
    }
    component.isBannerNoteVisible = component.isCurrentDateInRange(COMPREHENSIVE_CONST.BANNER_NOTE_START_TIME,
      COMPREHENSIVE_CONST.BANNER_NOTE_END_TIME);
      spyOn(comprehensiveAPiService, 'getComprehensiveSummaryDashboard').and.returnValue(true); });
  it('ngOnDestroy', () => {
    component.ngOnInit();
  
  });
  
  it('should call go', () => {
    component.redirect();
  

  });
  it('buildPromoCodeForm', () => {
    component.buildPromoCodeForm();
  
  });
  

  it('getStarted', () => {
    spyOn(router, 'navigate');
    component.getStarted();
  
    if(authService.isSignedUser()){
      expect(router.navigate).toHaveBeenCalledWith([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    }
  
  });

  it('getStarted', () => {
    spyOn(router, 'navigate');
    component.getStarted();
    if(!authService.isSignedUser()){
      expect(component.showSuccessPopup).toHaveBeenCalledWith();
  
    }
  });
  it('showSuccessPopup', () => {
    component.showSuccessPopup();
    
  
  });
  it('getPromoCode', () => {
    component.getPromoCode();
    appService.setAction(COMPREHENSIVE_CONST.PROMO_CODE.GET);
    comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
  
  });
  it('showLoginOrSignUpModal', () => {
    component.showLoginOrSignUpModal();
  
  });
  it('isCurrentDateInRange', () => {
    component.isCurrentDateInRange(0,0);
  
  });
   it('getProductAmount', () => {
    component.getProductAmount();
  
  });
  
  
  it('form invalid when empty', () => {
    expect(component.promoCodeForm.valid).toBeFalsy();
  });

  it('promocode code validity', () => {
    let errors = {};
    const comprehensivePromocode = component.promoCodeForm.controls['comprehensivePromoCodeToken'];
    expect(comprehensivePromocode.valid).toBeFalsy();
  
    

    // Check for invalid first name
    comprehensivePromocode.setValue('mo');
    errors = comprehensivePromocode.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for valid first name
    comprehensivePromocode.setValue('mocfpn');
    errors = comprehensivePromocode.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });
 
  it('submitting a form emits user info', () => {
    expect(component.promoCodeForm.valid).toBeFalsy(); 
    comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.FULL);

 //   appService.setAction(COMPREHENSIVE_CONST.PROMO_CODE.VALIDATE);

  
  });
  // it('testing the proceed button', async(() => {
  //   spyOn(component, 'getStarted');
  //   const button = fixture.debugElement.nativeElement.querySelector('button');
  //   button.click();
  //   fixture.whenStable().then(() => {
  //     expect(component.getStarted).toHaveBeenCalled();
  //   });
  // }));

});
