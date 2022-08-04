import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../shared/navbar/navbar.service';
import { MyInfoService } from './../shared/Services/my-info.service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from './../investment/investment-account/investment-account.constant';
import { myInfoResponseMapping } from './test-myinfo-mapping';

@Component({
  selector: 'app-test-my-info',
  templateUrl: './test-my-info.component.html',
  styleUrls: ['./test-my-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestMyInfoComponent implements OnInit {
  testMyInfoForm: FormGroup;
  assetsTotal = 0;
  cpfValue;
  pageTitle: string;
  project: string;
  robo2Results: any;
  myInfoFlow: string;
  myInfoAttributes = [];
  robo2Attributes = INVESTMENT_ACCOUNT_CONSTANTS.MY_INFO_ATTRIBUTES;
  corpBizAttributes = Object.keys(myInfoResponseMapping);
  myInfoResponse: any;

  constructor(
    public navbarService: NavbarService,
    private modal: NgbModal, private myInfoService: MyInfoService,
    public authService: AuthenticationService,
    private translate: TranslateService,
    private route: ActivatedRoute) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Test MyInfo');
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    // Robo2 changes
    this.project = this.route.snapshot.queryParams.project;
    if (this.project === 'robo2') {
      this.myInfoAttributes = this.robo2Attributes;
      this.myInfoFlow = 'robo2';
    } else if (this.project === 'corpbiz') {
      this.myInfoAttributes = this.corpBizAttributes;
      this.myInfoFlow = 'corpbiz';
    } else {
      this.myInfoAttributes.push(this.corpBizAttributes[0]); // Get CPF Balances
      this.myInfoFlow = 'cpf';
    }
    this.authService.authenticate().subscribe((token) => {
    });
    this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '') {
        if (myinfoObj.status && myinfoObj.status === 'SUCCESS' && this.myInfoService.isMyInfoEnabled) {
          // Todo - Robo2 changes
          if (this.project === 'robo') {
            this.closeMyInfoPopup();
            window.opener.postMessage(myinfoObj.authorizeCode, '*');
          } else {
            this.myInfoService.getMyInfoData().subscribe((data) => {
              console.log("MY INFO RESPONSE = " + data);
              if (data && data['objectList']) {
                this.myInfoResponse =data['objectList'][0];
                this.myInfoService.isMyInfoEnabled = false;
                this.closeMyInfoPopup();
                } else {
                  this.closeMyInfoPopup();
                }
            }, (error) => {
              this.closeMyInfoPopup();
            });
         }
        } else {
          this.closeMyInfoPopup();
        }
      }
    });
  }

  getAttributeVal(attribute) {
    if (this.myInfoResponse && attribute) {
      return this.deepGet(myInfoResponseMapping[attribute]);
    } else {
      return 'MyInfo Value';
    }
  }

  closeMyInfoPopup() {
    this.myInfoService.closeFetchPopup();
    if (this.myInfoService.isMyInfoEnabled) {
      this.myInfoService.changeListener.next('');
      this.myInfoService.isMyInfoEnabled = false;
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = 'Oops, Error!';
      ref.componentInstance.errorMessage = 'We weren\'t able to fetch your data from MyInfo.';
      ref.componentInstance.isError = true;
      ref.result.then(() => {
        this.myInfoService.goToMyInfo();
      }).catch((e) => {
      });
    }
  }

  openModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('Leave This Page');
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorMessage = this.translate.instant('You will be redirected to Singpass MyInfo page to begin fetching your data.');
    ref.componentInstance.isButtonEnabled = true;
    ref.result.then(() => {
      this.myInfoService.setMyInfoAttributes(this.myInfoAttributes);
      this.myInfoService.setMyInfoAppId(this.myInfoFlow);
      this.myInfoService.goToMyInfo();
    }).catch((e) => {
    });
  }

  deepGet(keys) {
    if (this.myInfoResponse) {
      return keys.reduce(
        (xs, x) => (xs && xs[x] !== null && xs[x] !== undefined ? xs[x] : "null"),
        this.myInfoResponse
      );
    }
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

}
