import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../environments/environment';
import { ApiService } from '../http/api.service';
import { ErrorModalComponent } from '../modal/error-modal/error-modal.component';
import { GuideMeService } from './../../guide-me/guide-me.service';

const MYINFO_ATTRIBUTE_KEY = 'myinfo_person_attributes';
declare var window: Window;

@Injectable({
  providedIn: 'root'
})
export class MyInfoService {
  authApiUrl = environment.myInfoAuthorizeUrl;
  clientId = environment.myInfoClientId;
  private attributes = '';
  purpose = 'demonstrating MyInfo APIs';
  redirectUrl = environment.myInfoCallbackBaseUrl;
  state = Math.floor(100 + Math.random() * 90);
  myInfoValue: any;
  loadingModalRef: NgbModalRef;
  isMyInfoEnabled = false;
  constructor(
    private modal: NgbModal, private apiService: ApiService, private router: Router) { }

  setMyInfoAttributes(attributes) {
    this.attributes = attributes;
    window.sessionStorage.setItem(MYINFO_ATTRIBUTE_KEY, this.attributes);
  }

  getMyInfoAttributes() {
    return window.sessionStorage.getItem(MYINFO_ATTRIBUTE_KEY);
  }

  goToMyInfo() {
    window.sessionStorage.setItem('currentUrl', window.location.hash.split(';')[0]);
    const authoriseUrl = this.authApiUrl +
      '?client_id=' + this.clientId +
      '&attributes=' + this.getMyInfoAttributes() +
      '&purpose=' + this.purpose +
      '&state=' + this.state +
      '&redirect_uri=' + this.redirectUrl;
    //window.location.href = authoriseUrl;
    this.newWindow(authoriseUrl);
  }

  newWindow(authoriseUrl): void {
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const left = 0;
    const top = 0;
    // tslint:disable-next-line:max-line-length
    const windowRef: Window = window.open(authoriseUrl, 'SingPass', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + screenWidth + ', height=' + screenHeight + ', top=' + top + ', left=' + left);

    const timer = setInterval(() => {
      if (windowRef.closed) {
        clearInterval(timer);
        this.router.navigate(
          [window.sessionStorage.getItem('currentUrl').substring(2), { myinfo: 'FAILED', time: new Date().getTime() }
          ]);
      }
    }, 500);

    window.failed = (value) => {
      clearInterval(timer);
      window.failed = () => null;
      windowRef.close();
      if (value === 'FAILED') {
        this.router.navigate(
          [window.sessionStorage.getItem('currentUrl').substring(2), { myinfo: 'FAILED', time: new Date().getTime() }
          ]);
      }
      return 'MY_INFO';
    };

    window.success = (values) => {
      clearInterval(timer);
      window.success = () => null;
      windowRef.close();
      const params = new HttpParams({ fromString: values });
      if (window.sessionStorage.currentUrl && params && params.get('code')) {
        if (this.myInfoValue) {
          this.isMyInfoEnabled = false;
        } else {
          this.isMyInfoEnabled = true;
          const myInfoAuthCode = params.get('code');
          this.setMyInfoValue(myInfoAuthCode);
          this.router.navigate(
            [window.sessionStorage.getItem('currentUrl').substring(2), { myinfo: 'SUCCESS', time: new Date().getTime() }
            ]);
        }
      } else {
        this.router.navigate(
          [window.sessionStorage.getItem('currentUrl').substring(2), { myinfo: 'FAILED', time: new Date().getTime() }
          ]);
      }
      return 'MY_INFO';
    };
  }

  openFetchPopup() {
    this.loadingModalRef = this.modal.open(ErrorModalComponent, { centered: true });
    this.loadingModalRef.componentInstance.errorTitle = 'Fetching Data...';
    this.loadingModalRef.componentInstance.errorMessage = 'Please be patient while we fetch your required data from MyInfo.';
  }

  closeFetchPopup() {
    this.loadingModalRef.close();
  }

  closeMyInfoPopup(error: boolean) {
    this.closeFetchPopup();
    if (error) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = 'Oops, Error!';
      ref.componentInstance.errorMessage = 'We weren\'t able to fetch your data from MyInfo.';
      ref.componentInstance.isError = true;
      ref.result.then(() => {
        this.goToMyInfo();
      }).catch((e) => {
      });
    }
  }

  setMyInfoValue(code) {
    this.myInfoValue = code;
  }

  getMyInfoData() {
    const code = {
      authorizationCode: this.myInfoValue,
      personAttributes: this.getMyInfoAttributes()
    };
    return this.apiService.getMyInfoData(code);
  }
}
