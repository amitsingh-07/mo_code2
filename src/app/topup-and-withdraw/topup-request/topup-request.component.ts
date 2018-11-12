
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';


@Component({
  selector: 'app-topup-request',
  templateUrl: './topup-request.component.html',
  styleUrls: ['./topup-request.component.scss']
})
export class TopupRequestComponent implements OnInit {
  formValues;
  topupportfolioamount;
  topupFormValues;
  requestReceivecd = false;
  fundDetails;
  constructor(public readonly translate: TranslateService,
    private router: Router,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public topupAndWithDrawService: TopupAndWithDrawService) {
  }
  ngOnInit() {
    this.topupFormValues = this.topupAndWithDrawService.getTopUp();
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    this.topupportfolioamount = this.topupFormValues.topupportfolioamount;
    if (!(this.fundDetails.topupportfolioamount) && this.fundDetails.Investment === 'One-time Investment') {
      this.requestReceivecd = true;

    } else {
      this.requestReceivecd = false;

    }

  }
  goToNext() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
}
