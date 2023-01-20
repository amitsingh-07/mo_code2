import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';
import { ComprehensiveService } from './../../comprehensive/comprehensive.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { FooterService } from '../../shared/footer/footer.service';
import { ComprehensiveApiService } from './../../comprehensive/comprehensive-api.service';
import { SignUpService } from '../../sign-up/sign-up.service';
import { COMPREHENSIVE_CONST } from './../../comprehensive/comprehensive-config.constants';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { appConstants } from '../../app.constants';
import { environment } from '../../../environments/environment'
import { Util } from '../../shared/utils/util';
@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  styleUrls: ['./payment-instruction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentInstructionComponent implements OnInit, OnDestroy {
  toastMsg: any;
  showFixedToastMessage: boolean;
  addTopMargin: boolean;
  pageTitle: any;
  emailID: any;
  getComprehensiveSummaryDashboard: any;
  isCorporate: boolean;
  corpFaq = appConstants.CORPORATE_FAQ;
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private signUpService: SignUpService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService
  ) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('COMPREHENSIVE.DASHBOARD.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.isCorporate = this.comprehensiveService.isCorporateRole();
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.emailID = this.signUpService.getUserProfileInfo();
    this.comprehensiveApiService.getComprehensiveSummaryDashboard().subscribe((dashboardData: any) => {
      if (dashboardData && dashboardData.objectList[0]) {
        this.getComprehensiveSummaryDashboard = this.comprehensiveService.filterDataByInput(dashboardData.objectList, 'type', COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
        const specialPromoCode = this.getComprehensiveSummaryDashboard.specialPromoCode;
        if (specialPromoCode) {
          this.isCorporate = specialPromoCode;
        }
        if (!(this.getComprehensiveSummaryDashboard && ((!this.isCorporate && this.getComprehensiveSummaryDashboard.paymentStatus
          && (this.getComprehensiveSummaryDashboard.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PENDING ||
            this.getComprehensiveSummaryDashboard.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PARTIAL_PENDING)
        ) || (this.isCorporate && this.getComprehensiveSummaryDashboard.advisorPaymentStatus && this.getComprehensiveSummaryDashboard.advisorPaymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PENDING)
        ))) {
          this.backToDashboard();
        }
      } else {
        this.backToDashboard();
      }
    });
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
    this.navbarService.setPaymentLockIcon(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
    this.navbarService.setPaymentLockIcon(true);
  }
  getQrCodeImg() {
    return environment.apiBaseUrl + '/app/assets/images/comprehensive/qrcode.png';
  }

  backToDashboard() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  notify(event) {
    this.addTopMargin = true;
    const toasterMsg = {
      desc: this.translate.instant('TRANSFER_INSTRUCTION.COPIED')
    };
    this.toastMsg = toasterMsg;
    this.showFixedToastMessage = true;
    this.hideToastMessage();
  }

  hideToastMessage() {
    setTimeout(() => {
      this.showFixedToastMessage = false;
      this.toastMsg = null;
      this.addTopMargin = true;
    }, 3000);
  }

  navigateCompreFaq() {
    if (this.authService.isUserTypeCorporate) {
      Util.openExternalUrl('/app' + appConstants.CORPORATE_FAQ, '_blank');
    } else {
      Util.openExternalUrl(appConstants.COMPREHENSIVE_PAYMENT_FAQ, '_blank');
    }
  }
}
