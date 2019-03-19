import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';
import { IMyProfile } from '../comprehensive-types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName: string;
  comprehensivePlanning: number;
  userDetails: IMyProfile;
  getComprehensiveSummary: any;
  getComprehensiveSummaryEnquiry: any;
  reportStatus: number; // 0 - Not Completed 1 - Pending 2 - Completed
  advisorStatus: boolean;
  reportDate: any;
  currentStep = 1;
  stepDetails = {hasDependents: 1, hasEndowments: 2};
  constructor(private route: ActivatedRoute, private router: Router, private translate: TranslateService,
              private configService: ConfigService, private comprehensiveService: ComprehensiveService,
              private comprehensiveApiService: ComprehensiveApiService, private datePipe: DatePipe) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
  }

  ngOnInit() {
    this.userName = 'kelvin goh';
    this.userDetails = this.comprehensiveService.getMyProfile();
    console.log(this.comprehensiveService.getComprehensiveSummary());
    this.getComprehensiveSummary = this.comprehensiveService.getComprehensiveSummary();
    // tslint:disable-next-line: no-commented-code
    if (!this.userDetails || !this.userDetails.firstName) {
      this.comprehensiveApiService.getComprehensiveSummary().subscribe((data: any) => {
        if (data) {
          this.comprehensiveService.setComprehensiveSummary(data.objectList[0]);
          this.userDetails = this.comprehensiveService.getMyProfile();
        }
      });
    } else {
      this.userName = this.userDetails.firstName;
    }
    /**
     * 0 - Waiting for report
     * 1 - Completed & View Report
     * 2 - Completed & View Report with advisor
     * 3 - Not Completed
     */
    this.comprehensivePlanning = 3;
    this.reportStatus = 1;
    this.advisorStatus = true;
    const reportDateAPI = new Date();
    this.reportDate = this.datePipe.transform(reportDateAPI, 'dd MMM` yyyy');
    this.getComprehensiveSummaryEnquiry = this.getComprehensiveSummary.comprehensiveEnquiry;
    console.log(this.getComprehensiveSummaryEnquiry);
    if ( this.getComprehensiveSummaryEnquiry.hasComprehensive === true &&
        this.getComprehensiveSummaryEnquiry.hasDependents === true &&
        this.getComprehensiveSummaryEnquiry.hasEndowments === true &&
        this.getComprehensiveSummaryEnquiry.hasRegularSavingsPlans === true
      ) {
        if ( this.reportStatus === 1 ) {
          this.comprehensivePlanning = 0;
        } else if ( this.reportStatus === 2) {
          this.comprehensivePlanning = (this.advisorStatus === true) ? 2 : 1;
        } else {
          this.comprehensivePlanning = 3;
        }
    }
    Object.keys(this.stepDetails).forEach((key) => {
      console.log(key + ' - ' + this.stepDetails[key]);
      this.currentStep = this.stepDetails[key];
    });
    console.log(this.currentStep);
    this.getCurrentComprehensiveStep();
  }

  goToEditProfile() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
  }

  goToCurrentStep() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep + 1)]);
  }
  goToEditComprehensivePlan() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
  }
  getCurrentComprehensiveStep() {
    if (this.getComprehensiveSummaryEnquiry) {
    for ( const i in this.stepDetails ) {
      if (this.getComprehensiveSummaryEnquiry[i] !== true) {
        break;
      } else {
        this.currentStep = this.stepDetails[i];
      }
    }
    }
  }
}
