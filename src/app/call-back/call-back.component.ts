import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';

import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment/investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../investment/investment-account/investment-account-service';
import { MyInfoService } from '../shared/Services/my-info.service';
import { SIGN_UP_ROUTES } from '../sign-up/sign-up.routes.constants';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class CallBackComponent implements OnInit {

  data: any;
  myInfoSubscription: any;
  constructor(
    private router: Router, private route: ActivatedRoute,
    private myInfoService: MyInfoService,
    private investmentAccountService: InvestmentAccountService,
    private zone: NgZone
  ) { }

  ngOnInit() {
     if (window.sessionStorage.currentUrl && this.route.queryParams['value'] && this.route.queryParams['value']['code']) {
      this.myInfoService.openFetchPopup();
      this.myInfoService.isMyInfoEnabled = true;
      this.data = this.route.queryParams['value'];
      this.myInfoService.setMyInfoValue(this.data.code);
      // Investment account
      if (this.investmentAccountService.getCallBackInvestmentAccount()) {
        this.myInfoSubscription = this.myInfoService.getMyInfoData().subscribe((data) => {
          this.investmentAccountService.setMyInfoFormData(data.objectList[0]);
          this.myInfoService.isMyInfoEnabled = false;
          this.myInfoService.closeMyInfoPopup(false);
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
          this.investmentAccountService.setCallBackInvestmentAccount(false);
        }, (error) => {
          this.myInfoService.closeMyInfoPopup(true);
          this.router.navigate([window.sessionStorage.getItem('currentUrl')]);
          this.investmentAccountService.setCallBackInvestmentAccount(false);
        });
      } else {
        this.router.navigate([window.sessionStorage.getItem('currentUrl')]).then(() => {
          if (window.sessionStorage.getItem('currentUrl').includes(SIGN_UP_ROUTES.EDIT_PROFILE)) {
            this.myInfoService.openFetchPopup(true);
          } else {
            this.myInfoService.openFetchPopup();
          }
          this.zone.run(() => {
            setTimeout(() => {
              this.myInfoService.status = 'SUCCESS';
              this.myInfoService.changeListener.next(this.myInfoService.getMyinfoReturnMessage(1, this.data.code));
            }, 500);
          });
        });
      }
    } else {
      this.router.navigate([window.sessionStorage.getItem('currentUrl')]);
    }

    // Cancel MyInfo
    this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '') {
        if (myinfoObj.status && myinfoObj.status === 'CANCELLED' && this.myInfoService.isMyInfoEnabled) {
          this.cancelMyInfo();
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
    if (window.sessionStorage.currentUrl) {
      this.router.navigate([window.sessionStorage.getItem('currentUrl').substring(2)]);
    } else {
      this.router.navigate(['home']);
    }
  }
}
