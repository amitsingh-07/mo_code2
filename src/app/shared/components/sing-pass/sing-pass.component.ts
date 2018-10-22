import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentAccountService } from '../../../investment-account/investment-account-service';
import { ErrorModalComponent } from '../../modal/error-modal/error-modal.component';
import { MyInfoService } from '../../Services/my-info.service';

@Component({
  selector: 'app-sing-pass',
  templateUrl: './sing-pass.component.html',
  styleUrls: ['./sing-pass.component.scss']
})
export class SingPassComponent implements OnInit {
  modelTitle: string;
  modelMessge: string;

  constructor(private modal: NgbModal,
              private router: Router,
              private myInfoService: MyInfoService,
              public readonly translate: TranslateService,
              private investmentAccountService: InvestmentAccountService
            ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.modelTitle = this.translate.instant('MYINFO.OPEN_MODAL_DATA.TITLE');
      this.modelMessge = this.translate.instant('MYINFO.OPEN_MODAL_DATA.DESCRIPTION');
    });
  }

  ngOnInit() {
  }

  openModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modelTitle;
    ref.componentInstance.errorMessage = this.modelMessge;
    ref.componentInstance.isButtonEnabled = true;
    ref.result.then(() => {
      this.investmentAccountService.callBackInvestmentAccount = true;
      this.myInfoService.setMyInfoAttributes(this.investmentAccountService.myInfoAttributes);
      //this.myInfoService.goToMyInfo();
      this.router.navigate(['myinfo']);
    }).catch((e) => {
    });
  }

  disableSingPass() {
    return this.investmentAccountService.isSingPassDisabled();
  }
}
