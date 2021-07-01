import { Component, EventEmitter, OnInit,  Output, ViewEncapsulation } from '@angular/core';
import {  Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';
import { ComprehensiveService } from './../comprehensive.service';
@Component({
  selector: 'app-payment-instructions',
  templateUrl: './payment-instructions.component.html',
  styleUrls: ['./payment-instructions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentInstructionsComponent implements OnInit {
  toastMsg: any;
  showFixedToastMessage: boolean;
  addTopMargin: boolean;
  // @Output() showCopyToast: EventEmitter<any> = new EventEmitter();
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private comprehensiveService: ComprehensiveService
  ) { }

  ngOnInit(): void { }
  getQrCodeImg() {
    return document.getElementsByTagName('base')[0].href + 'assets/images/comprehensive/qrcode.png';
  }

  // notify(event) {
  //   const toasterMsg = {
  //     desc: this.translate.instant('TRANSFER_INSTRUCTION.COPIED')
  //   };
  //   // this.showCopyToast.emit(toasterMsg);
  //   this.toastMsg = toasterMsg;
  //   this.showFixedToastMessage = true;
  //   this.hideToastMessage();
  // }

  // hideToastMessage() {
  //   setTimeout(() => {
  //     this.showFixedToastMessage = false;
  //     this.toastMsg = null;
  //   }, 3000);
  // }

  backToDashboard() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
  

  notify(event) {
    this.addTopMargin = true;
    const toasterMsg = {
      desc: this.translate.instant('TRANSFER_INSTRUCTION.COPIED')
    };
    this.toastMsg = toasterMsg;
    this.showFixedToastMessage = true;
    this.hideToastMessage();
  }

  hideToastMessage() {
    setTimeout(() => {
      this.showFixedToastMessage = false;
      this.toastMsg = null;
      this.addTopMargin = true;
    }, 3000);
  }
}
