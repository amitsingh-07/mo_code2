import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { COMPREHENSIVE_ROUTES, COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { PAYMENT_ROUTE_PATHS } from './../../payment/payment-routes.constants';
import { Util } from '../../shared/utils/util';

@Component({
  selector: 'app-comprehensive-review',
  templateUrl: './comprehensive-review.component.html',
  styleUrls: ['./comprehensive-review.component.scss'],
})
export class ComprehensiveReviewComponent implements OnInit, OnDestroy {
  pageId: string;
  pageTitle: string;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  isPaymentEnabled = false;
  loading: string;
  requireToPay: boolean;
  sourceLocation: any;
  isCorporateUser: boolean;
  isFirstTimePublicUser: boolean;
  adviserPaymentStatus: any;
  skipProfileStatus: any;
  isFirstTimeCorporateUser = true;
  isSpeakToAdvisor: boolean;
  isEditJourney: boolean;
  comprehensivePlanning: number;
  enquiryId: any;
  getComprehensiveSummaryDashboard: any;
  getCurrentVersionType = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private configService: ConfigService,
    private router: Router,
    private progressService: ProgressTrackerService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private loaderService: LoaderService,
    private modal: NgbModal
  ) {
    this.isCorporateUser = (comprehensiveService.isCorporateRole() || comprehensiveService.getSpecialPromoCodeStatus());
    this.adviserPaymentStatus = comprehensiveService.getAdvisorStatus();
    this.skipProfileStatus = comprehensiveService.getRiskProfileFlag();
    const reportStatus = this.comprehensiveService.getReportStatus();
    if (this.isCorporateUser && reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY && router.url.indexOf(COMPREHENSIVE_ROUTES.SPEAK_TO_ADVISOR) < 0) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DASHBOARD]);
    }
    this.pageId = this.activatedRoute.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.isPaymentEnabled = config.paymentEnabled;
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant("CMP.REVIEW.TITLE");
        this.loading = this.translate.instant("COMMON_LOADER.TITLE");
        this.setPageTitle(this.pageTitle);
      });
    });
    this.subscription = this.navbarService
      .subscribeBackPress()
      .subscribe((event) => {
        if (event && event !== "") {
          if (this.isCorporateUser && reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DASHBOARD]);
          } else {
            const url = this.skipProfileStatus ? COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + "/1" : COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + "/4";
            this.router.navigate([url]);
          }
        }
      });
  }

  ngOnInit() {
    this.loaderService.hideLoaderForced();
    this.progressService.setProgressTrackerData(
      this.comprehensiveService.generateProgressTrackerData()
    );
    this.progressService.setReadOnly(false);
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe(
      (pageId) => {
        if (this.pageId === pageId) {
          this.progressService.show();
        }
      }
    );
    const reportStatus = this.comprehensiveService.getReportStatus();
    this.requireToPay = reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW && !this.isCorporateUser;
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) { 
      this.initiateReport();
    } else if (!this.comprehensiveService.checkResultData()) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT]);
    }

    if (!this.isCorporateUser) {
      this.isFirstTimeCorporateUser = false;
      this.setPublicUserFlags(reportStatus);
    } else {
      this.isFirstTimePublicUser = false;
      if (this.router.url.indexOf(COMPREHENSIVE_ROUTES.SPEAK_TO_ADVISOR) >= 0 && reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY && Util.isEmptyOrNull(this.adviserPaymentStatus)) {
        this.isSpeakToAdvisor = true;
        this.isFirstTimeCorporateUser = false;
      } else {
        this.isSpeakToAdvisor = false;
        this.setCorporateUserFlag(reportStatus);
      }
    }
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.menuClickSubscription) {
      this.menuClickSubscription.unsubscribe();
    }
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, {
      id: this.pageId,
      iconClass: "navbar__menuItem--journey-map",
    });
  }
  goToReviewInput() {
    if (this.isSpeakToAdvisor) {
      this.getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.FULL;
      this.comprehensiveApiService.getComprehensiveSummaryDashboard().subscribe((dashboardData: any) => {
        if (dashboardData && dashboardData.objectList[0]) {
          this.getComprehensiveSummaryDashboard = this.comprehensiveService.filterDataByInput(dashboardData.objectList, 'type', this.getCurrentVersionType);
          this.enquiryId = this.getComprehensiveSummaryDashboard.enquiryId;
          this.getComprehensiveCall();
        }
      })
    } else {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    }
  }

  goToNext() {
    const reportStatus = this.comprehensiveService.getReportStatus();
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
    } else if (this.comprehensiveService.checkResultData()) {
      const currentStep = this.comprehensiveService.getMySteps();
      if (currentStep === 5) {
        if ( this.isPaymentEnabled && !this.isCorporateUser && reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW ) {
          // If payment is enabled and user has not paid, go payment else initiate report gen
          this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);
        } else {
          this.loaderService.showLoader({
            title: this.loading,
            autoHide: false,
          });
          this.initiateReport();
        }
      } else {
        this.router.navigate([
          COMPREHENSIVE_ROUTE_PATHS.STEPS + "/" + currentStep
        ]);
      }
    } else {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT]);
    }
  }

  initiateReport() {
    const enquiryId = {
      enquiryId: this.comprehensiveService.getEnquiryId(),
      promoCode: this.comprehensiveService.getCfpPromoCode(),
      waivedPromo: this.comprehensiveService.getWaivedPromo(),
      specialPromoCode: this.comprehensiveService.getSpecialPromoCodeStatus() 
    };
    const cashPayload = {
      enquiryId: this.comprehensiveService.getEnquiryId(),
      liquidCashAmount: this.comprehensiveService.getLiquidCash(),
      spareCashAmount: this.comprehensiveService.getComputeSpareCash(),
    };
    this.comprehensiveApiService
      .generateComprehensiveCashflow(cashPayload)
      .subscribe((cashData) => { });
    this.comprehensiveApiService
      .generateComprehensiveReport(enquiryId)
      .subscribe(
        (data) => {
          let reportStatus = COMPREHENSIVE_CONST.REPORT_STATUS.READY;
          let viewMode = false;
          if (!this.isCorporateUser) {
            reportStatus = COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED;
            viewMode = true;
          }
          let routerURL: any;
          if (this.isCorporateUser && this.comprehensiveService.getReportStatus() === COMPREHENSIVE_CONST.REPORT_STATUS.EDIT && Util.isEmptyOrNull(this.adviserPaymentStatus)) {
            routerURL = COMPREHENSIVE_ROUTE_PATHS.REVIEW;
            this.isEditJourney = true;
            this.isFirstTimeCorporateUser = false;
            this.isSpeakToAdvisor = false;
          } else {
            routerURL = COMPREHENSIVE_ROUTE_PATHS.RESULT;
          }
          this.comprehensiveService.setReportStatus(reportStatus);
          if (!this.isCorporateUser || (this.isCorporateUser && Util.isEmptyOrNull(this.adviserPaymentStatus))) {
            this.comprehensiveService.setLocked(viewMode);
            this.comprehensiveService.setViewableMode(viewMode);
          }
          this.router.navigate([routerURL]);
          this.loaderService.hideLoaderForced();
        },
        (err) => {
          this.loaderService.hideLoaderForced();
        }
      );
  }

  goToDashboard() {
    this.comprehensiveService.setToastMessage(true);
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DASHBOARD]);
  }

  speakToAdvisor() {
    const ref = this.modal.open(ModelWithButtonComponent, {
      centered: true,
      windowClass: "speak-to-adviser-modal",
    });
    ref.componentInstance.errorTitle = this.translate.instant(
      "COMPREHENSIVE.DASHBOARD.ADVISER_MODAL.TITLE"
    );
    ref.componentInstance.errorMessageHTML = this.translate.instant(
      "COMPREHENSIVE.DASHBOARD.ADVISER_MODAL.DESC"
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      "COMPREHENSIVE.DASHBOARD.ADVISER_MODAL.BTN_LBL"
    );
    ref.componentInstance.primaryAction.subscribe(() => {
      const routerURL = COMPREHENSIVE_ROUTE_PATHS.SPEAK_TO_ADVISOR;
      this.router.navigate([routerURL]);
    });
  }

  checkout() {
    this.router.navigate([PAYMENT_ROUTE_PATHS.CHECKOUT]);
  }

  setPublicUserFlags(reportStatus: any) {
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
      this.isPaymentEnabled ? this.isFirstTimePublicUser = true : this.isFirstTimePublicUser = false;
    } else {
      this.isFirstTimePublicUser = false;
    }
  }

  setCorporateUserFlag(reportStatus: string) {
    const isLocked = this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry.isLocked;
    if (
      Util.isEmptyOrNull(this.adviserPaymentStatus) && (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW || reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.EDIT)
    ) {
      this.isFirstTimeCorporateUser = true;
    } else if (
      this.adviserPaymentStatus && (this.adviserPaymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PAID ||
        this.adviserPaymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.WAIVED) && reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.EDIT && !isLocked
    ) {
      this.isEditJourney = false;
      this.isFirstTimeCorporateUser = true;
    }
  }

  speakToAdviserModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'speak-to-adviser-modal' });
    ref.componentInstance.errorTitle = this.translate.instant('COMPREHENSIVE.DASHBOARD.ADVISER_MODAL.TITLE');
    ref.componentInstance.errorMessageHTML = this.translate.instant('COMPREHENSIVE.DASHBOARD.ADVISER_MODAL.DESC');
    ref.componentInstance.primaryActionLabel = this.translate.instant('COMPREHENSIVE.DASHBOARD.ADVISER_MODAL.BTN_LBL');
    ref.componentInstance.primaryAction.subscribe(() => {
      const routerURL = COMPREHENSIVE_ROUTE_PATHS.SPEAK_TO_ADVISOR;
      this.router.navigate([routerURL]);
    });
  }

  getComprehensiveCall() {
    this.loaderService.showLoader({ title: this.pageTitle });
    const reportStatusValue = COMPREHENSIVE_CONST.REPORT_STATUS.EDIT;
    const payload = { enquiryId: this.enquiryId, reportStatus: reportStatusValue };
    this.comprehensiveApiService.updateComprehensiveReportStatus(payload).subscribe((data: any) => {
      if (data) {
        this.comprehensiveApiService.getComprehensiveSummary().subscribe((summaryData: any) => {
          if (summaryData) {
            summaryData.objectList[0].comprehensiveEnquiry.reportStatus = COMPREHENSIVE_CONST.REPORT_STATUS.EDIT;
            this.comprehensiveService.setComprehensiveSummary(summaryData.objectList[0]);
            this.comprehensiveService.setReportStatus(COMPREHENSIVE_CONST.REPORT_STATUS.EDIT);
            this.comprehensiveService.setViewableMode(false);
            this.loaderService.hideLoader();
            this.comprehensiveService.setRiskQuestions().subscribe((riskQues) => {
              this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
            });
          }
        });
      } else {
        this.loaderService.hideLoader();
      }
    });
  }
}
