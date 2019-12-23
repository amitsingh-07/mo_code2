import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { PaymentStatusComponent } from './payment-status.component';

class ActivatedRouteMock {
  queryParams = new Observable((observer) => {
    const urlParams = {
      state: 'success'
    };
    observer.next(urlParams);
    observer.complete();
  });
}

describe('PaymentStatusComponent', () => {
  let component: PaymentStatusComponent;
  let fixture: ComponentFixture<PaymentStatusComponent>;
  let navbarService: NavbarService;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentStatusComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [{
        provide: ActivatedRoute,
        useClass: ActivatedRouteMock
      }],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    navbarService = TestBed.get(NavbarService);
    routerNavigateSpy = spyOn(TestBed.get(Router), 'navigate');
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
    let mockParam = { state: 'success' };
    component.setStatusText(mockParam);
    expect(component.statusTitle).toEqual('PAYMENT_STATUS.SUCCESS_TITLE');
    expect(component.statusText).toEqual('PAYMENT_STATUS.SUCCESS_TEXT');
    expect(component.btnText).toEqual('PAYMENT_STATUS.CONTINUE');
    expect(component.navigateText).toBeUndefined();
    expect(component.paymentStatus).toEqual('success');
    mockParam = { state: 'fail' };
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
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../accounts/dashboard']);
    // if paymentStatus !== 'success'
    component.paymentStatus = 'fail';
    component.onPressBtn();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/payment']);
  });

  it('should navigate press of onPressNavigateText', () => {
    // if paymentStatus === 'success'
    component.paymentStatus = 'success';
    component.onPressNavigateText();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['home']);
    // if paymentStatus !== 'success'
    component.paymentStatus = 'fail';
    component.onPressNavigateText();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['../accounts/dashboard']);
  });
});
