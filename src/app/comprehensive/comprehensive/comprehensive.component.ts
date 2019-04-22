import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { APP_ROUTES } from '../../app-routes.constants';
import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ProgressTrackerUtil } from '../../shared/modal/progress-tracker/progress-tracker-util';
import { SignUpService } from '../../sign-up/sign-up.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyProfile } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
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
  styleUrls: ['./comprehensive.component.scss']
})
export class ComprehensiveComponent implements OnInit {

  loginModalTitle: string;
  modalRef: NgbModalRef;
  safeURL: any;
  userDetails: IMyProfile;
  promoCodeForm: FormGroup;
  promoCodeSuccess: string;

  constructor(
    private appService: AppService, private cmpService: ComprehensiveService,
    private route: ActivatedRoute, private router: Router, public translate: TranslateService,
    public navbarService: NavbarService, private configService: ConfigService,
    private authService: AuthenticationService, public modal: NgbModal,
    private loaderService: LoaderService, private signUpService: SignUpService,
    public footerService: FooterService, private sanitizer: DomSanitizer, private comprehensiveApiService: ComprehensiveApiService) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        this.loginModalTitle = this.translate.instant('CMP.MODAL.LOGIN_SIGNUP_TITLE');
        this.promoCodeSuccess = this.translate.instant('CMP.MODAL.PROMO_CODE_SUCCESS');
        this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.translate.instant('CMP.COMPREHENSIVE.VIDEO_LINK'));
      });
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(false);
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
    if (this.authService.isSignedUser()) {
      this.userDetails = this.cmpService.getMyProfile();
      if (!this.userDetails || !this.userDetails.firstName) {
        this.loaderService.showLoader({ title: 'Fetching Data' });
        this.comprehensiveApiService.getComprehensiveSummary().subscribe((data: any) => {
          const cmpData = data.objectList[0];
          this.cmpService.setComprehensiveSummary(cmpData);
          this.loaderService.hideLoader();
          const action = this.cmpService.getAction();
          if (action === 'GET_PROMO_CODE') {
            this.getPromoCode();
          } else if (action === 'VALIDATE_PROMO_CODE') {
            this.getStarted('');
          } else {
            this.redirect();
          }
        });
      }
    }

    this.buildPromoCodeForm();
  }

  /**
   * Navigate to the `redirectUrl` if set, else navigate to the `Getting Started` page.
   */
  redirect() {
    const redirectUrl = this.signUpService.getRedirectUrl();
    const cmpData = this.cmpService.getComprehensiveSummary();
    if (redirectUrl && cmpData.comprehensiveEnquiry.hasComprehensive
      && cmpData.comprehensiveEnquiry.promoCodeValidated) {
      this.router.navigate([redirectUrl]);
    } else if (cmpData.comprehensiveEnquiry.hasComprehensive
      && cmpData.comprehensiveEnquiry.promoCodeValidated) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
    }
  }

  buildPromoCodeForm() {
    this.promoCodeForm = new FormGroup({
      comprehensivePromoCodeToken: new FormControl(''),
    });
  }
  getStarted(form) {
    this.cmpService.setAction('VALIDATE_PROMO_CODE');
    if (this.authService.isSignedUser()) {
      let promoCode = this.cmpService.getPromoCode();
      if (promoCode) {
        form.value.enquiryId = this.cmpService.getEnquiryId();
        this.cmpService.setPromoCode(form.value);
        promoCode = this.cmpService.getPromoCode();
      }
      this.comprehensiveApiService.ValidatePromoCode(promoCode).subscribe((data) => {
        this.redirect();
      }, (err) => {

      });
    } else {
      this.showLoginOrSignUpModal();
    }
  }
  showSuccessPopup() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = '';
    ref.componentInstance.errorMessage = this.promoCodeSuccess + this.signUpService.getUserProfileInfo().emailAddress;;
    ref.componentInstance.promoSuccess = true;
  }
  getPromoCode() {
    this.cmpService.setAction('GET_PROMO_CODE');
    if (this.authService.isSignedUser()) {
      this.comprehensiveApiService.getPromoCode().subscribe((data) => {
        this.showSuccessPopup();
      }, (err) => {

      });
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
    // #this.modalRef.componentInstance.data = { redirectUrl: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED };
    this.modalRef.componentInstance.title = this.loginModalTitle;
  }
}
