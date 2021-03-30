import { Component, Input, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SIGN_UP_ROUTE_PATHS, MY_INFO_START_PATH } from '../sign-up.routes.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigService, IConfig } from '../../config/config.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { SignUpService } from '../sign-up.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';

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
  modelTitle1: string;
  modelMessge1: string;
  modelBtnText1: string;
  showSingPass: boolean;
  createAccountData: any;
  myInfoSubscription: any;
  isInvestmentMyInfoEnabled = false;
  myinfoChangeListener: Subscription;
  secondTimer: any;
  thirdTimer: any;
  loader2StartTime: any;
  loader3StartTime: any;
  loader2Modal: any;
  loader3Modal: any;
  loader1Modal: any;
  referralParams = {};
  referralCode = '';

  constructor(
    private configService: ConfigService,
    private modal: NgbModal,
    private router: Router,
    private _location: Location,
    private myInfoService: MyInfoService,
    public readonly translate: TranslateService,
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    private ngZone: NgZone,
    private route: ActivatedRoute
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
      this.isInvestmentMyInfoEnabled = config.investmentMyInfoEnabled;
      this.loader2StartTime = config.investment.myInfoLoader2StartTime * 1000;
      this.loader3StartTime = config.investment.myInfoLoader3StartTime * 1000;
    });
  }

  showFetchPopUp() {
    this.secondTimer = setTimeout(() => {
      if (this.myInfoService.loadingModalRef) {
        this.openSecondPopup();
      }
    }, this.loader2StartTime);

    this.thirdTimer = setTimeout(() => {
      if (this.myInfoService.loadingModalRef) {
        this.openThirdPopup();
      }
    }, this.loader3StartTime);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['referral_code']) {
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
  }
  getMyInfoAccountCreateData() {
    this.showFetchPopUp();
    this.myInfoSubscription = this.myInfoService.getMyInfoAccountCreateData().subscribe((data) => {
      console.log(data + "success1");
      if (data.responseMessage.responseCode === 6000 && data && data.objectList[0]) {
        console.log(data + "success2");
        console.log(data.responseMessage.responseCode + ' ' + data.objectList[0] + "  " + data);
        this.signUpService.setCreateAccountMyInfoFormData(data.objectList[0])
        this.myInfoService.isMyInfoEnabled = false;
        this.closeMyInfoPopup(false);
        this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT + this.referralCode]);
      } else if (data.responseMessage.responseCode === 6014) {
        this.closeMyInfoPopup(false);
        const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
        ref.componentInstance.errorTitle = this.loader1Modal.title;
        ref.componentInstance.errorMessageHTML = this.loader1Modal.message;
        ref.componentInstance.primaryActionLabel = this.loader1Modal.btn;
        this.myInfoService.loadingModalRef.componentInstance.primaryAction.subscribe(() => {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT_MY_INFO], { queryParams: this.referralParams });
        })
      }
      else {
        this.closeMyInfoPopup(true);
        console.log(data + "success3");
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
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
  }

  closeMyInfoPopup(error: boolean) {
    this.myInfoService.closeMyInfoPopup(error);
    clearTimeout(this.secondTimer);
    clearTimeout(this.thirdTimer);
  }

  getMyInfo() {
    this.signUpService.setCallBackSignUp();
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
    this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT + this.referralCode]);
  }

  proceedToMyInfo() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modelTitle;
    ref.componentInstance.errorMessageHTML = this.modelMessge;
    ref.componentInstance.primaryActionLabel = this.modelBtnText;
    ref.componentInstance.lockIcon = true;
    ref.componentInstance.myInfo = true;
    ref.result
      .then(() => {
        this.getMyInfo();
      })
      .catch((e) => { });
  }

  openSecondPopup() {
    this.myInfoService.loadingModalRef.componentInstance.errorMessage = this.loader2Modal.message;
    this.myInfoService.loadingModalRef.componentInstance.primaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
    });
  }


  openThirdPopup() {
    this.myInfoService.loadingModalRef.componentInstance.errorMessage = this.loader3Modal.message;
    this.myInfoService.loadingModalRef.componentInstance.primaryActionLabel = this.loader3Modal.primaryActionLabel;
    this.myInfoService.loadingModalRef.componentInstance.secondaryActionLabel = this.loader3Modal.secondaryActionLabel;
    this.myInfoService.loadingModalRef.componentInstance.secondaryActionDim = true;
    this.myInfoService.loadingModalRef.componentInstance.primaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
      this.proceedToMyInfo();
    });
    this.myInfoService.loadingModalRef.componentInstance.secondaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
     this.signUpService.setMyInfoStatus(false);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT + this.referralCode]);
    });
  }

}
