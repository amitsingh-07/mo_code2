import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { RouterTestingModule} from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { FooterService } from './../../../shared/footer/footer.service';
import { InvestmentAccountService } from './../investment-account-service';
import { AccountStatusComponent } from './account-status.component';

class MockInvestmentAccSrv {
  getAccountCreationStatus() {
    return 'ABC';
  }

  clearInvestmentAccountFormData() {}

  restrictBackNavigation() {}
}

describe('AccountStatusComponent', () => {
  let component: AccountStatusComponent;
  let fixture: ComponentFixture<AccountStatusComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let mockInvestmentAccSrv: MockInvestmentAccSrv;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule.forRoot(), HttpClientTestingModule, HttpModule,
         JwtModule.forRoot({config: {}})],
      declarations: [AccountStatusComponent],
      providers: [NgbActiveModal, JwtHelperService,
        { provide: InvestmentAccountService, useValue: mockInvestmentAccSrv }
      ]
    })
      .compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountStatusComponent);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    mockInvestmentAccSrv = new MockInvestmentAccSrv();

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AccountStatusComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    expect(component.status).toEqual('ABC');
    expect(component.showAccountCreationPending).toBe(true);
    expect(component.pageTitle).toBe('ACCOUNT_CREATION_STATUS.ADDITIONAL_DECLARATION_SUBMITTED.TITLE');
  });

  it('should redirect to Dashboard', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.redirectToDashboard();
    expect(navigateSpy).toHaveBeenCalledWith(['SIGN_UP_ROUTE_PATHS.DASHBOARD']);
  });
});
