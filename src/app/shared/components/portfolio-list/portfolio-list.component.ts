import { CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
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
  investedList: any;
  notInvestedList: any;
  showAllForInvested = false;
  showAllForNotInvested = false;
  topClickedFlag = false;
  @Input('portfolioList') portfolioList;
  @Input('showTotalReturn') showTotalReturn;
  @Input('portfolioData') portfolioData;
  @Output() transferInstSelected = new EventEmitter<boolean>();
  @Output() detailSelected = new EventEmitter<boolean>();
  @Output() topUpSelected = new EventEmitter<boolean>();
  @Output() deleteSelected = new EventEmitter<boolean>();
  @Output() investAgainSelected = new EventEmitter<boolean>();

  constructor(public readonly translate: TranslateService,
              private manageInvestmentsService: ManageInvestmentsService,
              public signUpService: SignUpService,
              private currencyPipe: CurrencyPipe,
              private investmentAccountService: InvestmentAccountService) {
                this.translate.use('en');
                this.translate.get('COMMON').subscribe((result: string) => {});
              }

  ngOnInit() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.portfoioSpliter();
  }

  showHideToggle(elementName: string) {
    this[elementName] = !(this[elementName]);
  }
  portfoioSpliter() {
    this.notInvestedList = [];
    this.investedList = [];
    if (this.portfolioList) {
      console.log('coming', this.portfolioList[0]);
      for (const portfolio of this.portfolioList) {
        if (portfolio.portfolioStatus === 'PURCHASED') {
          this.investedList.push(portfolio);
        } else {
          this.notInvestedList.push(portfolio);
        }
      }
    }
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
    if (!this.topClickedFlag) {
      this.detailSelected.emit(portfolio);
    }
    this.topClickedFlag = false;
  }
  gotoTopUp() {
    this.topClickedFlag = true;
    this.topUpSelected.emit();
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
