import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ConfigService } from '../../config/config.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { PAYMENT_ROUTE_PATHS } from './../../payment/payment-routes.constants';
import { PaymentService } from './../../payment/payment.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-comprehensive-review',
  templateUrl: './comprehensive-review.component.html',
  styleUrls: ['./comprehensive-review.component.scss']
})
export class ComprehensiveReviewComponent implements OnInit, OnDestroy {
  pageId: string;
  pageTitle: string;
  tandcForm: FormGroup;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  isPaymentEnabled = false;
  comprehensiveJourneyMode: boolean;
  requireToPay = false;
  loading: string;
  tandcEnableFlag: boolean;
  enableTc: boolean;

  constructor(
    private activatedRoute: ActivatedRoute, public navbarService: NavbarService,
    private translate: TranslateService,
    private configService: ConfigService, private router: Router,
    private progressService: ProgressTrackerService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService) {
    this.pageId = this.activatedRoute.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      // Payment enabled > Payment Bypass > Not Require to Pay
      // Payment enabled > Payment Not Bypass > Require to Pay
      if (config.paymentEnabled && !this.activatedRoute.snapshot.data['paymentBypass']) {
        this.paymentService.getLastSuccessfulSubmittedTs().subscribe((res) => {
          if (res['last_submit_ts'].length === 0) {
            this.requireToPay = true;
          }
        }, (error) => {
          this.requireToPay = false;
        });
      }
      this.isPaymentEnabled = config.paymentEnabled;
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.REVIEW.TITLE');
        this.loading = this.translate.instant('COMMON_LOADER.TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });
    this.comprehensiveJourneyMode = this.comprehensiveService.getComprehensiveVersion();
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.comprehensiveJourneyMode) {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN_SUMMARY + '/summary']);
        } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/4']);
        }

      }
    });
  }

  ngOnInit() {

    this.loaderService.hideLoaderForced();
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.progressService.setReadOnly(false);
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    const reportStatus = this.comprehensiveService.getReportStatus();
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
      this.initiateReport();
    } else if (!this.comprehensiveService.checkResultData()) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT]);
    }
    this.buildTcForm();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  goToReviewInput() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
  }
  goToNext() {
    const reportStatus = this.comprehensiveService.getReportStatus();
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
    } else if (this.comprehensiveService.checkResultData()) {
      const currentStep = this.comprehensiveService.getMySteps();
      if (currentStep === 4) {
        if (this.isPaymentEnabled && this.comprehensiveJourneyMode) {
          // If payment is enabled and user has not paid, go payment else initiate report gen
          this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]).then((result) => {
            if (result === false) {
              this.loaderService.showLoader({ title: this.loading, autoHide: false });
              this.initiateReport();
            }
          });
        } else {
          this.loaderService.showLoader({ title: this.loading, autoHide: false });
          this.initiateReport();
        }
      } else {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + currentStep]);
      }
    } else {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT]);
    }
  }
  initiateReport() {
    const enquiryId = { enquiryId: this.comprehensiveService.getEnquiryId() };
    if (this.comprehensiveJourneyMode) {
      const cashPayload = { enquiryId: this.comprehensiveService.getEnquiryId(), liquidCashAmount: this.comprehensiveService.getLiquidCash(),
        annualCashAmount : this.comprehensiveService.getComputeSpareCash() };
      this.comprehensiveApiService.generateComprehensiveCashflow(cashPayload).subscribe((cashData) => {
        });
    }
    this.comprehensiveApiService.generateComprehensiveReport(enquiryId).subscribe((data) => {
      let reportStatus = COMPREHENSIVE_CONST.REPORT_STATUS.READY;
      let viewMode = false;
      if (this.comprehensiveJourneyMode) {
        reportStatus = COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED;
        viewMode = true;
      }
      this.comprehensiveService.setReportStatus(reportStatus);
      this.comprehensiveService.setLocked(true);
      this.comprehensiveService.setViewableMode(viewMode);
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
      this.loaderService.hideLoaderForced();

    }, (err) => {
      this.loaderService.hideLoaderForced();
    });
  }

  @HostListener('input', ['$event'])
  reviewtandcCheck() {
    this.tandcForm.valueChanges.subscribe((form: any) => {
      this.enableTc = form.tandc;
    });
  }

  buildTcForm() {
    const reportStatus = this.comprehensiveService.getReportStatus();
    const comprehensiveData = this.comprehensiveService.getComprehensiveEnquiry();
    this.tandcEnableFlag = !(reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW || comprehensiveData.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PARTIAL_PENDING || comprehensiveData.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PENDING);
    this.enableTc = !(reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW  || comprehensiveData.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PARTIAL_PENDING || comprehensiveData.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PENDING);
    this.tandcForm = this.formBuilder.group({
      tandc: [this.enableTc]
    });
  }
}
