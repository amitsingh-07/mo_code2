import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CORPBIZ_WELCOME_FLOW } from '../corpbiz-welcome-flow.constant';
import { ComprehensiveApiService } from '../../comprehensive/comprehensive-api.service';
import { ComprehensiveService } from '../../comprehensive/comprehensive.service';
import { FileUtil } from '../../shared/utils/file.util';
import { COMPREHENSIVE_CONST } from '../../comprehensive/comprehensive-config.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DownloadReportComponent implements OnInit {
  getComprehensiveSummaryDashboardInfo: any;
  getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.FULL;
  showDownloadReport = true;
  subscription: Subscription;

  constructor(private readonly translate: TranslateService,
              private comprehensiveService: ComprehensiveService,
              private downloadfile: FileUtil,
              private comprehensiveApiService: ComprehensiveApiService,
              private footerService: FooterService,
              private navbarService: NavbarService,
              private router: Router,
              private loaderService: LoaderService
              ) {
                this.translate.use('en');
              }

  ngOnInit(): void {
    if (this.navbarService.welcomeJourneyCompleted) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    }
    this.navbarService.setNavbarMode(106);
    this.footerService.setFooterVisibility(false);
    this.subscription = this.navbarService.preventBackButton().subscribe();
  }

  getComprehensiveSummaryDashboard() {
    this.comprehensiveApiService.getComprehensiveSummaryDashboard().subscribe((dashboardData: any) => {
      if (dashboardData && dashboardData.objectList[0]) {
        this.getComprehensiveSummaryDashboardInfo = this.comprehensiveService.filterDataByInput(dashboardData.objectList, 'type', this.getCurrentVersionType);
      }
    });
  }

  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }

  downloadComprehensiveReport() {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    let newWindow;
    if (iOS) {
      newWindow = window.open();
    }
    const payload = { 
      reportId: this.comprehensiveService.welcomeFlowMyInfoData.reportId, 
      enquiryId: this.comprehensiveService.welcomeFlowMyInfoData.enquiryId 
    };
    this.showLoader();
    this.comprehensiveApiService.downloadComprehensiveReport(payload).subscribe((data: any) => {
      this.loaderService.hideLoaderForced();
      const pdfUrl = window.URL.createObjectURL(data.body);
      if (iOS) {
        if (newWindow.document.readyState === CORPBIZ_WELCOME_FLOW.CONDITION_CONST.COMPLETE) {
          newWindow.location.assign(pdfUrl);
        } else {
          newWindow.onload = () => {
            newWindow.location.assign(pdfUrl);
          };
        }
      } else {
        this.downloadfile.saveAs(data.body, COMPREHENSIVE_CONST.REPORT_PDF_NAME);
      }
    }, () => {
      this.loaderService.hideLoaderForced();
    });
  }

  redirectToDashboard() {
    this.navbarService.welcomeJourneyCompleted = true;
    this.navbarService.displayingWelcomeFlowContent$.next(false);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
