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
import { FooterService } from './../../shared/footer/footer.service';

import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';

import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';


@Component({
  selector: 'app-your-portfolio',
  templateUrl: './your-portfolio.component.html',
  styleUrls: ['./your-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourPortfolioComponent implements OnInit {
  pageTitle: string;
  moreList: any;
  portfolioValues;
  portfolio;
  HoldingValues;
  holdingsDPMSData;
  assetAllocationValues;
  yearlyReturns: any;
  totalReturns: any;
  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    private modal: NgbModal,
    public footerService: FooterService,
    private currencyPipe: CurrencyPipe,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public portfolioService: PortfolioService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('YOUR_PORTFOLIO.TITLE');
      this.setPageTitle(this.pageTitle);
    });

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getMoreList();
    this.portfolioValues = this.topupAndWithDrawService.getPortfolioValues();
    this.totalReturns = this.portfolioValues.totalReturns ? this.portfolioValues.totalReturns : 0;
    this.yearlyReturns = this.portfolioValues.yearlyReturns ? this.portfolioValues.yearlyReturns : 0;
    this.getPortfolioHoldingList(this.portfolioValues.productCode);   // SET THE PORTFOLIO ID
  }
  getMoreList() {
    this.moreList = TOPUPANDWITHDRAW_CONFIG.INVESTMENT_OVERVIEW.MORE_LIST;
  }
  getPortfolioHoldingList(portfolioid) {
    this.topupAndWithDrawService.getIndividualPortfolioDetails(portfolioid).subscribe((data) => {
      this.portfolio = data.objectList;
      const fundingParams = this.constructFundingParams(this.portfolio);
      this.topupAndWithDrawService.setSelectedPortfolio(this.portfolio);
    });
  }

  constructFundingParams(data) {
    const FundValues = {
      source: 'FUNDING',
      portfolio: {
        productName: data.portfolioName,
        riskProfile: data.riskProfile
      },
      oneTimeInvestment: data.initialInvestment,
      monthlyInvestment: data.monthlyInvestment,
      fundingType: '', // todo
      isAmountExceedBalance: 0,
      exceededAmount: 0
    };
    this.topupAndWithDrawService.setFundingDetails(FundValues);
  }
  goToFundYourAccount() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
  }
  gotoTopUp() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP]);
  }
  showTotalReturnPopUp() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_PORTFOLIO.MODAL.TOTAL_RETURNS.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('YOUR_PORTFOLIO.MODAL.TOTAL_RETURNS.MESSAGE');
  }
  goToHoldings() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.HOLDINGS]);
  }
  goToAssetAllocation() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.ASSET_ALLOCATION]);
  }
  selectOption(option) {
    if (option.id === 1) {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TRANSACTION]);
    } else {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL]);
    }

  }
}
