import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { sha256 } from 'js-sha256';
import { ModelWithButtonComponent } from './../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { PaymentModalComponent } from './../payment-modal/payment-modal.component';
import { PaymentRequest } from './../payment-request';
import { PAYMENT_CONST } from './../payment.constants';

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
  totalAmt = this.subTotal + (this.subTotal * PAYMENT_CONST.GST / 100);
  promoCode = PAYMENT_CONST.PROMO_CODE;

  constructor(
    private formBuilder: FormBuilder,
    public readonly translate: TranslateService,
    private modal: NgbModal,
    public datePipe: DatePipe,
    public navbarService: NavbarService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CHECKOUT.CHECKOUT_PAYMENT');
      this.setPageTitle(this.pageTitle);
    });
    this.navbarService.setNavbarComprehensive(true);
    this.buildForm();
  }

  ngOnDestroy() {
  }

  private buildForm() {
    const timeStamp = this.datePipe.transform(new Date(), PaymentRequest.timestampFormat, PaymentRequest.timezone);
    const preShaStr = timeStamp + (PaymentRequest.requestId + timeStamp) + PaymentRequest.merchantAccId
      + PaymentRequest.transactionType + this.subTotal + PaymentRequest.currency + PaymentRequest.redirectURL
      + PaymentRequest.ipAddress + PaymentRequest.secretKey;
    const reqSignature = sha256(preShaStr);
    this.checkoutForm = this.formBuilder.group({
      request_id: [PaymentRequest.requestId + timeStamp],
      request_time_stamp: [timeStamp],
      request_signature: [reqSignature],
      merchant_account_id: [PaymentRequest.merchantAccId],
      transaction_type: [PaymentRequest.transactionType],
      requested_amount: [this.subTotal],
      requested_amount_currency: [PaymentRequest.currency],
      ip_address: [PaymentRequest.ipAddress],
      redirect_url: [PaymentRequest.redirectURL],
      termsOfConditions: [this.termsOfConditions, Validators.required]
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
    this.navbarService.setNavbarMobileVisibility(true);
  }

  submitForm() {
    this.buildForm();
    document.forms['checkoutForm'].action = PaymentRequest.requestURL;
    // INSERT SERVICE TO CALL BACKEND CODE BEFORE SUBMIT
    this.windowRef = window.open('', 'wirecardWindow');
    document.forms['checkoutForm'].submit();
    // this.openModal();

    const pollTimer = window.setInterval(() => {
      // If user closes pop up window, close the modal and show the page again
      if (this.windowRef.closed !== false) { // !== is required for compatibility with Opera
        window.clearInterval(pollTimer);
        console.log('INSIDE CLOSING!!!!!!!!')
        this.closeModal();
      }
    }, 100);

    window.success = (values) => {
      console.log('INSIDE SUCCESS!!!!!!!!')
      clearInterval(pollTimer);
      // Route to status page with success
      this.windowRef.close();
      window.success = () => null;
    };

    window.failed = (values) => {
      console.log('INSIDE FAILURE!!!!!!!!')
      clearInterval(pollTimer);
      // Route to status page with failed
      this.windowRef.close();
      window.failed = () => null;
    };
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
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'payment-tnc' });
    ref.componentInstance.imgType = undefined;
    ref.componentInstance.errorMessageHTML = this.translate.instant('CHECKOUT.TNC');
    ref.componentInstance.primaryActionLabel = this.translate.instant('CHECKOUT.CONTINUE');
    ref.componentInstance.isInlineButton = false;
  }

}
