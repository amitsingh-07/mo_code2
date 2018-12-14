import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-sing-pass',
  templateUrl: './sing-pass.component.html',
  styleUrls: ['./sing-pass.component.scss']
})
export class SingPassComponent implements OnInit {
  @Input('label') label;
  @Input('position') position;
  modelTitle: string;
  modelMessge: string;
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
    });
  }

  ngOnInit() {
    this.showConfirmation = false;
    this.investmentData = this.investmentAccountService.getInvestmentAccountFormData();
    this.showSingPass = this.investmentData.isMyInfoEnabled ? false : true;
  }

  openModal() {
    if (this.investmentData.nationality) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.modelTitle;
      ref.componentInstance.errorDescription = this.modelMessge;
      ref.componentInstance.isButtonEnabled = true;
      ref.result.then(() => {
        this.showConfirmation = true;
      }).catch((e) => {
      });
    } else {
      this.showConfirmation = true;
    }
  }

  getMyInfo() {
    this.showConfirmation = false;
    this.investmentAccountService.setCallBackInvestmentAccount();
    this.myInfoService.setMyInfoAttributes(this.investmentAccountService.myInfoAttributes);
    //this.myInfoService.goToMyInfo();
    //Todo - Hard coded UAT path for testing
    window.location.href = 'https://bfa-uat.ntucbfa.com/#/9462test-myinfo?project=robo2';
  }
}
