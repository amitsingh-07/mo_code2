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
  showAlretPopUp: boolean;
  monthlyInvestment: any;
  investedList: any;
  notInvestedList: any;
  showAllForInvested: boolean;
  showAllForNotInvested: boolean;
  topClickedFlag: boolean;
  @Input('portfolioList') portfolioList;
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
      for (const portfolio of this.portfolioList) {
        if (portfolio.portfolioStatus === 'PURCHASED') {
          this.investedList.push(portfolio);
        } else {
          this.notInvestedList.push(portfolio);
        }
      }
      this.investedList = this.sortByDate(this.investedList);
      this.notInvestedList = this.sortByDate(this.notInvestedList);
    }
  }
  sortByDate(myArray) {
   return  myArray.sort(
      (d1, d2) => new Date(d2.createdDate).getTime() - new Date(d1.createdDate).getTime()
    );
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
    const selectedFlag = window.getSelection().toString();
    if (!this.topClickedFlag && !selectedFlag) {
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
    return (ProfileIcons[i - 1] && ProfileIcons[i - 1]['icon']) ? ProfileIcons[i - 1]['icon'] : '';
  }
}
