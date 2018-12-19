import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { InvestmentAccountService } from '../investment-account-service';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';

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

  constructor(private modal: NgbModal,
              private router: Router,
              private myInfoService: MyInfoService,
              public readonly translate: TranslateService,
              private investmentAccountService: InvestmentAccountService
            ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.modelTitle = this.translate.instant('INVESTMENT_ACCOUNT_MYINFO.OPEN_MODAL_DATA.TITLE');
      this.modelMessge = this.translate.instant('INVESTMENT_ACCOUNT_MYINFO.OPEN_MODAL_DATA.DESCRIPTION');
      this.modelBtnText = this.translate.instant('INVESTMENT_ACCOUNT_MYINFO.OPEN_MODAL_DATA.BTN-TEXT');
      this.modelTitle1 = this.translate.instant('INVESTMENT_ACCOUNT_MYINFO.MYINFO_CONFIRM.TITLE');
      this.modelMessge1 = this.translate.instant('INVESTMENT_ACCOUNT_MYINFO.MYINFO_CONFIRM.DESCRIPTION');
      this.modelBtnText1 = this.translate.instant('INVESTMENT_ACCOUNT_MYINFO.MYINFO_CONFIRM.BTN-TEXT');
    });
  }

  ngOnInit() {
    this.showConfirmation = false;
    this.investmentData = this.investmentAccountService.getInvestmentAccountFormData();
    this.showSingPass = this.investmentData.isMyInfoEnabled ? false : true;
  }

  openModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    if (this.investmentData.nationality) {
      ref.componentInstance.errorTitle = this.modelTitle;
      ref.componentInstance.errorMessageHTML = this.modelMessge;
      ref.componentInstance.primaryActionLabel = this.modelBtnText;
    } else {
      ref.componentInstance.errorTitle = this.modelTitle1;
      ref.componentInstance.errorMessageHTML = this.modelMessge1;
      ref.componentInstance.primaryActionLabel = this.modelBtnText1;
    }
    ref.result.then(() => {
      this.showConfirmation = true;
    }).catch((e) => {
    });
  }

  getMyInfo() {
    this.showConfirmation = false;
    this.investmentAccountService.setCallBackInvestmentAccount();
    this.myInfoService.setMyInfoAttributes(this.investmentAccountService.myInfoAttributes);
    // this.myInfoService.goToMyInfo();
    // Todo - Robo2 Hard coded UAT1 path for testing
    this.myInfoService.goToUAT1MyInfo();
  }
}
