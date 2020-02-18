import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ComprehensiveService } from 'src/app/comprehensive/comprehensive.service';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../../comprehensive/comprehensive-api.service';
import { SignUpService } from './../../sign-up/sign-up.service';
import { PaymentStatusComponent } from './payment-status.component';

// tslint:disable: max-classes-per-file
class ActivatedRouteMock {
  queryParams = new Observable((observer) => {
    observer.next({
      state: 'success'
    });
    observer.complete();
  });
}

class MockSignUpService {
  getUserProfileInfo() {
    return { emailAddress: 'test@email.com' };
  }
}

class MockComprehensiveApiService {
  generateComprehensiveReport(reportData): Observable<any> {
    return of({});
  }
}

class MockComprehensiveService {
  getEnquiryId() { return '123'; }

  setReportStatus(reportStatus) {}

  setLocked(lock: boolean) {}

  setViewableMode(commitFlag: boolean) {}

  setReportId(reportId: number) {}
}

describe('PaymentStatusComponent', () => {
  let component: PaymentStatusComponent;
  let fixture: ComponentFixture<PaymentStatusComponent>;
  let navbarService: NavbarService;
  let comprehensiveService: ComprehensiveService;
  let comprehensiveApiService: ComprehensiveApiService;
  let routerNavigateSpy: jasmine.Spy;
  let signUpService: SignUpService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentStatusComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ActivatedRoute,  useClass: ActivatedRouteMock },
        { provide: ComprehensiveService, useClass: MockComprehensiveService },
        { provide: ComprehensiveApiService, useClass: MockComprehensiveApiService },
        { provide: SignUpService, useClass: MockSignUpService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    navbarService = TestBed.get(NavbarService);
    routerNavigateSpy = spyOn(TestBed.get(Router), 'navigate');
    comprehensiveService = TestBed.get(ComprehensiveService);
    comprehensiveApiService = TestBed.get(ComprehensiveApiService);
    signUpService = TestBed.get(SignUpService);
  });

  it('should create PaymentStatusComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnInit', () => {
    const navbarComprehensiveSpy = spyOn(navbarService, 'setNavbarComprehensive');
    const navbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setStatusTextSpy = spyOn(component, 'setStatusText');
    component.ngOnInit();
    expect(navbarComprehensiveSpy).toHaveBeenCalledWith(true);
    expect(navbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(document.body.classList).toContain('bg-color');
    const param = { state: 'success' };
    expect(setStatusTextSpy).toHaveBeenCalledWith(param);
  });

  it('should remove class onDestroy', () => {
    component.ngOnDestroy();
    expect(document.body.classList).not.toContain('bg-color');
  });

  it('should set the title, btn, navigate text based on state', () => {
    const getUserEmailSpy = spyOn(component, 'getUserEmail');
    const initiateReportSpy = spyOn(component, 'initiateReport');
    const emailTxt = '<span>undefined</span>';

    let mockParam = { transaction_state: 'success' };
    component.setStatusText(mockParam);
    expect(getUserEmailSpy).toHaveBeenCalled();
    expect(component.statusTitle).toEqual('PAYMENT_STATUS.SUCCESS_TITLE');
    expect(component.statusText).toEqual('PAYMENT_STATUS.SUCCESS_TEXT' + emailTxt);
    expect(component.btnText).toEqual('PAYMENT_STATUS.CONTINUE');
    expect(component.navigateText).toBeUndefined();
    expect(component.paymentStatus).toEqual('success');
    expect(initiateReportSpy).toHaveBeenCalled();

    mockParam = { transaction_state: 'fail' };
    component.setStatusText(mockParam);
    expect(component.statusTitle).toEqual('PAYMENT_STATUS.FAIL_TITLE');
    expect(component.statusText).toEqual('PAYMENT_STATUS.FAIL_TEXT');
    expect(component.btnText).toEqual('PAYMENT_STATUS.TRY_AGAIN');
    expect(component.navigateText).toEqual('PAYMENT_STATUS.BACK_DASHBOARD');
    expect(component.paymentStatus).toEqual('failed');
  });

  it('should navigate press of onPressBtn', () => {
    // if paymentStatus === 'success'
    component.paymentStatus = 'success';
    component.onPressBtn();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../comprehensive/result']);
    // if paymentStatus !== 'success'
    component.paymentStatus = 'fail';
    component.onPressBtn();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../payment/checkout']);
  });

  it('should navigate press of onPressNavigateText', () => {
    component.onPressNavigateText();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../accounts/dashboard']);
  });

  it('should get user email for display', () => {
    component.getUserEmail();
    spyOn(signUpService, 'getUserProfileInfo').and.returnValue({ emailAddress: 'test@email.com' });
    expect(component.userEmail).toEqual('test@email.com');
  });

  it('should initiateReport', () => {
    const setReportStatusSpy = spyOn(comprehensiveService, 'setReportStatus');
    const setLockedSpy = spyOn(comprehensiveService, 'setLocked');
    const setViewableModeSpy = spyOn(comprehensiveService, 'setViewableMode');
    const setReportIdSpy = spyOn(comprehensiveService, 'setReportId');

    component.initiateReport();
    spyOn(comprehensiveApiService, 'generateComprehensiveReport').and.returnValue({ subscribe: () => { } });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(setReportStatusSpy).toHaveBeenCalledWith('submitted');
      expect(setLockedSpy).toHaveBeenCalledWith(true);
      expect(setViewableModeSpy).toHaveBeenCalledWith(true);
    });
  });
});
