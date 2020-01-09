import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from './../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { PaymentModalComponent } from './../payment-modal/payment-modal.component';
import { PAYMENT_CONST } from './../payment.constants';
import { PaymentService } from './../payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit, OnDestroy {

  windowRef: Window;
  pageTitle: string;
  formValues: any;
  checkoutForm: FormGroup;
  termsOfConditions = false;
  modalRef: NgbModalRef;

  subTotal = PAYMENT_CONST.SUBTOTAL;
  gst = PAYMENT_CONST.GST;
  totalAmt = (this.subTotal + (this.subTotal * PAYMENT_CONST.GST / 100)).toString();
  promoCode = PAYMENT_CONST.PROMO_CODE;

  constructor(
    private formBuilder: FormBuilder,
    public readonly translate: TranslateService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public paymentService: PaymentService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CHECKOUT.CHECKOUT_PAYMENT');
      this.setNavbarServices(this.pageTitle);
    });
    this.buildForm();
  }

  ngOnDestroy() {
  }

  buildForm() {
    this.checkoutForm = this.formBuilder.group({
      request_id: [''],
      request_time_stamp: [''],
      request_signature: [''],
      merchant_account_id: [''],
      transaction_type: [''],
      requested_amount: [this.totalAmt],
      requested_amount_currency: [''],
      ip_address: [''],
      redirect_url: [''],
      termsOfConditions: [this.termsOfConditions, Validators.required]
    });
  }

  setNavbarServices(title: string) {
    this.navbarService.setPageTitle(title);
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarComprehensive(true);
  }

  submitForm() {
    this.openModal();
    document.forms['checkoutForm'].action = 'https://test.wirecard.com.sg/engine/hpp/';
    // Update this to add customer id
    this.paymentService.getRequestSignature(this.totalAmt).subscribe((res) => {
      this.updateFormValues(res);
    });
  }

  updateFormValues(res) {
    this.checkoutForm.get('request_id').setValue(res['requestId']);
    this.checkoutForm.get('request_time_stamp').setValue('' + res['requestTimestamp']);
    this.checkoutForm.get('request_signature').setValue(res['requestSignature']);
    this.checkoutForm.get('merchant_account_id').setValue('961c567b-d9da-41f6-9801-ba21cb228a00');
    this.checkoutForm.get('transaction_type').setValue('purchase');
    this.checkoutForm.get('requested_amount_currency').setValue('SGD');
    this.checkoutForm.get('ip_address').setValue('127.0.0.1');
    this.checkoutForm.get('redirect_url').setValue('https://bfa-dev.ntucbfa.cloud/payment/api/redirectPaymentStatus');
    document.forms['checkoutForm'].submit();
  }

  openModal() {
    this.modalRef = this.modal.open(PaymentModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'payment-modal'
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  openTNC(e) {
    e.preventDefault();
    e.stopPropagation();
    // Open TNC modal
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'payment-tnc' });
    ref.componentInstance.imgType = undefined;
    ref.componentInstance.errorMessageHTML = this.translate.instant('CHECKOUT.TNC');
    ref.componentInstance.primaryActionLabel = this.translate.instant('CHECKOUT.CONTINUE');
    ref.componentInstance.isInlineButton = false;
  }

  errorRedirecting() {
    // Open Error Modal
    const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'hide-manual-btn' });
    ref.componentInstance.errorTitle = this.translate.instant('CHECKOUT.REDIRECT_ERROR_TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('CHECKOUT.REDIRECT_ERROR_MSG');
    ref.componentInstance.isError = true;
    // On click Try Again, submit form again
    ref.result.then(() => {
      this.submitForm();
    }).catch((e) => {
    });
  }

}
