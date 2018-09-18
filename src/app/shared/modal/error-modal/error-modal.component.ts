import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorModalComponent implements OnInit {
  @Input() errorTitle: any;
  @Input() errorMessage: any;
  @Input() errorMessageList: string[];
  @Input() showErrorButton: boolean;
  @Input() errorDescription: any;
  @Input() isButtonEnabled: boolean;
  @Input() isError: boolean;
  authApiUrl = 'https://myinfosgstg.api.gov.sg/dev/v1/authorise';
  clientId = 'STG2-MYINFO-SELF-TEST';
  attributes = 'name,sex,race,nationality,dob,email,mobileno,regadd,housingtype,hdbtype,marital,edulevel';
  purpose = 'demonstrating MyInfo APIs';
  redirectUrl = 'http://localhost:3001/callback';
  state = '123';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  goToMyInfo() {
    const authoriseUrl = this.authApiUrl +
        '?client_id=' + this.clientId +
        '&attributes=' + this.attributes +
        '&purpose=' + this.purpose +
        '&state=' + this.state +
        '&redirect_uri=' + this.redirectUrl;
    window.location.href = authoriseUrl;
  }
}
