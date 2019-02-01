import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  selector: 'app-withdrawal-success',
  templateUrl: './withdrawal-success.component.html',
  styleUrls: ['./withdrawal-success.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WithdrawalSuccessComponent implements OnInit {
  formValues;
  topupportfolioamount;
  topupFormValues;
  requestReceivecd;
  fundDetails;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public topupAndWithDrawService: TopupAndWithDrawService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {}
  goToNext() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
}
