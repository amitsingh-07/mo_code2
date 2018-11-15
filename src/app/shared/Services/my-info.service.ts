import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../environments/environment';
import { ApiService } from '../http/api.service';
import { ErrorModalComponent } from '../modal/error-modal/error-modal.component';

const MYINFO_ATTRIBUTE_KEY = 'myinfo_person_attributes';

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
  constructor(private modal: NgbModal, private apiService: ApiService) { }

  setMyInfoAttributes(attributes) {
    this.attributes = attributes;
    window.sessionStorage.setItem(MYINFO_ATTRIBUTE_KEY, this.attributes);
  }

  getMyInfoAttributes() {
    return window.sessionStorage.getItem(MYINFO_ATTRIBUTE_KEY);
  }

  goToMyInfo() {
    window.sessionStorage.setItem('currentUrl', window.location.hash);
    const authoriseUrl = this.authApiUrl +
      '?client_id=' + this.clientId +
      '&attributes=' + this.getMyInfoAttributes() +
      '&purpose=' + this.purpose +
      '&state=' + this.state +
      '&redirect_uri=' + this.redirectUrl;
    window.location.href = authoriseUrl;
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
        authorizationCode : this.myInfoValue,
        personAttributes: this.getMyInfoAttributes()
    };
    return this.apiService.getMyInfoData(code);
}
}
