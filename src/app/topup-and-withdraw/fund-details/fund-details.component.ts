import { CurrencyPipe, Location } from '@angular/common';
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
import { TopUpAndWithdrawFormData } from '../topup-and-withdraw-form-data';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundDetailsComponent implements OnInit {
  pageTitle: string;
  financialDetails: FormGroup;
  FinancialFormData;
  formValues;
  fundDetails;
  arrowup = true;
  arrowdown = true;
  selected;
  showArrow = false;
  fund;
  fundDetail: any;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    private modal: NgbModal,
    private _location: Location,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public portfolioService: PortfolioService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Fund Details');
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.fundDetails = this.portfolioService.getFundDetails();
     // this.reConstructFactSheetLinks();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  showHide(el) {
    const fundContentEle = el.getElementsByClassName('funding-content')[0];
    if (fundContentEle.classList.contains('active') || fundContentEle.classList.contains('first')) {
      fundContentEle.classList.remove('active');
      fundContentEle.classList.remove('first');
      el.getElementsByClassName('fund-heading')[0].classList.remove('active');
    } else {
      fundContentEle.classList.add('active');
      el.getElementsByClassName('fund-heading')[0].classList.add('active');
    }
  }

  goBack() {
    this._location.back();
  }
  // reConstructFactSheetLinks() {
  //   let factSheetLink;
  //   let prospectusLink;
  //   this.fundDetails = this.portfolioService.getFundDetails();
  //   const fundDetails = this.fundDetails;
  //   for (const fundDetail of fundDetails) {
  //     console.log(fundDetail);
  //     factSheetLink = fundDetail.factSheetLink.split('|')[0];
  //     prospectusLink = fundDetail.factSheetLink.split('|')[1];
  //     console.log(factSheetLink);
  //     console.log(prospectusLink);
  //   }
  // }
}
