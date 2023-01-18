
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { MockInvestmentAccountService } from './../../../../assets/mocks/service/shared-service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from './../investment-account-service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { DatePipe } from '@angular/common';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { Injector } from '@angular/core';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';


import { FinancialDetailsComponent } from './financial-details.component';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';

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
  let investmentEngagementJourneyService: InvestmentEngagementJourneyService;

  let translations = require('../../../../assets/i18n/investment-account/en.json');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialDetailsComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal, AuthenticationService, DatePipe, TranslateService,
        InvestmentAccountService,
        LoaderService,
        {
          provide: InvestmentAccountService
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
    const loadDDCRoadmapSpy = spyOn(investAccountService, 'loadDDCRoadmap');
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);

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
