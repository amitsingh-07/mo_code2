import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ConfigService } from '../../config/config.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';

@Component({
  selector: 'app-validate-result',
  templateUrl: './validate-result.component.html',
  styleUrls: ['./validate-result.component.scss']
})
export class ValidateResultComponent implements OnInit, OnDestroy {
  pageId: string;
  pageTitle: string;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute, public navbarService: NavbarService,
    private translate: TranslateService,
    private configService: ConfigService, private router: Router,
    private progressService: ProgressTrackerService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService) {
    this.pageId = this.activatedRoute.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.VALIDATE_RESULT.TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        this.goToNext();
      }
    });
  }

  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.progressService.setReadOnly(true);
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    const reportStatus = this.comprehensiveService.getReportStatus();
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
    } else if (this.comprehensiveService.checkResultData()) {
      const currentStep = this.comprehensiveService.getMySteps();
      const stepCalculated = 4;
      if (currentStep === 3 || currentStep === 4) {
        const stepCheck = this.comprehensiveService.checkStepValidation(stepCalculated);
        if (stepCheck.status) {
          if (currentStep === 4) {
            this.initiateReport();
          } else {
            const stepIndicatorData = { enquiryId: this.comprehensiveService.getEnquiryId(), stepCompleted: stepCalculated };
            this.comprehensiveApiService.saveStepIndicator(stepIndicatorData).subscribe((data) => {
              this.comprehensiveService.setMySteps(stepCalculated);
              this.initiateReport();
            });
          }
        } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + stepCheck.stepIndicate]);
        }
      } else {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + currentStep]);
      }
    }
  }
  ngOnDestroy() {
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  goToNext() {
    const reportStatus = this.comprehensiveService.getReportStatus();
    if (reportStatus !== COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_EARNINGS], { skipLocationChange: true });
    }
  }
  initiateReport() {
    const reportData = { enquiryId: this.comprehensiveService.getEnquiryId() };
    this.comprehensiveApiService.generateComprehensiveReport(reportData).subscribe((data) => {
      this.comprehensiveService.setReportStatus(COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED);
      this.comprehensiveService.setViewableMode(true);
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
    });
  }
}
