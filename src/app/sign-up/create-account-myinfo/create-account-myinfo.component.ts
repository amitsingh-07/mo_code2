import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ConfigService, IConfig } from '../../config/config.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { SignUpService } from '../sign-up.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { Util } from '../../shared/utils/util';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-create-account-myinfo',
  templateUrl: './create-account-myinfo.component.html',
  styleUrls: ['./create-account-myinfo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAccountMyinfoComponent implements OnInit {
  @Input('label') label;
  @Input('position') position;
  modelTitle: string;
  modelMessge: string;
  modelBtnText: string;
  showSingPass: boolean;
  myInfoSubscription: any;
  myinfoChangeListener: Subscription;
  secondTimer: any;
  thirdTimer: any;
  loader2StartTime: any;
  loader2Modal: any;
  loader3Modal: any;
  loader1Modal: any;
  referralParams = {};
  referralCode = '';
  formValue: any;
  loadingModalRef: NgbModalRef;

  constructor(
    private configService: ConfigService,
    private modal: NgbModal,
    private router: Router,
    private _location: Location,
    private myInfoService: MyInfoService,
    public readonly translate: TranslateService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,    
    public navbarService: NavbarService,
    public footerService: FooterService,    
    private authService: AuthenticationService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.modelTitle = this.translate.instant(
        'CREATE_ACCOUNT_MY_INFO.MODAL_TITLE'
      );
      this.modelMessge = this.translate.instant(
        'CREATE_ACCOUNT_MY_INFO.MODAL_DESCRIPTION'
      );
      this.modelBtnText = this.translate.instant(
        'CREATE_ACCOUNT_MY_INFO.MODAL_BTN-TEXT'
      );
      this.loader1Modal = this.translate.instant(
        'CREATE_ACCOUNT_MY_INFO.LOADER1'
      );
      this.loader2Modal = this.translate.instant(
        'CREATE_ACCOUNT_MY_INFO.LOADER2'
      );
      this.loader3Modal = this.translate.instant(
        'CREATE_ACCOUNT_MY_INFO.LOADER3'
      );
    });
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.loader2StartTime = config.account.loaderStartTime * 1000;
    });
  }

  showFetchPopUp() {
    this.secondTimer = setTimeout(() => {
      if (this.myInfoService.loadingModalRef) {
        this.openSecondPopup();
      }
    }, this.loader2StartTime);
  }

  ngOnInit(): void {    
    if (!this.authService.isAuthenticated()) {
      this.authService.authenticate().subscribe((token) => {
      });
    }
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.route.queryParams.subscribe((params) => {
      if (params['referral_code'] && !Util.isEmptyOrNull(params['referral_code'])) {
        this.referralParams = { referral_code: params['referral_code'] };
        this.referralCode = '/' + params['referral_code'];
      }
    });
    this.myinfoChangeListener = this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '' &&
        this.myInfoService.getMyInfoAttributes() === this.signUpService.myInfoAttributes.join()) {
        if (myinfoObj.status && myinfoObj.status === SIGN_UP_CONFIG.CREATE_ACCOUNT_STATIC.SUCCESS && this.myInfoService.isMyInfoEnabled) {
          this.getMyInfoAccountCreateData();
        } else if (myinfoObj.status && myinfoObj.status === SIGN_UP_CONFIG.CREATE_ACCOUNT_STATIC.CANCELLED) {
          this.cancelMyInfo();
        } else {
          this.closeMyInfoPopup(false);
        }
      }
    });
    this.formValue = this.signUpService.getAccountInfo();
    if (this.formValue && this.formValue.isMyInfoEnabled) {
      this.signUpService.setMyInfoStatus(false);
    }
  }
  getMyInfoAccountCreateData() {
    this.showFetchPopUp();
    this.myInfoSubscription = this.myInfoService.getMyInfoAccountCreateData().subscribe((data) => {
      if (data.responseMessage.responseCode === 6000 && data && data.objectList[0]) {
        this.closeMyInfoPopup(false);
        this.signUpService.setCreateAccountMyInfoFormData(data.objectList[0]);
        this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT + this.referralCode]);
      } else if (data.responseMessage.responseCode === 6014) {
        this.closeMyInfoPopup(false);
        const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
        ref.componentInstance.errorTitle = this.loader1Modal.title;
        ref.componentInstance.errorMessageHTML = this.loader1Modal.message;
        ref.componentInstance.primaryActionLabel = this.loader1Modal.btn;
      }
      else {
        this.closeMyInfoPopup(true);
      }
    }, (error) => {
      this.closeMyInfoPopup(true);
    });
  }

  ngOnDestroy(): void {
    if (this.myinfoChangeListener) {
      this.myinfoChangeListener.unsubscribe();
    }
  }

  cancelMyInfo() {
    this.myInfoService.isMyInfoEnabled = false;
    this.closeMyInfoPopup(false);
    if (this.myInfoSubscription) {
      this.myInfoSubscription.unsubscribe();
    }
  }

  closeMyInfoPopup(error: boolean) {
    this.myInfoService.closeMyInfoPopup(false);
    clearTimeout(this.secondTimer);
    if (error) {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
      };
      this.loadingModalRef = this.modal.open(ModelWithButtonComponent, ngbModalOptions);
      this.loadingModalRef.componentInstance.errorTitle = this.loader3Modal.title;
      this.loadingModalRef.componentInstance.errorMessage = this.loader3Modal.message;
      this.loadingModalRef.componentInstance.primaryActionLabel = this.loader3Modal.primaryActionLabel;
      this.loadingModalRef.componentInstance.secondaryActionLabel = this.loader3Modal.secondaryActionLabel;
      this.loadingModalRef.componentInstance.secondaryActionDim = true;
      this.loadingModalRef.componentInstance.secondaryAction.subscribe(() => {
        this.skipMyInfo();
      });
    }
  }

  getMyInfo() {
    this.myInfoService.setMyInfoAttributes(
      this.signUpService.myInfoAttributes
    );
    this.myInfoService.goToMyInfo();
  }

  goBack() {
    this._location.back();
  }

  backToLogin() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
  }

  skipMyInfo() {
    this.signUpService.setMyInfoStatus(false);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT + this.referralCode]);
  }

  proceedToMyInfo() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modelTitle;
    ref.componentInstance.errorMessageHTML = this.modelMessge;
    ref.componentInstance.primaryActionLabel = this.modelBtnText;
    ref.componentInstance.myInfo = true;
    ref.result
      .then(() => {
        this.getMyInfo();
      })
      .catch((e) => { });
  }

  openSecondPopup() {
    this.myInfoService.loadingModalRef.componentInstance.errorMessage = this.loader2Modal.message;
  }
}
