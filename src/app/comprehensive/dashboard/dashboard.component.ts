import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NavbarService } from '../../shared/navbar/navbar.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyProfile } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';
import { FileUtil } from '../../shared/utils/file.util';

@Component({
  selector: 'app-comprehensive-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class ComprehensiveDashboardComponent implements OnInit {
  userName: string;
  comprehensivePlanning: number;
  userDetails: IMyProfile;
  getComprehensiveSummary: any;
  getComprehensiveSummaryEnquiry: any;
  reportStatus: any; // new submitted ready
  advisorStatus: boolean;
  reportDate: any;
  submittedDate: any;
  currentStep: number;
  stepDetails = { hasDependents: 1, hasEndowments: 2 };
  items: any;
  isLoadComplete = false;
  islocked: boolean;
  isComprehensiveEnabled = false;
  isComprehensiveLiveEnabled = false;
  // tslint:disable-next-line:cognitive-complexity
  constructor(
    private router: Router,
    private translate: TranslateService,
    private configService: ConfigService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private datePipe: DatePipe,
    private navbarService: NavbarService,
    private downloadfile: FileUtil) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.isComprehensiveEnabled = config.comprehensiveEnabled;
      this.isComprehensiveLiveEnabled = config.comprehensiveLiveEnabled;
    });
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(100);
    this.navbarService.setNavbarMobileVisibility(false);
    /**
     * 0 - Waiting for report
     * 1 - Completed & View Report
     * 2 - Completed & View Report with advisor
     * 3 - Not Completed
     */
    this.comprehensivePlanning = 4;
    this.comprehensiveApiService.getComprehensiveSummary().subscribe((data: any) => {
      if (data) {
        this.comprehensiveService.setComprehensiveSummary(data.objectList[0]);
        this.userDetails = this.comprehensiveService.getMyProfile();
        this.getComprehensiveSummary = this.comprehensiveService.getComprehensiveSummary();
        this.islocked = this.getComprehensiveSummary.comprehensiveEnquiry.isLocked
        this.userName = this.userDetails.firstName;
        this.advisorStatus = false;
        //const reportDateAPI = new Date();
        //this.reportDate = this.datePipe.transform(reportDateAPI, 'dd MMM` yyyy');
        this.reportStatus = (this.getComprehensiveSummary && this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus
          && this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus !== null && this.userDetails.nationalityStatus)
          ? this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus : null;
        if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW && (this.islocked === null || !this.islocked)) {
          this.comprehensivePlanning = 3;
        } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED && !this.islocked) {
          this.comprehensivePlanning = 5;
          let lastSubmittedDate = new Date();
          if (this.getComprehensiveSummary.comprehensiveEnquiry && this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp) {
            lastSubmittedDate = new Date(this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp);
          }
          const submittedDateAPI = lastSubmittedDate;
          this.submittedDate = this.datePipe.transform(submittedDateAPI, 'dd MMM` yy');
        } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED || this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
          this.comprehensivePlanning = 0;
        }
        //  else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
        //   this.comprehensivePlanning = (this.advisorStatus) ? 2 : 1;
        //   this.generateReport();
        // }
        this.currentStep = (this.getComprehensiveSummary && this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted
          && this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted !== null)
          ? this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted : 0;

        this.isLoadComplete = true;
      }
    });
  }

  ngOnInit() {
  }
  generateReport() {
    this.comprehensiveApiService.getReport().subscribe((data: any) => {
      this.comprehensiveService.setReportId(data.objectList[0].id);
      const reportDateAPI = new Date(data.objectList[0].createdTs);
      this.reportDate = this.datePipe.transform(reportDateAPI, 'dd MMM` yyyy');

    });
  }
  downloadComprehensiveReport() {
    const payload = { reportId: this.comprehensiveService.getReportId() };
    this.comprehensiveApiService.downloadComprehensiveReport(payload).subscribe((data: any) => {
      this.downloadfile.saveAs(data.body, COMPREHENSIVE_CONST.REPORT_PDF_NAME);
    });


  }
  goToEditProfile() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
  }

  goToCurrentStep() {
    if (this.currentStep === 0 && this.getComprehensiveSummary.comprehensiveEnquiry.isDobUpdated) {
      this.goToEditProfile();
    } else if (this.currentStep >= 0 && this.currentStep < 4) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep + 1)]);
    } else if (this.currentStep === 4) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep)]);
    }
  }
  goToEditComprehensivePlan(viewMode: boolean) {
    if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED
      || this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
      this.comprehensiveService.setViewableMode(true);
      if (!this.islocked) {
        this.getComprehensiveCall();

      }
      if (this.getComprehensiveSummary.comprehensiveEnquiry.dobPopUpEnable) {
        const toolTipParams = {
          TITLE: '',
          DESCRIPTION: this.translate.instant('COMPREHENSIVE.DASHBOARD.WARNING_POPUP'),
          URL: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED
        };
        this.comprehensiveService.openTooltipModalWithDismiss(toolTipParams);
      } else {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
      }
    }
    //  else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
    //   this.getComprehensiveCall();
    // }
    else {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    }
  }
  getComprehensiveCall() {
    this.comprehensiveApiService.savePersonalDetails(this.userDetails).subscribe((data: any) => {
      if (data) {
        this.comprehensiveApiService.getComprehensiveSummary().subscribe((summaryData: any) => {
          if (summaryData) {
            this.comprehensiveService.setComprehensiveSummary(summaryData.objectList[0]);
            this.comprehensiveService.setViewableMode(true);
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
          }
        });
      }
    });
  }
  getCurrentComprehensiveStep() {
    if (this.getComprehensiveSummaryEnquiry) {
      for (const i in this.stepDetails) {
        if (this.getComprehensiveSummaryEnquiry[i] !== true) {
          break;
        } else {
          this.currentStep = this.stepDetails[i];
        }
      }
    }
  }
}
