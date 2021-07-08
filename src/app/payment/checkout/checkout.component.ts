import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from './../../../environments/environment';
import { ComprehensiveApiService } from './../../comprehensive/comprehensive-api.service';
import { COMPREHENSIVE_CONST } from './../../comprehensive/comprehensive-config.constants';
import { ComprehensiveService } from './../../comprehensive/comprehensive.service';
import { ErrorModalComponent } from './../../shared/modal/error-modal/error-modal.component';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ModelWithButtonComponent } from './../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SignUpService } from './../../sign-up/sign-up.service';
import { PaymentModalComponent } from './../payment-modal/payment-modal.component';
import { PAYMENT_CONST, PAYMENT_REQUEST } from './../payment.constants';
import { PaymentService } from './../payment.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../../comprehensive/comprehensive-routes.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { PAYMENT_ROUTE_PATHS } from '../payment-routes.constants';
import { PromoCodeService } from './../../promo-code/promo-code.service';
import { PromoCodeModalComponent } from './../../promo-code/promo-code-modal/promo-code-modal.component';

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
  showFixedToastMessage: boolean;

  subTotal = PAYMENT_CONST.SUBTOTAL;
  gst = PAYMENT_CONST.GST;
  totalAmt = (PAYMENT_CONST.TOTAL_AMT).toString();
  promoCode = PAYMENT_CONST.PROMO_CODE;
  includingGst = false;

  loading: string;
  gstPercentLabel: any;
  totalAmount: number;
  paymentAmount: number;
  reductionAmount: number;
  gstPercent: number;
  cfpPromoCode: string;
  promoCodeDescription: string;
  appliedPromoCode: string;
  isWaivedPromo: boolean;
  usedPromo: {};

  constructor(
    private formBuilder: FormBuilder,
    public readonly translate: TranslateService,
    private router: Router,
    private modal: NgbModal,
    public navbarService: NavbarService,
    private paymentService: PaymentService,
    private comprehensiveService: ComprehensiveService,
    private signUpService: SignUpService,
    private comprehensiveApiService: ComprehensiveApiService,
    private loaderService: LoaderService,
    public footerService: FooterService,
    public promoCodeService: PromoCodeService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CHECKOUT.CHECKOUT_PAYMENT');
      this.loading = this.translate.instant('COMMON_LOADER.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.fetchDashboard();
  }


  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }

  ngAfterViewInit() {
    this.loaderService.showLoader({ title: this.loading, autoHide: false });
    this.promoCodeService.tostMessage.subscribe((showTostMessage) => {
      if (showTostMessage) {
        this.promoCodeService.getCpfPromoCodeObservable.subscribe((promoCode) => {
          this.getCheckoutDetails(promoCode);
          this.showCopyToast();
        });
      }
    });
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
    this.navbarService.setPaymentLockIcon(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
    this.navbarService.setPaymentLockIcon(true);
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
      attempt_three_d: [''],
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
    this.checkoutForm.get('attempt_three_d').setValue(PAYMENT_REQUEST.attempt3D);
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
    const xhr = new XMLHttpRequest();
    xhr.open('POST', PAYMENT_REQUEST.requestURL);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
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

  getProductAmount() {
    const payload = { productType: COMPREHENSIVE_CONST.VERSION_TYPE.FULL };
    this.comprehensiveApiService.getProductAmount(payload).subscribe((data: any) => {
      if (data && data.objectList[0]) {
        this.includingGst = data.objectList[0]['includingGst'];
        this.subTotal = this.includingGst ? data.objectList[0]['totalAmount'] : data.objectList[0]['price'];
        this.gst = data.objectList[0]['gstPercentage'];
        this.totalAmt = data.objectList[0]['totalAmount'].toString();
      }
    });
  }

  getCheckoutDetails(promoCode) {  
    const payload = { comprehensivePromoCodeToken: promoCode, promoCodeCat: COMPREHENSIVE_CONST.PROMO_CODE.TYPE };
    this.paymentService.getPaymentCheckoutCfpDetails(payload).subscribe((data: any) => {
      this.loaderService.hideLoaderForced();
      if (data && data.objectList) {
        const checkOutData = data.objectList;
        this.gstPercentLabel = { gstPercent: checkOutData.pricingDetails.gstPercentage};
        this.totalAmount = checkOutData.pricingDetails.totalAmount;
        this.paymentAmount = checkOutData.pricingDetails.payableAmount;
        this.reductionAmount = checkOutData.pricingDetails.discountAmount;
        this.gstPercent = checkOutData.pricingDetails.gstPercentage;
        this.cfpPromoCode = checkOutData.promoCode;
        this.promoCodeDescription = checkOutData.discountMessage;
        this.appliedPromoCode = checkOutData.shortDescription;
        this.isWaivedPromo = this.isWaivedPromo;
      }
    }, (err) => {
      this.loaderService.hideLoaderForced();
    });
  }

  fetchDashboard() {
    this.loaderService.showLoader({ title: this.loading, autoHide: false });
    this.comprehensiveApiService.getComprehensiveSummary(COMPREHENSIVE_CONST.VERSION_TYPE.FULL).subscribe((summaryData: any) => {
      if (summaryData && summaryData.objectList[0]) {
        this.comprehensiveService.setComprehensiveSummary(summaryData.objectList[0]);
        const reportStatus = this.comprehensiveService.getReportStatus();
        this.loaderService.hideLoaderForced();
        if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
          this.backToDashboard();
        } else if (!this.comprehensiveService.checkResultData()) {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT]);
        } else if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
          this.getCheckoutDetails(this.comprehensiveService.getCfpPromoCode());
        } else {
          this.backToDashboard();
        }
      } else {
        this.loaderService.hideLoaderForced();
        this.backToDashboard();
      }
    });
  }

  backToDashboard() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  goToNext() {
    const reportStatus = this.comprehensiveService.getReportStatus();
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
    } else if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW && this.comprehensiveService.checkResultData()) {
      const currentStep = this.comprehensiveService.getMySteps();
      if (currentStep === 4) {
        this.loaderService.showLoader({ title: this.loading, autoHide: false });
        this.initiateReport();
      } else {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + currentStep]);
      }
    } else {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT]);
    }
  }

  initiateReport() {
    const enquiryId = { enquiryId: this.comprehensiveService.getEnquiryId(), promoCode: this.promoCode, waivedPromo: this.isWaivedPromo };
    const cashPayload = {
      enquiryId: this.comprehensiveService.getEnquiryId(), liquidCashAmount: this.comprehensiveService.getLiquidCash(),
      spareCashAmount: this.comprehensiveService.getComputeSpareCash()
    };
    this.comprehensiveApiService.generateComprehensiveCashflow(cashPayload).subscribe((cashData) => {
    });
    this.comprehensiveApiService.generateComprehensiveReport(enquiryId).subscribe((data) => {
      const reportStatus = COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED;
      const viewMode = true;
      this.comprehensiveService.setReportStatus(reportStatus);
      this.comprehensiveService.setLocked(true);
      this.comprehensiveService.setViewableMode(viewMode);
      this.loaderService.hideLoaderForced();
      if (this.isWaivedPromo) {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
      } else {
        this.goToPaymentInstructions();
      }
    }, (err) => {
      this.loaderService.hideLoaderForced();
    });
  }

  removeAppliedPromoCode() {
    this.paymentAmount = this.totalAmount;
    this.reductionAmount = 0;
    this.cfpPromoCode = '';
    this.promoCodeDescription = '';
    this.appliedPromoCode = '';
    this.isWaivedPromo = false;
  }

  goToPaymentInstructions() {
    this.router.navigate([PAYMENT_ROUTE_PATHS.PAYMENT_INSTRUCTION]);
  }

  showCopyToast() {
    this.showFixedToastMessage = true;
    this.hideToastMessage();
  }

  hideToastMessage() {
    setTimeout(() => {
      this.showFixedToastMessage = false;
    }, 3000);
  }

  goToPromoCode(e) {  
    this.modal.open(PromoCodeModalComponent, { centered: true });   
      e.preventDefault();
      e.stopPropagation();    
  }
}
