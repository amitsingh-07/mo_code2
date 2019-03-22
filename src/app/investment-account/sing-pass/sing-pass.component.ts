import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService, IConfig } from 'src/app/config/config.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS, MY_INFO_START_PATH } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-sing-pass',
  templateUrl: './sing-pass.component.html',
  styleUrls: ['./sing-pass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingPassComponent implements OnInit {
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

  constructor(
    private configService: ConfigService,
    private modal: NgbModal,
    private router: Router,
    private myInfoService: MyInfoService,
    public readonly translate: TranslateService,
    private investmentAccountService: InvestmentAccountService
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
    });
  }

  ngOnInit() {
    this.showConfirmation = false;
    this.investmentData = this.investmentAccountService.getInvestmentAccountFormData();
    this.showSingPass = this.investmentData.isMyInfoEnabled ? false : true;
    this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '') {
        if (myinfoObj.status && myinfoObj.status === 'SUCCESS' && this.myInfoService.isMyInfoEnabled) {
          this.getMyInfoData();
        } else if (myinfoObj.status && myinfoObj.status === 'CANCELLED') {
          this.cancelMyInfo();
        } else {
          this.myInfoService.closeMyInfoPopup(false);
        }
      }
    });
  }

  cancelMyInfo() {
    this.myInfoService.isMyInfoEnabled = false;
    this.myInfoService.closeMyInfoPopup(false);
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
      ref.componentInstance.warningIcon = true;
    } else {
      ref.componentInstance.errorTitle = this.modelTitle1;
      ref.componentInstance.errorMessageHTML = this.modelMessge1;
      ref.componentInstance.primaryActionLabel = this.modelBtnText1;
    }
    ref.result
      .then(() => {
        this.showConfirmation = true;
      })
      .catch((e) => { });
  }

  getMyInfoData() {
    this.myInfoSubscription = this.myInfoService.getMyInfoData().subscribe((data) => {
      if (data && data.objectList[0]) {
        this.investmentAccountService.setMyInfoFormData(data.objectList[0]);
        this.myInfoService.isMyInfoEnabled = false;
        this.myInfoService.closeMyInfoPopup(false);
        if (window.location.href === window.location.origin + MY_INFO_START_PATH) {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.POSTLOGIN], { skipLocationChange: true }).then(() => {
            window.location.href = window.location.origin + MY_INFO_START_PATH;
          });
        } else {
          window.location.href = window.location.origin + MY_INFO_START_PATH;
        }
      } else {
        this.myInfoService.closeMyInfoPopup(true);
      }
    }, (error) => {
      this.myInfoService.closeMyInfoPopup(true);
    });
  }

  getMyInfo() {
    this.showConfirmation = false;
    this.investmentAccountService.setCallBackInvestmentAccount();
    this.myInfoService.setMyInfoAttributes(
      this.investmentAccountService.myInfoAttributes
    );
    this.myInfoService.goToMyInfo();
  }
}
