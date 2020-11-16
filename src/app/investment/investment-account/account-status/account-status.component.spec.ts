import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterService } from './../../../shared/footer/footer.service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { InvestmentCommonService } from './../../investment-common/investment-common.service';
import { InvestmentAccountService } from './../investment-account-service';
import { AccountStatusComponent } from './account-status.component';

describe('AccountStatusComponent', () => {
  let component: AccountStatusComponent;
  let fixture: ComponentFixture<AccountStatusComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let investAccountService: InvestmentAccountService;
  let investCommonService: InvestmentCommonService;
  let getAccountCreationStatusSpy: any;
  let getConfirmedFundingMethodNameSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule, HttpClientTestingModule,
         JwtModule.forRoot({config: {}})],
      declarations: [AccountStatusComponent],
      providers: [NgbActiveModal, JwtHelperService, InvestmentAccountService, InvestmentCommonService]
    })
      .compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountStatusComponent);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    investAccountService = TestBed.get(InvestmentAccountService);
    investCommonService = TestBed.get(InvestmentCommonService);

    getAccountCreationStatusSpy = spyOn(investAccountService, 'getAccountCreationStatus');
    getConfirmedFundingMethodNameSpy = spyOn(investCommonService, 'getConfirmedFundingMethodName');

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create AccountStatusComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should execute ngOnInit: Account status = confirmed, Funding type = cash', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    getAccountCreationStatusSpy.and.returnValue('confirmed');
    getConfirmedFundingMethodNameSpy.and.returnValue('cash');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    expect(component.status).toEqual('confirmed');
    expect(component.showCashAccountSuccess).toBe(true);
    expect(component.pageTitle).toBe('ACCOUNT_CREATION_STATUS.CASH_ACCOUNT_SUCCESS.TITLE');
    expect(component.pageDesc).toBe('ACCOUNT_CREATION_STATUS.CASH_ACCOUNT_SUCCESS.DESC');
  });

  it('should execute ngOnInit: Account status = confirmed, Funding type = srs', () => {
    getAccountCreationStatusSpy.and.returnValue('confirmed');
    getConfirmedFundingMethodNameSpy.and.returnValue('srs');
    component.ngOnInit();
    expect(component.status).toEqual('confirmed');
    expect(component.showSrsAccountSuccess).toBe(true);
    expect(component.pageTitle).toBe('ACCOUNT_CREATION_STATUS.SRS_ACCOUNT_SUCCESS.TITLE');
    expect(component.pageDesc).toBe('ACCOUNT_CREATION_STATUS.SRS_ACCOUNT_SUCCESS.DESC');
  });

  it('should execute ngOnInit: Account status = account_creation_pending', () => {
    getAccountCreationStatusSpy.and.returnValue('account_creation_pending');
    component.ngOnInit();
    expect(component.status).toEqual('account_creation_pending');
    expect(component.showAccountCreationPending).toBe(true);
    expect(component.pageTitle).toBe('ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.TITLE');
    expect(component.pageDesc).toBe('ACCOUNT_CREATION_STATUS.ACCOUNT_CREATION_PENDING.DESC');
  });

  it('should execute ngOnInit: Account status = documents_pending', () => {
    getAccountCreationStatusSpy.and.returnValue('documents_pending');
    component.ngOnInit();
    expect(component.status).toEqual('documents_pending');
    expect(component.showDocumentsPending).toBe(true);
    expect(component.pageTitle).toBe('ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.TITLE');
    expect(component.pageDesc).toBe('ACCOUNT_CREATION_STATUS.DOCUMENTS_PENDING.DESC');
  });

  // tslint:disable-next-line: no-identical-functions
  it('should execute ngOnInit: Account status = others statuses', () => {
    getAccountCreationStatusSpy.and.returnValue('others');
    component.ngOnInit();
    expect(component.status).toEqual('others');
    expect(component.showAccountCreationPending).toBe(true);
    expect(component.pageTitle).toBe('ACCOUNT_CREATION_STATUS.ADDITIONAL_DECLARATION_SUBMITTED.TITLE');
    expect(component.pageDesc).toBe('ACCOUNT_CREATION_STATUS.ADDITIONAL_DECLARATION_SUBMITTED.DESC');
  });

  it('should redirect to Dashboard', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.redirectToDashboard();
    expect(navigateSpy).toHaveBeenCalledWith(['../accounts/dashboard']);
  });

  it('should redirect to Fund Intro Page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.redirectToFundAccount();
    expect(navigateSpy).toHaveBeenCalledWith(['../investment/fund-intro']);
  });

  it('should redirect to Investment Overview Page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.redirectToYourInvestment();
    expect(navigateSpy).toHaveBeenCalledWith(['../investment/manage/overview']);
  });
});
