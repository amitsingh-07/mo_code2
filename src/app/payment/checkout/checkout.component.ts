import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ComprehensiveService } from 'src/app/comprehensive/comprehensive.service';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { SignUpService } from 'src/app/sign-up/sign-up.service';
import { environment } from './../../../environments/environment';
import { ModelWithButtonComponent } from './../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { PaymentModalComponent } from './../payment-modal/payment-modal.component';
import { PAYMENT_CONST, PAYMENT_REQUEST } from './../payment.constants';
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
  nonProdEnv = false;

  subTotal = PAYMENT_CONST.SUBTOTAL;
  gst = PAYMENT_CONST.GST;
  totalAmt = (this.subTotal + (this.subTotal * PAYMENT_CONST.GST / 100)).toString();
  promoCode = PAYMENT_CONST.PROMO_CODE;

  constructor(
    private formBuilder: FormBuilder,
    public readonly translate: TranslateService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    private paymentService: PaymentService,
    private comprehensiveService: ComprehensiveService,
    private signUpService: SignUpService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CHECKOUT.CHECKOUT_PAYMENT');
      this.setNavbarServices(this.pageTitle);
    });
    this.buildForm();
    // Setting boolean to turn testing amt input
    this.nonProdEnv = environment.isDebugMode;
  }

  ngOnDestroy() {
  }

  // Create form
  buildForm() {
    this.checkoutForm = this.formBuilder.group({
      request_id: [''],
      request_time_stamp: [''],
      request_signature: [''],
      merchant_account_id: [''],
      transaction_type: [''],
      requested_amount: [this.totalAmt],
      requested_amount_currency: [''],
      redirect_url: [''],
      cancel_redirect_url: [''],
      termsOfConditions: [this.termsOfConditions, Validators.required]
    });
  }

  setNavbarServices(title: string) {
    this.navbarService.setPageTitle(title);
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarComprehensive(true);
  }

  // Call BE to get signature to submit form to wirecard
  submitForm() {
    this.openModal();
    // Update this to add customer id
    const enqId = this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry.enquiryId;
    const baseProfile = this.signUpService.getAccountInfo();
    this.paymentService.getRequestSignature(enqId, this.totalAmt, PAYMENT_CONST.SOURCE, baseProfile.userProfileInfo).subscribe((res) => {
      this.updateFormValues(res);
      this.paymentService.setRequestId(res['requestId']);
    }, (error) => {
      this.errorRedirecting();
    });
  }

  // Update form values
  private updateFormValues(res) {
    this.checkoutForm.get('request_id').setValue(res['requestId']);
    this.checkoutForm.get('request_time_stamp').setValue('' + res['requestTimestamp']);
    this.checkoutForm.get('request_signature').setValue(res['requestSignature']);
    this.checkoutForm.get('merchant_account_id').setValue(PAYMENT_REQUEST.merchantAccId);
    this.checkoutForm.get('transaction_type').setValue(PAYMENT_REQUEST.transactionType);
    this.checkoutForm.get('requested_amount_currency').setValue(PAYMENT_REQUEST.currency);
    this.checkoutForm.get('requested_amount').setValue(this.totalAmt);
    this.checkoutForm.get('redirect_url').setValue(environment.apiBaseUrl + PAYMENT_REQUEST.redirectURL);
    this.checkoutForm.get('cancel_redirect_url').setValue(environment.apiBaseUrl + PAYMENT_REQUEST.redirectCancelURL);
    document.forms['checkoutForm'].action = PAYMENT_REQUEST.requestURL;
    document.forms['checkoutForm'].submit();
    // const body = new URLSearchParams();
    // body.set('request_id', res['requestId']);
    // body.set('request_time_stamp', '' + res['requestTimestamp']);
    // body.set('request_signature', res['requestSignature']);
    // body.set('merchant_account_id', PAYMENT_REQUEST.merchantAccId);
    // body.set('transaction_type', PAYMENT_REQUEST.transactionType);
    // body.set('requested_amount', this.totalAmt);
    // body.set('requested_amount_currency', PAYMENT_REQUEST.currency);
    // body.set('redirect_url', environment.apiBaseUrl + PAYMENT_REQUEST.redirectURL);
    // body.set('cancel_redirect_url', environment.apiBaseUrl + PAYMENT_REQUEST.redirectCancelURL);
    // this.makeHttpRequest(body);
  }

  makeHttpRequest(body) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', PAYMENT_REQUEST.requestURL);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    xhr.onreadystatechange = () => {
    // Call a function when the state changes.
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          window.open(xhr.responseURL, '_self');
        } else {
          // Handle Error
          this.errorRedirecting();
        }
      }
    };
    xhr.send(body);
  }

  // Open payment modal
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

  // Open TNC modal
  openTNC(e) {
    e.preventDefault();
    e.stopPropagation();
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'payment-tnc' });
    ref.componentInstance.imgType = undefined;
    ref.componentInstance.errorMessageHTML = this.translate.instant('CHECKOUT.TNC');
    ref.componentInstance.primaryActionLabel = this.translate.instant('CHECKOUT.CONTINUE');
    ref.componentInstance.isInlineButton = false;
  }

  // Open Error Modal
  errorRedirecting() {
    this.closeModal();
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

  // For testing failed transaction scenario
  testingAmt(amt) {
    this.totalAmt = amt;
  }

}
