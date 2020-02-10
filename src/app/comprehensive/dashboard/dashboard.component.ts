import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';

import { AppService } from '../../app.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { FileUtil } from '../../shared/utils/file.util';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyProfile } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';
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
  getComprehensiveDashboard: any;
  getCurrentVersionType = '';
  comprehensiveLiteEnabled: boolean;
  versionTypeEnabled: boolean;
  getComprehensiveSummaryDashboard: any;
  // tslint:disable-next-line:cognitive-complexity
  constructor(
    private router: Router,
    private translate: TranslateService,
    private configService: ConfigService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private datePipe: DatePipe,
    private navbarService: NavbarService,
    private downloadfile: FileUtil,
    private authService: AuthenticationService,
    private loaderService: LoaderService, private appService: AppService) {
      this.appService.clearPromoCode();
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
      this.comprehensiveLiteEnabled = this.authService.isSignedUserWithRole(COMPREHENSIVE_CONST.ROLES.ROLE_COMPRE_LITE);
      this.getCurrentVersionType =  this.comprehensiveService.getComprehensiveCurrentVersion();
      if ((this.getCurrentVersionType === '' || this.getCurrentVersionType === null ||
    this.getCurrentVersionType === COMPREHENSIVE_CONST.VERSION_TYPE.LITE ) && this.comprehensiveLiteEnabled) {
      this.getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.LITE;
      this.setComprehensivePlan(false);
    } else {
      this.getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.FULL;
      this.setComprehensivePlan(true);
    }
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
    if (this.comprehensivePlanning === 4 && !this.versionTypeEnabled) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.ROOT]);
    } else {
      this.setComprehensiveSummary(true, COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED);
    }
  }

  goToCurrentStep() {
    if (this.currentStep === 0 && this.getComprehensiveSummaryDashboard.isDobUpdated) {
      this.goToEditProfile();
    } else if (this.currentStep >= 0 && this.currentStep < 4) {
      //this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep + 1)]);
      const routerURL = COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep + 1);
      this.setComprehensiveSummary(true, routerURL);
    } else if (this.currentStep === 4) {
      //this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep)]);
      const routerURL = COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep);
      this.setComprehensiveSummary(true, routerURL);
    }
  }
  goToEditComprehensivePlan(viewMode: boolean) {
    if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED
      || this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
      //this.comprehensiveService.setViewableMode(true);
      if (!this.islocked) {
        //this.setComprehensiveSummary(false, '');
        this.getComprehensiveCall();
      }
      if (this.getComprehensiveSummaryDashboard.dobPopUpEnable) {
        const toolTipParams = {
          TITLE: '',
          DESCRIPTION: this.translate.instant('COMPREHENSIVE.DASHBOARD.WARNING_POPUP'),
          URL: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED
        };
        this.comprehensiveService.openTooltipModalWithDismiss(toolTipParams);
      } else {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
      }
    } else {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    }
  }
  getComprehensiveCall() {
    this.loaderService.showLoader({ title: 'Fetching Data' });
    this.comprehensiveApiService.getComprehensiveSummary(this.getCurrentVersionType).subscribe((userData: any) => {
     if (userData && userData.objectList[0]) {
        this.comprehensiveService.setComprehensiveSummary(userData.objectList[0]);
        this.userDetails = this.comprehensiveService.getMyProfile();
        this.comprehensiveApiService.savePersonalDetails(this.userDetails).subscribe((data: any) => {
          if (data) {
            this.comprehensiveApiService.getComprehensiveSummary(this.getCurrentVersionType).subscribe((summaryData: any) => {
              if (summaryData) {
                this.comprehensiveService.setComprehensiveSummary(summaryData.objectList[0]);
                this.comprehensiveService.setViewableMode(true);
                this.loaderService.hideLoader();
                this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
              }
            });
          } else {
            this.loaderService.hideLoader();
          }
        });
      } else {
        this.loaderService.hideLoader();
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
  setComprehensivePlan(versionType: boolean) {
    this.comprehensiveService.clearFormData();
    if (!versionType) {
      this.getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.LITE;
      this.comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.LITE);
      this.versionTypeEnabled = true;
      this.setComprehensiveDashboard();

    } else {
      this.getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.FULL;
      this.comprehensiveService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
      this.versionTypeEnabled = false;
      this.setComprehensiveDashboard();

    }
  }
  setComprehensiveSummary(routerEnabled: boolean, routerUrlPath: any) {
    if (routerEnabled) {
      this.loaderService.showLoader({ title: 'Fetching Data' });
    } else {
      this.isLoadComplete = false;
    }
    this.comprehensivePlanning = 4;
    this.comprehensiveApiService.getComprehensiveSummary(this.getCurrentVersionType).subscribe((summaryData: any) => {
      if (summaryData && summaryData.objectList[0]) {
        //this.reportStatus = (summaryData.objectList[0].comprehensiveEnquiry.reportStatus);
        this.comprehensiveService.setComprehensiveSummary(summaryData.objectList[0]);
        this.userDetails = this.comprehensiveService.getMyProfile();
        this.getComprehensiveSummary = this.comprehensiveService.getComprehensiveSummary();
        this.islocked = this.getComprehensiveSummary.comprehensiveEnquiry !== null &&
         this.getComprehensiveSummary.comprehensiveEnquiry.isLocked;
        this.userName = this.userDetails.firstName;
        this.advisorStatus = false;
        //const reportDateAPI = new Date();
        // this.reportDate = this.datePipe.transform(reportDateAPI, 'dd MMM` yyyy');
        this.reportStatus = (this.getComprehensiveSummary && this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus
          && this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus !== null && this.userDetails.nationalityStatus)
          ? this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus : null;
        if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW && (this.islocked === null || !this.islocked)) {
          this.comprehensivePlanning = 3;
        } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED && !this.islocked) {
          this.comprehensivePlanning = 5;
          if (this.getComprehensiveSummary.comprehensiveEnquiry &&
            this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp) {
            this.submittedDate = this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp;
          }
        } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED ||
          this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
          this.comprehensivePlanning = 0;
        }
        //  else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
        //   this.comprehensivePlanning = (this.advisorStatus) ? 2 : 1;
        //   this.generateReport();
        // }
        this.currentStep = (this.getComprehensiveSummary && this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted
          && this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted !== null)
          ? this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted : 0;
        if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED
          || this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
          this.comprehensiveService.setViewableMode(true);
        } else {
          this.comprehensiveService.setViewableMode(false);
        }
        if (routerEnabled) {
          this.loaderService.hideLoader();
          this.router.navigate([routerUrlPath]);
        } else {
          this.isLoadComplete = true;
        }
      } else {
        if (routerEnabled) {
          this.loaderService.hideLoader();
          if (!this.versionTypeEnabled) {
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.ROOT]);
          } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
          }
        } else {
          this.isLoadComplete = true;
        }
      }
    });
  }
  /*
  *Fetch Dashboard API
  */
  setComprehensiveDashboard() {
    this.isLoadComplete = false;
    this.comprehensivePlanning = 4;
    this.islocked = null;
    this.reportStatus = null;
    this.advisorStatus = false;
    this.getComprehensiveSummaryDashboard = '';
    this.currentStep = -1;
    this.comprehensiveApiService.getComprehensiveSummaryDashboard().subscribe( (dashboardData: any) => {
      if (dashboardData && dashboardData.objectList[0]) {
        // tslint:disable-next-line: max-line-length
        this.getComprehensiveSummaryDashboard = this.comprehensiveService.filterDataByInput(dashboardData.objectList, 'type', this.getCurrentVersionType);
        if (this.getComprehensiveSummaryDashboard !== '') {
          this.islocked = this.getComprehensiveSummaryDashboard.isLocked;
          //const reportDateAPI = new Date();
          // this.reportDate = this.datePipe.transform(reportDateAPI, 'dd MMM` yyyy');

          this.reportStatus = this.getComprehensiveSummaryDashboard.reportStatus;
          if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW && (this.islocked === null || !this.islocked)) {
          this.comprehensivePlanning = 3;
          } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED && !this.islocked) {
          this.comprehensivePlanning = 5;
          if (this.getComprehensiveSummaryDashboard.reportSubmittedTimeStamp) {
          this.submittedDate = this.getComprehensiveSummaryDashboard.reportSubmittedTimeStamp;
          }
          } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED ||
          this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
          this.comprehensivePlanning = 0;
          }
          //  else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
          //   this.comprehensivePlanning = (this.advisorStatus) ? 2 : 1;
          //   this.generateReport();
          // }
          this.currentStep = (this.getComprehensiveSummaryDashboard.stepCompleted !== null)
          ? this.getComprehensiveSummaryDashboard.stepCompleted : 0;

        }
        this.isLoadComplete = true;
      } else {
        this.isLoadComplete = true;
      }

    });
  }
}
