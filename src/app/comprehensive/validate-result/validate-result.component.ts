import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-validate-result',
  templateUrl: './validate-result.component.html',
  styleUrls: ['./validate-result.component.scss']
})
export class ValidateResultComponent implements OnInit, OnDestroy {
  pageId: string;
  pageTitle: string;
  loaderTitle: string;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute, public navbarService: NavbarService,
    private translate: TranslateService,
    private configService: ConfigService, private router: Router,
    private progressService: ProgressTrackerService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private loaderService: LoaderService) {
    this.pageId = this.activatedRoute.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.VALIDATE_RESULT.TITLE');
        this.loaderTitle = this.translate.instant('COMMON_LOADER.TITLE');
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
    if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.ERROR || reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DASHBOARD]);
    } else if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT]);
    } else if (this.comprehensiveService.checkResultData()) {
      const currentStep = this.comprehensiveService.getMySteps();
      const stepCalculated = 5;
      if (currentStep === 4 || currentStep === 5) {
        const stepCheck = this.comprehensiveService.checkStepValidation(stepCalculated);
        if (stepCheck.status) {
          if (currentStep === 5) {
            this.loaderService.showLoader({ title: this.loaderTitle, autoHide: false });
            this.initiateReport();
          } else {
            this.loaderService.showLoader({ title: this.loaderTitle, autoHide: false });
            const stepIndicatorData = {
              enquiryId: this.comprehensiveService.getEnquiryId(), stepCompleted: stepCalculated,
              subStepCompleted: 0
            };
            this.comprehensiveApiService.saveStepIndicator(stepIndicatorData).subscribe((data) => {
              this.comprehensiveService.setMySteps(stepCalculated, 0);
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
    this.subscription.unsubscribe();
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
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_EARNINGS]);
    }
  }
  initiateReport() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REVIEW]);
  }
}
