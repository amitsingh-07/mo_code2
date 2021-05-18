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

import { CriticalIllnessFormComponent } from './critical-illness-form.component';
import { ICriticalIllness } from './critical-illness.interface';
import { ConfigService } from './../../../config/config.service';
import { LoaderService } from './../../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { Util } from './../../../shared/utils/util';

import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { appConstants } from './../../../app.constants';

import { tokenGetterFn, mockCurrencyPipe } from
  '../../../../assets/mocks/service/shared-service';

import { FooterService } from './../../../shared/footer/footer.service';
import { HeaderService } from './../../../shared/header/header.service';
import { AppService } from './../../../app.service';
import { ApiService } from './../../../shared/http/api.service';
import { AuthenticationService } from './../../../shared/http/auth/authentication.service';

import { ErrorModalComponent } from './../../../shared/modal/error-modal/error-modal.component';
import { RoutingService } from './../../../shared/Services/routing.service';
import { MyInfoService } from './../../../shared/Services/my-info.service';
import { NgbDateCustomParserFormatter } from './../../../shared/utils/ngb-date-custom-parser-formatter';

import { ProductDetailComponent } from './../../../shared/components/product-detail/product-detail.component';
import { createTranslateLoader } from './../../direct.module';

import { DirectService } from './../../direct.service';
import { AboutAge } from './../../../shared/utils/about-age.util';
import { DirectApiService } from './../../direct.api.service';


describe('CriticalIllnessFormComponent', () => {
  let component: CriticalIllnessFormComponent;
  let fixture: ComponentFixture<CriticalIllnessFormComponent>;
  let translations = require('../../../../assets/i18n/direct/en.json');
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

  let comp: CriticalIllnessFormComponent;
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
  const route = ({ routeConfig: { component: { name: 'CriticalIllnessFormComponent'} } } as any) as ActivatedRoute;
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
      declarations: [ CriticalIllnessFormComponent, ProductDetailComponent ],
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
    fixture = TestBed.createComponent(CriticalIllnessFormComponent);
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
    
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger ngOnInit', () => {
    component.ngOnInit();
  });  

  it('should trigger onGenderChange', () => {
    component.onGenderChange();
  });  

  it('should trigger onDobChange', () => {
    component.onDobChange();
  });  

  it('should trigger ngOnDestroy', () => {
    component.ngOnDestroy();
  });  

  it('should trigger selectCoverageAmt', () => {
    component.selectCoverageAmt(1000);
  });  

  it('should trigger selectDuration', () => {
    component.selectDuration(10);
  }); 

  it('should trigger summarizeDetails', () => {
    component.summarizeDetails();
  }); 

  it('should trigger save', () => {
    component.save();
  });  

  it('should trigger showToolTip', () => {
    component.showToolTip('TITLE', 'MESSAGE');
  });  

  it('form invalid when empty', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
  });

  it('dob field validity', () => {
    const dob = component.criticalIllnessForm.controls['dob'];
    expect(dob.valid).toBeFalsy();
  });

  it('dob field error', () => {
    let errors = {};
    const dob = component.criticalIllnessForm.controls['dob'];
    errors = dob.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['gender'];
    expect(radio.valid).toBeFalsy();
  });
  it('validity of form ', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
    component.criticalIllnessForm.controls['gender'].setValue('Smoker');
    expect(component.criticalIllnessForm.valid).toBeTruthy();
  });

  it('submitting a form emits user info', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
    component.criticalIllnessForm.controls['dob'].setValue('04/10/1993');
    expect(component.criticalIllnessForm.valid).toBeTruthy();

    component.save();
    const criticalPlan: ICriticalIllness = directService.getCriticalIllnessForm();
    const dobObj = JSON.parse(criticalPlan.dob);
    expect(dobObj.year).toBe('1993');
    expect(dobObj.month).toBe('10');
    expect(dobObj.day).toBe('04');
  });
  it('testing the Coverage Amount dropdown', async(() => {
    spyOn(component, 'coverage_amt');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#getStrLbl6 button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.coverage_amt).toHaveBeenCalled();
      });
    });
  }));
  it('testing the duration dropdown', async(() => {
    spyOn(component, 'duration');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#getStrLbl7 button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.duration).toHaveBeenCalled();
      });
    });
  }));
  it('Early CI radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['earlyCI'];
    expect(radio.valid).toBeFalsy();
  });
  it('Early CI radio button field validity', () => {
    const radio = component.criticalIllnessForm.controls['earlyCI'];
    expect(radio.valid).toBeFalsy();
  });
  // tslint:disable-next-line:no-identical-functions
  it('Early CI validity of form ', () => {
    expect(component.criticalIllnessForm.valid).toBeFalsy();
    component.criticalIllnessForm.controls['earlyCI'].setValue('Yes');
    expect(component.criticalIllnessForm.valid).toBeTruthy();
  });
});
