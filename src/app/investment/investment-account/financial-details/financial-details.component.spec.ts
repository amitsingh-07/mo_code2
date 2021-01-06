import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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


import { FinancialDetailsComponent } from './financial-details.component';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';

describe('FinancialDetailsComponent', () => {
  let component: FinancialDetailsComponent;
  let fixture: ComponentFixture<FinancialDetailsComponent>;
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
  let investmentEngagementJourneyService :InvestmentEngagementJourneyService;

  let translations = require('../../../../assets/i18n/investment-account/en.json');

  beforeEach(async(() => {  
  TestBed.configureTestingModule({
    declarations: [FinancialDetailsComponent],
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
    fixture = TestBed.createComponent(FinancialDetailsComponent);
    component = fixture.componentInstance;      
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
    investmentEngagementJourneyService = TestBed.get(InvestmentEngagementJourneyService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('FINANCIAL_DETAILS.TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('FINANCIAL_DETAILS.TITLE');
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
 // spyOn(investmentEngagementJourneyService, 'getPortfolioFormData').and.returnValue({});
   // spyOn(investAccountService, 'getInvestmentAccountFormData').and.returnValue({});
    const loadDDCRoadmapSpy = spyOn(investAccountService, 'loadDDCRoadmap');
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
   // expect(loadDDCRoadmapSpy).toHaveBeenCalled();

    let errors = {};
    let annualHouseHoldIncomeRange = component.financialDetails.controls['annualHouseHoldIncomeRange'];
    expect(annualHouseHoldIncomeRange.valid).toBeFalsy();
    errors = annualHouseHoldIncomeRange.errors || {};
    expect(errors['required']).toBeTruthy();
    annualHouseHoldIncomeRange.setValue(6);
   

    let numberOfHouseHoldMembers = component.financialDetails.controls['numberOfHouseHoldMembers'];
    expect(numberOfHouseHoldMembers.valid).toBeFalsy();
    errors = numberOfHouseHoldMembers.errors || {};
    expect(errors['required']).toBeTruthy();
    numberOfHouseHoldMembers.setValue(3);
   
  });
 

  it('should navigate to Funding method Step1 if investment portfolio,', () => {
    spyOn(router, 'navigate');
    component.goToNext(component.financialDetails);
   expect(router.navigate).toHaveBeenCalledWith['../investment/account/tax-info'];
  });
  
});
