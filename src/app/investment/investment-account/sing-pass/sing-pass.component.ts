import { Component, Input, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { ConfigService, IConfig } from '../../../config/config.service';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { MyInfoService } from '../../../shared/Services/my-info.service';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS, MY_INFO_START_PATH
} from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-sing-pass',
  templateUrl: './sing-pass.component.html',
  styleUrls: ['./sing-pass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingPassComponent implements OnInit, OnDestroy {
  @Input('label') label;
  @Input('position') position;
  modelTitle: string;
  modelMessge: string;
  modelBtnText: string;
  modelTitle1: string;
  modelMessge1: string;
  modelBtnText1: string;
  showConfirmation: boolean;
  showSingPass: boolean;
  investmentData: any;
  myInfoSubscription: any;
  isInvestmentMyInfoEnabled = false;
  myinfoChangeListener: Subscription;
  secondTimer: any;
  thirdTimer: any;
  loader2StartTime: any;
  loader3StartTime: any;

  constructor(
    private configService: ConfigService,
    private modal: NgbModal,
    private router: Router,
    private myInfoService: MyInfoService,
    public readonly translate: TranslateService,
    private investmentAccountService: InvestmentAccountService,
    private ngZone: NgZone
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.modelTitle = this.translate.instant(
        'INVESTMENT_ACCOUNT_MYINFO.OPEN_MODAL_DATA.TITLE'
      );
      this.modelMessge = this.translate.instant(
        'INVESTMENT_ACCOUNT_MYINFO.OPEN_MODAL_DATA.DESCRIPTION'
      );
      this.modelBtnText = this.translate.instant(
        'INVESTMENT_ACCOUNT_MYINFO.OPEN_MODAL_DATA.BTN-TEXT'
      );
      this.modelTitle1 = this.translate.instant(
        'INVESTMENT_ACCOUNT_MYINFO.MYINFO_CONFIRM.TITLE'
      );
      this.modelMessge1 = this.translate.instant(
        'INVESTMENT_ACCOUNT_MYINFO.MYINFO_CONFIRM.DESCRIPTION'
      );
      this.modelBtnText1 = this.translate.instant(
        'INVESTMENT_ACCOUNT_MYINFO.MYINFO_CONFIRM.BTN-TEXT'
      );
    });
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isInvestmentMyInfoEnabled = config.investmentMyInfoEnabled;
      this.loader2StartTime = config.investment.myInfoLoader2StartTime * 1000;
      this.loader3StartTime = config.investment.myInfoLoader3StartTime * 1000;
    });
  }

  ngOnInit() {
    this.showConfirmation = false;
    this.investmentData = this.investmentAccountService.getInvestmentAccountFormData();
    this.showSingPass = this.investmentData.isMyInfoEnabled ? false : true;
    this.myinfoChangeListener = this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '' &&
        this.myInfoService.getMyInfoAttributes() === this.investmentAccountService.myInfoAttributes.join()) {
        if (myinfoObj.status && myinfoObj.status === 'SUCCESS' && this.myInfoService.isMyInfoEnabled) {
          this.getMyInfoData();
        } else if (myinfoObj.status && myinfoObj.status === 'CANCELLED') {
          this.cancelMyInfo();
        } else {
          this.closeMyInfoPopup(false);
        }
      }
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

  openModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    if (this.investmentData.nationality) {
      ref.componentInstance.errorTitle = this.modelTitle;
      ref.componentInstance.errorMessageHTML = this.modelMessge;
      ref.componentInstance.primaryActionLabel = this.modelBtnText;
      ref.componentInstance.lockIcon = true;
    } else {
      ref.componentInstance.errorTitle = this.modelTitle1;
      ref.componentInstance.errorMessageHTML = this.modelMessge1;
      ref.componentInstance.primaryActionLabel = this.modelBtnText1;
      ref.componentInstance.lockIcon = true;
    }
    ref.result
      .then(() => {
        this.getMyInfo();
      })
      .catch((e) => { });
  }

  getMyInfoData() {
    this.showFetchPopUp();
    this.myInfoSubscription = this.myInfoService.getMyInfoData().subscribe((data) => {
      if (data && data.objectList[0]) {
        this.investmentAccountService.setMyInfoFormData(data.objectList[0]);
        this.myInfoService.isMyInfoEnabled = false;
        this.closeMyInfoPopup(false);
        const currentUrl = window.location.toString();
        const rootPoint = currentUrl.split(currentUrl.split('/')[4])[0].substr(0, currentUrl.split(currentUrl.split('/')[4])[0].length - 1);
        const redirectObjective = rootPoint + MY_INFO_START_PATH;
        if (window.location.href === redirectObjective) {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.START]);
        } else {
          this.ngZone.run(() => {
            this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
          });
        }
      } else {
        this.closeMyInfoPopup(true);
      }
    }, (error) => {
      this.closeMyInfoPopup(true);
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

  closeMyInfoPopup(error: boolean) {
    this.myInfoService.closeMyInfoPopup(error);
    clearTimeout(this.secondTimer);
    clearTimeout(this.thirdTimer);
  }

  getMyInfo() {
    this.showConfirmation = false;
    this.investmentAccountService.setCallBackInvestmentAccount();
    this.myInfoService.setMyInfoAttributes(
      this.investmentAccountService.myInfoAttributes
    );
    this.myInfoService.goToMyInfo();
  }

  // ******** SECOND POP UP ********//
  openSecondPopup() {
    this.myInfoService.loadingModalRef.componentInstance.spinner = true;
    this.myInfoService.loadingModalRef.componentInstance.closeBtn = true;
    this.myInfoService.loadingModalRef.componentInstance.errorTitle = 'Fetching Data...';
    this.myInfoService.loadingModalRef.componentInstance.errorMessage = 'Sorry that this is taking longer than usual. Please be patient while we fetch your required data from MyInfo.';
    this.myInfoService.loadingModalRef.componentInstance.primaryActionLabel = 'Cancel';
    this.myInfoService.loadingModalRef.componentInstance.primaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
    });
  }

  // ******** THIRD POP UP ********//
  openThirdPopup() {
    this.myInfoService.loadingModalRef.componentInstance.spinner = true;
    this.myInfoService.loadingModalRef.componentInstance.closeBtn = true;
    this.myInfoService.loadingModalRef.componentInstance.errorTitle = 'Fetching Data...';
    this.myInfoService.loadingModalRef.componentInstance.errorMessage = 'We are still trying to fetch your required data from MyInfo. You may choose to fill in your information manually or try again later.';
    this.myInfoService.loadingModalRef.componentInstance.primaryActionLabel = 'Try Again Later';
    this.myInfoService.loadingModalRef.componentInstance.secondaryActionLabel = 'Create Account Manually';
    this.myInfoService.loadingModalRef.componentInstance.secondaryActionDim = true;
    this.myInfoService.loadingModalRef.componentInstance.primaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
    this.myInfoService.loadingModalRef.componentInstance.secondaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
    });
  }
}
