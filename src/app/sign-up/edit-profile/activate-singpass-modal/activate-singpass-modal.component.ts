import { Component, Input, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { ConfigService, IConfig } from '../../../config/config.service';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { MyInfoService } from '../../../shared/Services/my-info.service';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS, MY_INFO_START_PATH
} from '../../../investment/investment-account//investment-account-routes.constants';
import { InvestmentAccountService } from '../../../investment/investment-account/investment-account-service';
@Component({
  selector: 'app-activate-singpass-modal',
  templateUrl: './activate-singpass-modal.component.html',
  styleUrls: ['./activate-singpass-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivateSingpassModalComponent implements OnInit, OnDestroy {
  @Input('label') label;
  @Input('position') position;
  @Input() errorMessage: any;
  @Input() errorMessageHTML: any;
  @Input() primaryActionLabel: any;
  @Input() secondaryActionLabel: any;
  @Input() isLinked: boolean;
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
  loader2Modal: any;
  loader3Modal: any;
  loadingModalRef: NgbModalRef;
  errorModalTitle: string;
  errorModalMessage: string;
  errorModalBtnText: string;
  myInfoStatus1: string;
  myInfoStatus2: string;
  isMyInfoEnabled = false;
  
  constructor(
    public activeModal: NgbActiveModal,
    private configService: ConfigService,
    private modal: NgbModal,
    private router: Router,
    private titleCasePipe: TitleCasePipe,
    private myInfoService: MyInfoService,
    public readonly translate: TranslateService,
    private investmentAccountService: InvestmentAccountService,
    private ngZone: NgZone
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.modelTitle1 = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.MYINFO_CONFIRM.TITLE'
      );
      this.modelMessge1 = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.MYINFO_CONFIRM.DESCRIPTION'
      );
      this.modelBtnText1 = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.MYINFO_CONFIRM.BTN-TEXT'
      );
      this.loader2Modal = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.LOADER2'
      );
      this.loader3Modal = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.LOADER3'
      );
      this.errorModalTitle = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.ERROR_MODAL.TITLE'
      );
      this.errorModalMessage = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.ERROR_MODAL.MESSAGE'
      );
      this.errorModalBtnText = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.ERROR_MODAL.BTN-TEXT'
      );
      this.myInfoStatus1 = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.MYINFO_STATUS.SUCCESS'
      );
      this.myInfoStatus2 = this.translate.instant(
        'LINK_ACCOUNT_MYINFO.MYINFO_STATUS.CANCELLED'
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
        this.myInfoService.getMyInfoAttributes() === this.investmentAccountService.myInfoLinkAttributes.join()) {
        if (myinfoObj.status && myinfoObj.status === this.myInfoStatus1 && this.myInfoService.isMyInfoEnabled) {
          this.getMyInfoData();
        } else if (myinfoObj.status && myinfoObj.status === this.myInfoStatus2) {
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
    this.activeModal.close();
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modelTitle1;
    ref.componentInstance.errorMessageHTML = this.modelMessge1;
    ref.componentInstance.primaryActionLabel = this.modelBtnText1;
    ref.componentInstance.lockIcon = true;
    ref.componentInstance.myInfo = true;
    ref.result
      .then(() => {
        this.getMyInfo();
      })
      .catch((e) => { });
  }

  getMyInfoData() {
    this.showFetchPopUp();
    this.myInfoSubscription = this.myInfoService.getSingpassAccountData().subscribe((data) => {
      if (data && data.objectList[0]) {
        this.closeMyInfoPopup(false);
        if(data.responseMessage.responseCode === 6000){
          this.ngZone.run(() => {
            this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
          });
          const ref = this.modal.open(ActivateSingpassModalComponent, { centered: true , windowClass: 'linked-singpass-modal' });
          ref.componentInstance.errorMessage = this.translate.instant(
            'SUCCESS_SINGPASS_MODAL.MESSAGE', 
            { name: this.titleCasePipe.transform(data.objectList[0].name.value), nric: data.objectList[0].uin.toUpperCase() }
          );
          ref.componentInstance.secondaryActionLabel = this.translate.instant(
            'SUCCESS_SINGPASS_MODAL.BTN_TXT'
          );
          ref.componentInstance.isLinked = true;
        }
        else if (data.responseMessage.responseCode === 6014) {
          const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant(
            'LINK_ACCOUNT_MYINFO.ALREADY_EXISTING.TITLE'
          );
          ref.componentInstance.errorMessage = this.translate.instant(
            'LINK_ACCOUNT_MYINFO.ALREADY_EXISTING.DESC'
          );
          ref.componentInstance.primaryActionLabel = this.translate.instant(
            'LINK_ACCOUNT_MYINFO.ALREADY_EXISTING.BTN-TEXT'
          );
        }
        else if(data.responseMessage.responseCode === 6015){
          const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant(
            'LINK_ACCOUNT_MYINFO.DIFFERENT_USER.TITLE'
          );
          ref.componentInstance.errorMessage = this.translate.instant(
            'LINK_ACCOUNT_MYINFO.DIFFERENT_USER.DESC'
          );
          ref.componentInstance.primaryActionLabel = this.translate.instant(
            'LINK_ACCOUNT_MYINFO.DIFFERENT_USER.BTN-TEXT'
          );
        }
        else{
          this.closeMyInfoPopup(false);
        }
      } else {
        this.closeMyInfoPopup(false);
      }
    }, (error) => {
      this.closeMyInfoPopup(false);
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

  closeFetchPopup() {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
    }
  }

  closeMyInfoPopup(error: boolean) {
    this.isMyInfoEnabled = false;
    this.closeFetchPopup();
    if (error) {
      const ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
      };
      this.loadingModalRef = this.modal.open(ModelWithButtonComponent, ngbModalOptions);
      this.loadingModalRef.componentInstance.errorTitle = this.errorModalTitle;
      this.loadingModalRef.componentInstance.errorMessage = this.errorModalMessage;
      this.loadingModalRef.componentInstance.primaryActionLabel = this.errorModalBtnText;
      this.myInfoService.closeMyInfoPopup(error);
      clearTimeout(this.secondTimer);
      clearTimeout(this.thirdTimer);
    }
  }

  getMyInfo() {
    this.showConfirmation = false;
    this.myInfoService.setMyInfoAttributes(
      this.investmentAccountService.myInfoLinkAttributes
    );
    this.myInfoService.goToMyInfo(true);
  }

  // ******** SECOND POP UP ********//
  openSecondPopup() {
    this.myInfoService.loadingModalRef.componentInstance.errorMessage = this.loader2Modal.message;
    this.myInfoService.loadingModalRef.componentInstance.primaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
    });
  }

  // ******** THIRD POP UP ********//
  openThirdPopup() {
    this.myInfoService.loadingModalRef.componentInstance.errorMessage = this.loader3Modal.message;
    this.myInfoService.loadingModalRef.componentInstance.primaryActionLabel = this.loader3Modal.primaryActionLabel;
    this.myInfoService.loadingModalRef.componentInstance.secondaryActionLabel = this.loader3Modal.secondaryActionLabel;
    this.myInfoService.loadingModalRef.componentInstance.secondaryActionDim = true;
    this.myInfoService.loadingModalRef.componentInstance.primaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
    this.myInfoService.loadingModalRef.componentInstance.secondaryAction.subscribe(() => {
      this.closeMyInfoPopup(false);
      this.investmentAccountService.setMyInfoStatus(false);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
    });
  }
}
