import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ModelWithButtonComponent } from './../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ErrorModalComponent } from './../../shared/modal/error-modal/error-modal.component';
import { PaymentModalComponent } from './../payment-modal/payment-modal.component';
import { PaymentService } from './../payment.service';
import { CheckoutComponent } from './checkout.component';

class MockPaymentService {
  getRequestSignature(reqData): Observable<any> {
    return of({});
  }
}

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let modalService: NgbModal;
  let mockPaymentService: MockPaymentService;

  let modalOpenSpy: jasmine.Spy;
  const modalRefSpyObj = jasmine.createSpyObj({ close: null });
  modalRefSpyObj.componentInstance = { imgType: '' };
  modalRefSpyObj.result = Promise.resolve('');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        NgbModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    modalService = TestBed.get(NgbModal);
    modalOpenSpy = spyOn(TestBed.get(NgbModal), 'open').and.returnValue(modalRefSpyObj);
    mockPaymentService = new MockPaymentService();
  });

  it('should create CheckoutComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title, comprehensive navbar, build form onInit', () => {
    const setPageTitleSpy = spyOn(component, 'setNavbarServices');
    const buildFormSpy = spyOn(component, 'buildForm');
    component.ngOnInit();
    expect(setPageTitleSpy).toHaveBeenCalledWith(component.pageTitle);
    expect(buildFormSpy).toHaveBeenCalled();
  });

  it('should call navbar service', () => {
    const navbarPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    const navbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const navbarComprehensiveSpy = spyOn(navbarService, 'setNavbarComprehensive');
    component.setNavbarServices(component.pageTitle);
    expect(navbarPageTitleSpy).toHaveBeenCalledWith('CHECKOUT.CHECKOUT_PAYMENT');
    expect(navbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(navbarComprehensiveSpy).toHaveBeenCalledWith(true);
  });

  it('should open modal', () => {
    component.openModal();
    expect(modalOpenSpy).toHaveBeenCalledWith(PaymentModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'payment-modal'
    });
  });

  it('should close modal', () => {
    component.modalRef = modalService.open(PaymentModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'payment-modal'
    });
    component.closeModal();
    expect(component.modalRef.close).toHaveBeenCalled();
  });

  it('should open tnc modal', () => {
    const e = jasmine.createSpyObj('e', ['preventDefault', 'stopPropagation']);
    component.openTNC(e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(e.stopPropagation).toHaveBeenCalled();
    expect(modalOpenSpy).toHaveBeenCalledWith(ModelWithButtonComponent, {
      centered: true,
      windowClass: 'payment-tnc'
    });
    expect(modalRefSpyObj.componentInstance.imgType).toBeUndefined();
    expect(modalRefSpyObj.componentInstance.errorMessageHTML).toEqual('CHECKOUT.TNC');
    expect(modalRefSpyObj.componentInstance.primaryActionLabel).toEqual('CHECKOUT.CONTINUE');
    expect(modalRefSpyObj.componentInstance.isInlineButton).toBeFalsy();
  });

  it('should show error modal', () => {
    const closeModalSpy = spyOn(component, 'closeModal');
    const submitFormSpy = spyOn(component, 'submitForm');
    component.errorRedirecting();
    expect(closeModalSpy).toHaveBeenCalled();
    expect(modalOpenSpy).toHaveBeenCalledWith(ErrorModalComponent, {
      centered: true,
      windowClass: 'hide-manual-btn'
    });
    expect(modalRefSpyObj.componentInstance.errorTitle).toEqual('CHECKOUT.REDIRECT_ERROR_TITLE');
    expect(modalRefSpyObj.componentInstance.errorMessage).toEqual('CHECKOUT.REDIRECT_ERROR_MSG');
    expect(modalRefSpyObj.componentInstance.isError).toBeTruthy();
    modalRefSpyObj.result.then(() => {
      expect(submitFormSpy).toHaveBeenCalled();
    });
  });

});
