import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ComprehensiveApiService } from 'src/app/comprehensive/comprehensive-api.service';
import { COMPREHENSIVE_CONST } from 'src/app/comprehensive/comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from 'src/app/comprehensive/comprehensive-routes.constants';
import { ComprehensiveService } from 'src/app/comprehensive/comprehensive.service';
import { SignUpService } from 'src/app/sign-up/sign-up.service';
import { PaymentService } from '../payment.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';
import { PAYMENT_ROUTE_PATHS } from './../payment-routes.constants';
import { PAYMENT_STATUS } from './../payment.constants';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentStatusComponent implements OnInit, OnDestroy {

  public statusTitle: string;
  public statusText: string;
  public btnText: string;
  public navigateText: string;

  public paymentStatus: string;
  public userEmail: any;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public navbarService: NavbarService,
    private route: ActivatedRoute,
    public signUpService: SignUpService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private paymentService: PaymentService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.navbarService.setNavbarMobileVisibility(false);
    document.body.classList.add('bg-color');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.route.queryParams.subscribe((params) => {
        this.setStatusText(params);
      });
    });
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-color');
  }

  // Set the various text for btn, status title and tex based on success or failed transaction
  setStatusText(params) {
    if (params['transaction_state'].toLowerCase() === PAYMENT_STATUS.SUCCESS) {
      this.getUserEmail();
      this.statusTitle = this.translate.instant('PAYMENT_STATUS.SUCCESS_TITLE');
      this.statusText = this.translate.instant('PAYMENT_STATUS.SUCCESS_TEXT') + '<span>' + this.userEmail + '</span>';
      this.btnText = this.translate.instant('PAYMENT_STATUS.CONTINUE');
      this.navigateText = undefined;
      this.paymentStatus = PAYMENT_STATUS.SUCCESS;
      this.initiateReport();
    } else {
      this.statusTitle = this.translate.instant('PAYMENT_STATUS.FAIL_TITLE');
      this.statusText = this.translate.instant('PAYMENT_STATUS.FAIL_TEXT');
      this.btnText = this.translate.instant('PAYMENT_STATUS.TRY_AGAIN');
      this.navigateText = this.translate.instant('PAYMENT_STATUS.BACK_DASHBOARD');
      this.paymentStatus = PAYMENT_STATUS.FAILED;
      if (params['transaction_state'].toLowerCase() === PAYMENT_STATUS.CANCEL) {
        // Call cancel payment
        const reqId = this.paymentService.getRequestId();
        this.paymentService.cancelPayment(reqId).subscribe((res) => {});
      }
    }
  }

  // On press of CTA btn go to dashboard if success else back to checkout page if failed
  onPressBtn() {
    if (this.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
    } else {
      this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);
    }
  }

  // Show only when failed transaction, on press of navigate text go to dashboard
  onPressNavigateText() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  // Get user email for success transaction text display
  getUserEmail() {
    if (this.signUpService.getUserProfileInfo()) {
      this.userEmail = this.signUpService.getUserProfileInfo()['emailAddress'];
    }
  }

  // Initiate report generation when payment success
  initiateReport() {
    const reportData = { enquiryId: this.comprehensiveService.getEnquiryId() };
    this.comprehensiveApiService.generateComprehensiveReport(reportData).subscribe((data) => {
      this.comprehensiveService.setReportStatus(COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED);
      this.comprehensiveService.setLocked(true);
      this.comprehensiveService.setViewableMode(true);
      const payload = { enquiryId: this.comprehensiveService.getEnquiryId() };
      this.comprehensiveApiService.createReportRequest(payload).subscribe((reportDataStatus: any) => {
        this.comprehensiveService.setReportId(reportDataStatus.reportId);
      });
    });
  }
}
