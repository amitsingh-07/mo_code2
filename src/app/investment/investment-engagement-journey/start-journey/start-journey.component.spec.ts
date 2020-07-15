import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { concat, Observable, of, throwError } from 'rxjs';
import 'rxjs/add/observable/of';

import { CurrencyPipe } from '@angular/common';
import { appConstants } from '../../../app.constants';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS,
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES
} from '../investment-engagement-journey-routes.constants';

import { tokenGetterFn } from 
'../../../../assets/mocks/service/shared-service';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentApiService } from '../../investment-api.service';
import { createTranslateLoader } from '../investment-engagement-journey.module';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { AppService } from './../../../app.service';
import { LoaderService } from './../../../shared/components/loader/loader.service';
import { ApiService } from './../../../shared/http/api.service';
import { AuthenticationService } from './../../../shared/http/auth/authentication.service';

import { InvestmentTitleBarComponent } from '../../../shared/components/investment-title-bar/investment-title-bar.component';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { StartJourneyComponent } from './start-journey.component';

import mockData from '../../../../assets/mocks/data/start-journey';



export class TestComponent {
}

// tslint:disable-next-line: max-classes-per-file
export class RouterStub {
  public url: string = INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1;
  constructor() { }
  navigate(url: any) {
    return this.url = url;
  }
}

export const routes: Routes = [
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.ROOT,
    redirectTo: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.START,
    pathMatch: 'full',
    component: TestComponent
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.GET_STARTED_STEP1,
    component: TestComponent
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.START,
    component: StartJourneyComponent,
  }
];

let translations: any = '';

describe('StartJourneyComponent', () => {
  let injector: Injector;
  let router: RouterStub;
  let location: Location;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;
  let formBuilder: FormBuilder;

  let component: StartJourneyComponent;
  let fixture: ComponentFixture<StartJourneyComponent>;
  let comp: StartJourneyComponent;

  let footerService: FooterService;
  let translateService: TranslateService;
  let http: HttpTestingController;
  let navbarService: NavbarService;
  let appService: AppService;
  let authService: AuthenticationService;
  let apiService: ApiService;
  let investmentApiService: InvestmentApiService;
  let loader: LoaderService;
  let investmentEngagementJourneyService: InvestmentEngagementJourneyService;

  let httpClientSpy;

  const mockAppService = {
    setJourneyType(type) {
      return true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StartJourneyComponent, InvestmentTitleBarComponent, ErrorModalComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes(routes),
        NgbModule.forRoot(),
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetterFn
          }
        }),
        HttpClientTestingModule,
        HttpModule
      ],
      providers: [
        NgbModal,
        NgbActiveModal,
        StartJourneyComponent,
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
        InvestmentApiService,
        InvestmentEngagementJourneyService,
        { provide: appConstants, useValue: appConstants },
        { provide: XHRBackend, useClass: MockBackend },
        MockBackend,
        { provide: Router, useClass: RouterStub }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorModalComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartJourneyComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    comp = TestBed.get(StartJourneyComponent);

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
    investmentApiService = TestBed.get(InvestmentApiService);
    investmentEngagementJourneyService = TestBed.get(InvestmentEngagementJourneyService);

    router = new RouterStub();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    translations = {
      START: {
        DESC1: 'Investments can help to grow your savings beyond bank deposit rates.',
        DESC2: 'But you need to be able to ride out the ups and downs and stay invested to capture this higher return.',
        // tslint:disable-next-line: max-line-length
        DESC3: 'In the following steps, we help you discover your Risk Profile – your ability and willingness to take risks – and recommend the most suitable portfolio for you.',
        GETSTARTED: 'Get Started',
        PAGE_TITLE: 'Welcome',
        PROMO_ERROR: 'Invalid promo code. Please try again.'
      },
      COMMON: {
      }
    };
    translateService.setTranslation('en', translations);
    fixture.detectChanges();
  });

  // it('should load translations', fakeAsync(() => {
    
  //  spyOn(navbarService, TestBed.get(NavbarService)).and.returnValue(of(true));
  //   // spyOn(navbarService, 'setNavbarMode').and.returnValue(Observable.of(6));
  //   // spyOn(footerService, 'setFooterVisibility').and.returnValue(Observable.of(false));
  //   // spyOn(authService, 'authenticate').and.returnValue(Observable.of(true));
  //   component.ngOnInit();
  // }));

  // it('should load translations', async(() => {
  //   spyOn(translateService, 'getBrowserLang').and.returnValue('en');
  //   const compiled = fixture.debugElement.nativeElement;
  //   // the content should be translated to english now
  //   expect(compiled.querySelector('.btn').textContent).toEqual(translations.START.GETSTARTED);
  // }));

  // it('should call go back', () => {
  //  // component.goBack();
  // });

  // it('should call go next, on button click if promocode is not empty', () => {
  //   component.promoCodeForm.controls.promoCode.setValue('MOTEST1');
  //   spyOn(mockAppService, 'setJourneyType');

  //   const btn = fixture.debugElement.query(By.css('.btn'));
  //   btn.triggerEventHandler('click', null);
  //   fixture.detectChanges();
  //   console.log('=============not empty==============');
  // });

  // it('should call go next, on button click if promocode is empty', () => {
  //   component.promoCodeForm.controls.promoCode.setValue(null);

  //   spyOn(authService, 'saveEnquiryId').and.callThrough();
  //   spyOn(router, 'navigate').and.returnValue([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);

  //   const btn = fixture.debugElement.query(By.css('.btn'));
  //   btn.triggerEventHandler('click', null);

  //   authService.saveEnquiryId(null);
  //   expect(authService.saveEnquiryId).toHaveBeenCalledWith(null);

  //   router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  //   expect(router.navigate).toHaveBeenCalledWith([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);

  //   console.log('==============empty=============');
  // });

  // it('portfolio service status: 6005', () => {
  //   spyOn(investmentEngagementJourneyService, 'verifyPromoCode').and.callThrough().and.returnValue(Observable.of(mockData.case1));
  //   spyOn(loader, 'hideLoader');
  //   spyOn(authService, 'saveEnquiryId').and.callThrough();
  //   spyOn(router, 'navigate').and.returnValue([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);

  //   component.verifyPromoCode(mockData.promoCode);
  //   investmentEngagementJourneyService.verifyPromoCode(mockData.promoCode).subscribe((res) => {
  //     expect(loader.hideLoader).toHaveBeenCalled();
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(component.promoCode).toEqual(res.responseMessage);

  //       expect(authService.saveEnquiryId).toHaveBeenCalledWith(mockData.case1.objectList[0].enquiryId);

  //       router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  //       expect(router.navigate).toHaveBeenCalledWith([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  //     });
  //   });
  //   expect(investmentEngagementJourneyService.verifyPromoCode).toHaveBeenCalledWith(mockData.promoCode);
  //   console.log('==============6005=============');
  // });

  // it('portfolio service status: 5017', () => {
  //   spyOn(investmentEngagementJourneyService, 'verifyPromoCode').and.returnValue(Observable.of(mockData.case2));
  //   spyOn(component, 'showErrorModal');

  //   component.isDisabled = true;

  //   component.verifyPromoCode(mockData.promoCode);
  //   investmentEngagementJourneyService.verifyPromoCode(mockData.promoCode).subscribe((res) => {
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(component.isDisabled).toEqual(false);
  //       expect(component.showErrorModal).toHaveBeenCalledTimes(1);
  //     });
  //   });
  //   expect(investmentEngagementJourneyService.verifyPromoCode).toHaveBeenCalledWith(mockData.promoCode);
  //   console.log('==============5017=============');
  // });

  // it('portfolio service status: 6010', () => {
  //   spyOn(investmentEngagementJourneyService, 'verifyPromoCode').and.returnValue(Observable.of(mockData.case3));
  //   spyOn(loader, 'hideLoader');

  //   comp.verifyPromoCode(mockData.promoCode);
  //   investmentEngagementJourneyService.verifyPromoCode(mockData.promoCode).subscribe((res) => {
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(comp.isDisabled).toEqual(false);
  //     });
  //   });
  //   expect(investmentEngagementJourneyService.verifyPromoCode).toHaveBeenCalledWith(mockData.promoCode);
  //   console.log('==============6010=============');
  // });

  // it('portfolio service subscribe error', () => {
  //   const result = concat(throwError(new Error('oops!')));
  //   spyOn(investmentEngagementJourneyService, 'verifyPromoCode').and.callThrough().and.returnValue(result);
  //   spyOn(loader, 'hideLoader');

  //   component.verifyPromoCode(mockData.promoCode);
  //   investmentEngagementJourneyService.verifyPromoCode(mockData.promoCode).subscribe((res) => {
  //   }, (error) => {
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(loader.hideLoader).toHaveBeenCalled();
  //       expect(component.isDisabled).toEqual(false);
  //     });
  //   });
  //   expect(investmentEngagementJourneyService.verifyPromoCode).toHaveBeenCalledWith(mockData.promoCode);
  //   console.log('=============subscribe error==============');
  // });

  // it('should call show error modal', () => {
  //   ngbModalRef = ngbModalService.open(ErrorModalComponent);
  //   spyOn(ngbModalService, 'open').and.returnValue(ngbModalRef);
  //   const showModal = comp.showErrorModal();
  //   expect(ngbModalService.open).toHaveBeenCalled();
  //   expect(ngbModalRef.componentInstance.errorTitle).toEqual('Error');
  //   expect(ngbModalRef.componentInstance.errorDescription).toEqual(translations.PROMO_ERROR);
  //   expect(showModal).toEqual(false);
  // });
});
