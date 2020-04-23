import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { APP_ROUTES } from '../../app-routes.constants';
import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { SignUpService } from '../../sign-up/sign-up.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyProfile } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { environment } from './../../../environments/environment';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import {
  LoginCreateAccountModelComponent
} from './../../shared/modal/login-create-account-model/login-create-account-model.component';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComprehensiveComponent implements OnInit {

  loginModalTitle: string;
  modalRef: NgbModalRef;
  safeURL: any;
  userDetails: IMyProfile;
  promoCodeForm: FormGroup;
  promoCodeSuccess: string;
  promoCodeValidated: boolean;
  promoValidated: string;
  productAmount = COMPREHENSIVE_CONST.PROMOTION.AMOUNT;
  getComprehensiveSummaryDashboard: any;
  isBannerNoteVisible: boolean;
  paymentEnabled = false;
  includingGst = false;
  fetchData: string;
  loading: string;
  constructor(
    private appService: AppService, private cmpService: ComprehensiveService,
    private route: ActivatedRoute, private router: Router, public translate: TranslateService,
    public navbarService: NavbarService, private configService: ConfigService,
    private authService: AuthenticationService, public modal: NgbModal,
    private loaderService: LoaderService, private signUpService: SignUpService,
    public footerService: FooterService, private sanitizer: DomSanitizer, private comprehensiveApiService: ComprehensiveApiService) {
    this.configService.getConfig().subscribe((config: any) => {
      this.paymentEnabled = config.paymentEnabled;
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        this.loginModalTitle = this.translate.instant('CMP.MODAL.LOGIN_SIGNUP_TITLE');
        this.promoCodeSuccess = this.translate.instant('CMP.MODAL.PROMO_CODE_SUCCESS');
        this.promoValidated = this.translate.instant('CMP.MODAL.PROMO_CODE_VALIDATED');
        this.fetchData = this.translate.instant('MYINFO.FETCH_MODAL_DATA.TITLE');
        this.loading = this.translate.instant('COMMON_LOADER.TITLE');
        this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.translate.instant('CMP.COMPREHENSIVE.VIDEO_LINK'));
        this.navbarService.setPageTitle(this.translate.instant('COMPREHENSIVE.DASHBOARD.COMPREHENSIVE_PLANNING_TITLE'), '', false);

        const isUnsupportedNoteShown = this.signUpService.getUnsupportedNoteShownFlag();
        this.signUpService.mobileOptimizedObservable$.subscribe((mobileOptimizedView) => {
          if (!this.signUpService.isMobileDevice() && !mobileOptimizedView && !isUnsupportedNoteShown) {
            this.signUpService.showUnsupportedDeviceModal();
            this.signUpService.setUnsupportedNoteShownFlag();
          }
        });
      });
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.footerService.setFooterVisibility(false);
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
    this.buildPromoCodeForm();

    if (this.authService.isSignedUser()) {
      const action = this.appService.getAction();
      this.loaderService.showLoader({ title: this.fetchData, autoHide: false });
      if (this.paymentEnabled) {
        this.getProductAmount();
      }
      const comprehensiveLiteEnabled = this.authService.isSignedUserWithRole(COMPREHENSIVE_CONST.ROLES.ROLE_COMPRE_LITE);
      let getCurrentVersionType = this.cmpService.getComprehensiveCurrentVersion();
      if ((getCurrentVersionType === '' || getCurrentVersionType === null ||
        getCurrentVersionType === COMPREHENSIVE_CONST.VERSION_TYPE.LITE) && comprehensiveLiteEnabled) {
        getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.LITE;
      } else {
        getCurrentVersionType = COMPREHENSIVE_CONST.VERSION_TYPE.FULL;
      }

      this.comprehensiveApiService.getComprehensiveSummaryDashboard().subscribe((dashboardData: any) => {
        if (dashboardData && dashboardData.objectList[0]) {
          // tslint:disable-next-line: max-line-length
          this.getComprehensiveSummaryDashboard = this.cmpService.filterDataByInput(dashboardData.objectList, 'type', COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
          if (this.getComprehensiveSummaryDashboard !== '') {
            if (action === COMPREHENSIVE_CONST.PROMO_CODE.GET) {
              this.getPromoCode();
            } else if (action === COMPREHENSIVE_CONST.PROMO_CODE.VALIDATE) {
              this.getStarted();
            } else if (!getCurrentVersionType) {
              this.redirect();
            } else {
              setTimeout(() => {
                this.loaderService.hideLoaderForced();
              }, 500);
            }
            this.getComprehensiveSummaryDashboard.isValidatedPromoCode ? this.promoCodeValidated = true :
              this.promoCodeValidated = false;
          } else {
            if (action === COMPREHENSIVE_CONST.PROMO_CODE.GET) {
              this.getPromoCode();
            } else if (action === COMPREHENSIVE_CONST.PROMO_CODE.VALIDATE) {
              this.getStarted();
            } else {
              setTimeout(() => {
                this.loaderService.hideLoaderForced();
              }, 500);
            }
          }
        } else {
          if (action === COMPREHENSIVE_CONST.PROMO_CODE.GET) {
            this.getPromoCode();
          } else if (action === COMPREHENSIVE_CONST.PROMO_CODE.VALIDATE) {
            this.getStarted();
          } else {
            setTimeout(() => {
              this.loaderService.hideLoaderForced();
            }, 500);
          }
        }
      });

    } else {
      if (this.paymentEnabled) {
        this.authService.authenticate().subscribe((data: any) => {
          this.getProductAmount();
          this.authService.clearAuthDetails();
        });
      }
    }
    this.isBannerNoteVisible = this.isCurrentDateInRange(COMPREHENSIVE_CONST.BANNER_NOTE_START_TIME,
      COMPREHENSIVE_CONST.BANNER_NOTE_END_TIME);
  }

  /**
   * Navigate to the `redirectUrl` if set, else navigate to the `Getting Started` page.
   */
  redirect() {
    this.appService.clearPromoCode();
    const redirectUrl = this.signUpService.getRedirectUrl();
    if (this.getComprehensiveSummaryDashboard &&
      this.getComprehensiveSummaryDashboard.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED &&
      (this.getComprehensiveSummaryDashboard.isValidatedPromoCode)) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DASHBOARD]);
    } else if (redirectUrl && (this.getComprehensiveSummaryDashboard && this.getComprehensiveSummaryDashboard.isValidatedPromoCode)) {
      this.router.navigate([redirectUrl]);
    } else if (this.getComprehensiveSummaryDashboard && this.getComprehensiveSummaryDashboard.isValidatedPromoCode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    }

    setTimeout(() => {
      this.loaderService.hideLoaderForced();
    }, 500);
  }

  buildPromoCodeForm() {
    this.promoCodeForm = new FormGroup({
      comprehensivePromoCodeToken: new FormControl(''),
    });
  }
  getStarted() {
    this.appService.setAction(COMPREHENSIVE_CONST.PROMO_CODE.VALIDATE);
    this.cmpService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
    if (this.promoCodeForm.value.comprehensivePromoCodeToken !== '') {
      this.appService.setPromoCode(this.promoCodeForm.value.comprehensivePromoCodeToken);
    }

    if (this.authService.isSignedUser()) {
      const promoCode = {
        sessionId: this.authService.getSessionId(),
        comprehensivePromoCodeToken: this.appService.getPromoCode(),
        promoCodeCat: COMPREHENSIVE_CONST.PROMO_CODE.TYPE
      };
      if (this.getComprehensiveSummaryDashboard && this.getComprehensiveSummaryDashboard.isValidatedPromoCode) {
        this.redirect();
      } else {
        this.loaderService.showLoader({ title: this.loading, autoHide: false });
        this.comprehensiveApiService.ValidatePromoCode(promoCode).subscribe((data: any) => {
          if (data && data.objectList[0].validatePromoCode) {
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
          }
        }, (err) => {
          setTimeout(() => {
            this.loaderService.hideLoaderForced();
          }, 500);
        });

      }
    } else {
      this.showLoginOrSignUpModal();
    }
  }
  showSuccessPopup() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = '';
    ref.componentInstance.promoSuccessMsg = this.promoCodeSuccess;
    ref.componentInstance.email = this.signUpService.getUserProfileInfo().emailAddress;
    ref.componentInstance.promoSuccess = true;
  }

  getPromoCode() {
    this.appService.setAction(COMPREHENSIVE_CONST.PROMO_CODE.GET);
    this.cmpService.setComprehensiveVersion(COMPREHENSIVE_CONST.VERSION_TYPE.FULL);
    if (this.authService.isSignedUser()) {
      if (this.getComprehensiveSummaryDashboard && this.getComprehensiveSummaryDashboard.isValidatedPromoCode) {
        this.redirect();
      } else {
        this.comprehensiveApiService.getPromoCode().subscribe((data) => {
          setTimeout(() => {
            this.loaderService.hideLoaderForced();
          }, 500);
          this.showSuccessPopup();

        }, (err) => {

        });
      }

    } else {
      this.showLoginOrSignUpModal();
    }
  }
  showLoginOrSignUpModal() {
    this.cmpService.clearFormData();
    this.cmpService.setStartingPage(APP_ROUTES.COMPREHENSIVE);
    this.modalRef = this.modal.open(LoginCreateAccountModelComponent, {
      windowClass: 'position-bottom',
      centered: true
    });
    this.modalRef.componentInstance.title = this.loginModalTitle;
  }

  isCurrentDateInRange(START_TIME, END_TIME) {
    return (new Date() >= new Date(START_TIME)
      && new Date() <= new Date(END_TIME));
  }
  getProductAmount() {
    const payload = { productType: COMPREHENSIVE_CONST.VERSION_TYPE.FULL };
    this.comprehensiveApiService.getProductAmount(payload).subscribe((data: any) => {
      if (data && data.objectList[0]) {
        this.includingGst = data.objectList[0].includingGst;
        this.productAmount = !this.includingGst ? data.objectList[0].totalAmount : data.objectList[0].price;
      }
    });
  }
}
