import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';

@Component({
  selector: 'app-validate-result',
  templateUrl: './validate-result.component.html',
  styleUrls: ['./validate-result.component.scss']
})
export class ValidateResultComponent implements OnInit, OnDestroy {
  pageId: string;
  pageTitle: string;
  menuClickSubscription: Subscription;
  constructor(private activatedRoute: ActivatedRoute, public navbarService: NavbarService,
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
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_5_TITLE_NAV');
        this.setPageTitle(this.pageTitle);
      });
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
    if (this.comprehensiveService.checkResultData()) {
      const currentStep = this.comprehensiveService.getMySteps();
      const stepCalculated = 4;
      const reportStatus = this.comprehensiveService.getReportStatus();
      if (reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RESULT] );
      } else if (currentStep === 3 || currentStep === 4) {
        const stepCheck = this.comprehensiveService.checkStepValidation(stepCalculated);
        if ( stepCheck.status ) {
          const stepIndicatorData = { enquiryId: this.comprehensiveService.getEnquiryId(), stepCompleted: stepCalculated  };
          this.comprehensiveApiService.saveStepIndicator(stepIndicatorData).subscribe((data) => {
            this.comprehensiveService.setMySteps(stepCalculated);
            this.comprehensiveService.setReportStatus(COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED);
          });
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
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/2'] );
  }
}
