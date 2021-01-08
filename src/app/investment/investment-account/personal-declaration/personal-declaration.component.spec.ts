import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FooterService } from 'src/app/shared/footer/footer.service';
import { MockInvestmentAccountService } from './../../../../assets/mocks/service/shared-service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from './../investment-account-service';
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
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';
import { SIGN_UP_ROUTE_PATHS } from 'src/app/sign-up/sign-up.routes.constants';
import { PersonalDeclarationComponent } from './personal-declaration.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ERoadmapStatus } from '../../../shared/components/roadmap/roadmap.interface';
import { HeaderService } from '../../../shared/header/header.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';

describe('PersonalDeclarationComponent', () => {
  let component: PersonalDeclarationComponent;
  let fixture: ComponentFixture<PersonalDeclarationComponent>;
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
  let investmentEngagementJourneyService: InvestmentEngagementJourneyService;
  let translations = require('../../../../assets/i18n/investment-account/en.json');
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalDeclarationComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          NgbActiveModal, 
          AuthenticationService, 
          DatePipe, 
          TranslateService,
          InvestmentAccountService,
          LoaderService,
        
          //   {
          //     provide: NG_VALUE_ACCESSOR,
          //   //  multi: true,
          //     useExisting: undefined
          //     //useExisting: forwardRef(() => IntPhonePrefixComponent),
          //   },
          //   {
          //     provide: AMBIENT_CART,
          //     useValue: undefined
          // }
        {
          provide: InvestmentAccountService,
          useClass: MockInvestmentAccountService 
        }],
        
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [] } })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDeclarationComponent);
    component = fixture.componentInstance;
    investAccountService = TestBed.get(InvestmentAccountService);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    router = TestBed.get(Router);
    ngbModalService = TestBed.get(NgbModal);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    signUpService = TestBed.get(SignUpService);
    authService = TestBed.get(AuthenticationService);
    translateService = TestBed.get(TranslateService);
    investmentAccountService = TestBed.get(InvestmentAccountService);
    investmentCommonService = TestBed.get(InvestmentCommonService);
    investmentEngagementJourneyService = TestBed.get(InvestmentEngagementJourneyService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.personalDeclarationForm.controls['radioEmploye'].setValue(false);
  });
  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('PERSONAL_DECLARATION.TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('PERSONAL_DECLARATION.TITLE');
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    const getSourceListSpy = spyOn(component, 'getSourceList');
    
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    // const getAllDropDownListSpy = spyOn(component, 'getAllDropDownList');
    // expect(getAllDropDownListSpy).toHaveBeenCalledWith({});
    let errors = {};
    let radioEmploye = component.personalDeclarationForm.controls['radioEmploye'];
    expect(radioEmploye.valid).toBeFalsy();
    radioEmploye.setValue(false);
   

    let radioPEP = component.personalDeclarationForm.controls['radioPEP'];
    expect(radioPEP.valid).toBeFalsy();
    errors = radioPEP.errors || {};
    expect(errors['required']).toBeTruthy();
    radioPEP.setValue(false);

    let sourceOfIncome = component.personalDeclarationForm.controls['sourceOfIncome'];
    expect(sourceOfIncome.valid).toBeFalsy();
    errors = sourceOfIncome.errors || {};
    expect(errors['required']).toBeTruthy();
    sourceOfIncome.setValue(false);

    let radioBeneficial = component.personalDeclarationForm.controls['radioBeneficial'];
    expect(radioBeneficial.valid).toBeFalsy();
    errors = radioBeneficial.errors || {};
    expect(errors['required']).toBeTruthy();
    radioBeneficial.setValue(false);
   
  });
 
  it('should navigate to Funding method Step1 if investment portfolio,', () => {
    spyOn(router, 'navigate');
    component.goToNext(component.personalDeclarationForm);
   //expect(router.navigate).toHaveBeenCalledWith['../investment/account/tax-info'];
  });

});
