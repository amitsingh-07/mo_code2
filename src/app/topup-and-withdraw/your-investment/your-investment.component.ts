import { CurrencyPipe } from '@angular/common';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

import { TopUpAndWithdrawFormData } from '../topup-and-withdraw-form-data';

import { PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES } from '../../portfolio/portfolio-routes.constants';

import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';

import { HostListener } from '@angular/core';

import { ConsoleLoggerService } from '../../shared/logger/console-logger.service';

import { SignUpService } from '../../sign-up/sign-up.service';

@Component({
  selector: 'app-your-investment',
  templateUrl: './your-investment.component.html',
  styleUrls: ['./your-investment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourInvestmentComponent implements OnInit {
  totalPortfolio;
  welcomeInfo;
  investmentoverviewlist: any;
  portfolioList;
  totalReturnss;
  selectedDropDown;
  pageTitle: string;
  moreList: any;
  PortfolioValues;
  portfolios;
  userProfileInfo;
  showAlretPopUp = false;
  selected;
 
  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    private modal: NgbModal,
    private currencyPipe: CurrencyPipe,
    public signUpService: SignUpService,
    public activeModal: NgbActiveModal,
    public topupAndWithDrawService: TopupAndWithDrawService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('TOPUP.TITLE');
      this.setPageTitle(this.pageTitle);
    });

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.getMoreList();
    this.getInvestmentOverview();
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
  }
  getMoreList() {
    this.topupAndWithDrawService.getMoreList().subscribe((data) => {
      this.moreList = data.objectList;
      console.log(this.moreList);
    });

  }
  addPortfolio() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_ASSESSMENT]);

  }
  yourPortfolio(portfolio) {
    //this.PortfolioValues= portfolio;
    this.PortfolioValues = this.topupAndWithDrawService.setPortfolioValues(portfolio);
    console.log(this.PortfolioValues);
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.YOUR_PORTFOLIO]);
  }
  selectSource(option) {
  }
  getInvestmentOverview() {
    this.topupAndWithDrawService.getInvestmentOverview().subscribe((data) => {
      this.investmentoverviewlist = data.objectList;
      this.portfolioList = this.investmentoverviewlist.data.portfolios;
      this.totalPortfolio = this.portfolioList.length;
      this.welcomeInfo = { name: this.userProfileInfo.firstName, total: this.totalPortfolio };
      console.log(this.portfolioList);
      console.log(this.investmentoverviewlist.data.totalValue);
      this.topupAndWithDrawService.setUserPortfolioList(this.portfolioList);
      this.topupAndWithDrawService.setUserCashBalance(this.investmentoverviewlist.data.cashAccountDetails.availableBalance);
    });
  }
  fundYourAccount() {
    //this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
 }

  alertPopUp(i) {
    this.selected = i;
    this.showAlretPopUp = true;
  }
  ClosedPopup() {
    this.showAlretPopUp = false;

  }
  selectOption(option) {
    if (option.id === 1) {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TRANSACTION]);
    } else if (option.id === 2) {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL]);
    } else {
      console.log('Transaction History');
    }
  }

}
