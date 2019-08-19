import { CurrencyPipe } from '@angular/common';
import { ManageInvestmentsService } from '../../../investment/manage-investments/manage-investments.service';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { InvestmentAccountService } from '../../../investment/investment-account/investment-account-service';
import { ProfileIcons } from '../../../investment/investment-engagement-journey/recommendation/profileIcons';
import { SignUpService } from '../../../sign-up/sign-up.service';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {

  selected;
  userProfileInfo;
  showAlretPopUp = false;
  monthlyInvestment: any;

  @Input('portfolioList') portfolioList;
  @Input('showTotalReturn') showTotalReturn;
  @Output() transferInstSelected = new EventEmitter<boolean>();
  @Output() detailSelected = new EventEmitter<boolean>();
  @Output() deleteSelected = new EventEmitter<boolean>();
  @Output() investAgainSelected = new EventEmitter<boolean>();

  constructor(private manageInvestmentsService: ManageInvestmentsService,
              public signUpService: SignUpService,
              private currencyPipe: CurrencyPipe,
              private investmentAccountService: InvestmentAccountService) { }

  ngOnInit() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
  }

  getMonthlyInvestValidity(index: number) {
    if (this.userProfileInfo && this.userProfileInfo.investementDetails
       && this.userProfileInfo.investementDetails.portfolios
       && this.userProfileInfo.investementDetails.portfolios[index]
       && this.userProfileInfo.investementDetails.portfolios[index].initialInvestment <= 0
       && this.userProfileInfo.investementDetails.portfolios[index].monthlyInvestment > 0) {
         this.monthlyInvestment = this.currencyPipe.transform(
          this.userProfileInfo.investementDetails.portfolios[index].monthlyInvestment,
          'USD',
          'symbol-narrow',
          '1.0-2'
        );
         return true;
       }
    return false;
  }
  getEntitlementsFromPortfolio(portfolio) {
    return this.manageInvestmentsService.getEntitlementsFromPortfolio(portfolio);
  }

  formatReturns(value) {
    return this.investmentAccountService.formatReturns(value);
  }

  detail(portfolio) {
    this.detailSelected.emit(portfolio);
  }

  transferInst($event) {
    this.transferInstSelected.emit($event);
  }

  delete(portfolio) {
    this.deleteSelected.emit(portfolio);
  }

  investAgain(portfolio) {
    this.investAgainSelected.emit(portfolio);
  }

  getImg(i: number) {
    return ProfileIcons[i - 1]['icon'];
  }

  stopEventPropogation(event) {
    event.stopPropagation();
  }

  alertPopUp(i, event) {
    event.stopPropagation();
    this.selected = i;
    this.showAlretPopUp = true;
  }
  ClosedPopup() {
    this.showAlretPopUp = false;
  }
}
