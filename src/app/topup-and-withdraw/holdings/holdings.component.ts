import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { FundDetails } from '../fund-your-account/fund-details';
import { TopUpAndWithdrawFormData } from '../topup-and-withdraw-form-data';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class HoldingsComponent implements OnInit {
  pageTitle: string;
  holidings;
  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    private modal: NgbModal,

    public topupAndWithDrawService: TopupAndWithDrawService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('HOLDINGS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarDirectGuided(true);
    this.navbarService.setNavbarMode(2);
    this.holidings = this.topupAndWithDrawService.getHoldingValues();
    this.holidings = [
      {
          "productName": "Discretionary Cash Account(SGD)",
          "productCode": null,
          "productType": "CA",
          "availableUnits": null,
          "investmentAmount": null,
          "indicativePrice": null,
          "currentValue": 2000.0,
          "profit": null,
          "nav": "2323",
          "additionalProperties": {}
      },
      {
          "productName": "Dimensional Global Core Equity Acc SGD",
          "productCode": "DIM034",
          "productType": "UT",
          "availableUnits": 140.15,
          "investmentAmount": 200.0,
          "indicativePrice": 1.43,
          "currentValue": 200.0,
          "profit": 0.0,
          "additionalProperties": {}
      },
      {
          "productName": "Dimensional Global Short-Term Investment Grade Fixed Income Acc SGD-H",
          "productCode": "DIM036",
          "productType": "UT",
          "availableUnits": 280.31,
          "investmentAmount": 400.0,
          "indicativePrice": 1.43,
          "currentValue": 400.0,
          "profit": 0.0,
          "additionalProperties": {}
      },
      {
          "productName": "Dimensional Global Short Fixed Income Acc SGD-H",
          "productCode": "DIM035",
          "productType": "UT",
          "availableUnits": 280.31,
          "investmentAmount": 400.0,
          "indicativePrice": 1.43,
          "currentValue": 400.0,
          "profit": 0.0,
          "additionalProperties": {}
      },
      {
          "productName": "Transaction In Transition",
          "productCode": null,
          "productType": "-",
          "availableUnits": null,
          "investmentAmount": 0.0,
          "indicativePrice": null,
          "currentValue": 11400.0,
          "profit": null,
          "additionalProperties": {}
      }
  ];
    console.log(this.holidings);
  }
}
