import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FooterService } from 'src/app/shared/footer/footer.service';
import { MockInvestmentAccountService } from './../../../../assets/mocks/service/shared-service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from './../investment-account-service';
import { AdditionalDeclaration2Component } from './additional-declaration2.component';
import { getTestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { DatePipe } from '@angular/common';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { concat, Observable, of, throwError } from 'rxjs';
import { Injector } from '@angular/core';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('AdditionalDeclaration2Component', () => {
  let component: AdditionalDeclaration2Component;
  let fixture: ComponentFixture<AdditionalDeclaration2Component>;
  let investAccountService: MockInvestmentAccountService;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let signUpService: SignUpService;
  let authService: AuthenticationService;
  let translateService: TranslateService;
  let investmentAccountService: InvestmentAccountService;
  let investmentCommonService: InvestmentCommonService;
  //let investAccountService: mockInvestmentEngagementJourneyService;
  let loader: LoaderService;
  let injector: Injector;
  let ngbModalService: NgbModal;
  let ngbModalRef: NgbModalRef;

  let translations = require('../../../../assets/i18n/investment-account/en.json');




  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalDeclaration2Component],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal, AuthenticationService, DatePipe, TranslateService,
        InvestmentAccountService,
        LoaderService,
        {
          provide: InvestmentAccountService
          //useClass: mockInvestmentEngagementJourneyService 
        }],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclaration2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
    investAccountService = TestBed.get(InvestmentAccountService);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = TestBed.get(TranslateService);
    investmentAccountService = TestBed.get(InvestmentAccountService);
    investmentCommonService = TestBed.get(InvestmentCommonService);
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

  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('ADDITIONAL_DECLARATIONS_SCREEN_TWO.TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('ADDITIONAL_DECLARATIONS_SCREEN_TWO.TITLE');
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    spyOn(investAccountService, 'isSingaporeResident').and.returnValue(true);
    spyOn(investAccountService, 'getCountriesFormDataByFilter').and.returnValue([]);
    spyOn(investAccountService, 'getInvestmentAccountFormData').and.returnValue({});
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    // const getSourceListSpy = spyOn(component, 'getSourceList');
    // expect(getSourceListSpy).toHaveBeenCalled();
    let errors = {};
    let expectedNumberOfTransation = component.additionDeclarationtwo.controls['expectedNumberOfTransation'];
    expect(expectedNumberOfTransation.valid).toBeFalsy();
    errors = expectedNumberOfTransation.errors || {};
    expect(errors['required']).toBeTruthy();
    expectedNumberOfTransation.setValue(6);
    errors = expectedNumberOfTransation.errors || {};
    expect(errors['required']).toBeFalsy();
    let source = component.additionDeclarationtwo.controls['source'];
    expect(source.valid).toBeFalsy();
    errors = source.errors || {};
    expect(errors['required']).toBeTruthy();
    source.setValue(6);
    errors = source.errors || {};
    expect(errors['required']).toBeFalsy();
    let expectedAmountPerTranction = component.additionDeclarationtwo.controls['expectedAmountPerTranction'];
    expect(expectedAmountPerTranction.valid).toBeFalsy();
    errors = expectedAmountPerTranction.errors || {};
    expect(errors['required']).toBeTruthy();
    expectedAmountPerTranction.setValue(1000);
    errors = expectedAmountPerTranction.errors || {};
    expect(errors['required']).toBeFalsy();

  });

 it('form invalid when empty', () => {
    expect(component.additionDeclarationtwo.valid).toBeFalsy();
  });

  it('set the earing generated form', () => {
    spyOn(component, 'selectEarningsGenerated').and.returnValue({});
    component.selectEarningsGenerated('earningsGenerated', 'generated', 'investmentEarnings');
  });

  it('set investment period form', () => {
    spyOn(component, 'selectInvestmentPeriod').and.returnValue({});
    component.selectInvestmentPeriod('earningsGenerated', 'generated', 'investmentEarnings');
  });

  it('set investment period form', () => {
    spyOn(component, 'selectSource').and.returnValue({});
    let sourceObj = {}
    component.selectSource('source', sourceObj);
  });

  it('markAllFieldsDirty  method', () => {
    spyOn(component, 'markAllFieldsDirty').and.returnValue({});
    let sourceObj = {}
    component.markAllFieldsDirty(component.additionDeclarationtwo);
  });


  it('expected NumberOf Transation field validity', () => {
    let errors = {};
    let expectedNumberOfTransation = component.additionDeclarationtwo.controls['expectedNumberOfTransation'];
    expect(expectedNumberOfTransation.valid).toBeFalsy();
    errors = expectedNumberOfTransation.errors || {};
    expect(errors['required']).toBeTruthy();
    expectedNumberOfTransation.setValue(6);
    errors = expectedNumberOfTransation.errors || {};
    expect(errors['required']).toBeFalsy();
    let source = component.additionDeclarationtwo.controls['source'];
    expect(source.valid).toBeFalsy();
    errors = source.errors || {};
    expect(errors['required']).toBeTruthy();
    source.setValue(6);
    errors = source.errors || {};
    expect(errors['required']).toBeFalsy();
    let expectedAmountPerTranction = component.additionDeclarationtwo.controls['expectedAmountPerTranction'];
    expect(expectedAmountPerTranction.valid).toBeFalsy();
    errors = expectedAmountPerTranction.errors || {};
    expect(errors['required']).toBeTruthy();
    expectedAmountPerTranction.setValue(1000);
    errors = expectedAmountPerTranction.errors || {};
    expect(errors['required']).toBeFalsy();

  });
  it('add and remove  source field', () => {
    spyOn(component, 'addAndRemoveSourseFields').and.returnValue({});
    component.addAndRemoveSourseFields();
    // expect(loadDDCRoadmapSpy).toHaveBeenCalled();
    component.additionDeclarationtwo.removeControl('investmentEarnings');
    component.additionDeclarationtwo.removeControl('personalSavingForm');
    component.additionDeclarationtwo.removeControl('inheritanceGiftFrom');
  });

  it('should buildForm', () => {
    spyOn(component, 'addAndRemoveSourseFields').and.returnValue({});
    component.addAndRemoveSourseFields();
    // expect(loadDDCRoadmapSpy).toHaveBeenCalled();
  });
  // showInvestmentAccountErrorModal
  it('should showInvestmentAccountErrorModal', () => {
    spyOn(component, 'showInvestmentAccountErrorModal').and.returnValue({});
    component.showInvestmentAccountErrorModal({});
    // expect(loadDDCRoadmapSpy).toHaveBeenCalled();
  });
});