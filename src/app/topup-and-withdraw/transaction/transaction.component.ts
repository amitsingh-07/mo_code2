import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GroupByPipe } from '../../shared/Pipes/group-by.pipe';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PortfolioService } from '../../portfolio/portfolio.service';
import { Router } from '@angular/router';
import { SignUpService } from '../../sign-up/sign-up.service';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionComponent implements OnInit {
  pageTitle: string;
  transactionHistory: any;
  accountCreationDate: any;
  statementMonthsList: any;
  Object = Object;
  activeTransactionIndex;
  userProfileInfo;

  constructor(
    private router: Router,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private topupAndWithDrawService: TopupAndWithDrawService,
    private signUpService: SignUpService,
    private portfolioService: PortfolioService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('TRANSACTIONS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.getTransactionHistory();

    // Statement
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    if (
      this.userProfileInfo.investementDetails &&
      this.userProfileInfo.investementDetails.account &&
      this.userProfileInfo.investementDetails.account.accountCreatedDate
    ) {
      this.accountCreationDate = this.convertStringToDate(
        this.userProfileInfo.investementDetails.account.accountCreatedDate
      );
    }
    this.statementMonthsList = this.topupAndWithDrawService.getMonthListByPeriod(
      this.accountCreationDate,
      new Date()
    );
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title, null, false, false, true);
  }

  convertStringToDate(dateStr) {
    const dateArr = dateStr.split('-');
    return new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
  }

  getTransactionHistory(from?, to?) {
    this.topupAndWithDrawService.getTransactionHistory(from, to).subscribe((response) => {
      this.transactionHistory = response.objectList;
      this.transactionHistory = this.calculateSplitAmounts(this.transactionHistory);
      this.portfolioService.sortByProperty(
        this.transactionHistory,
        'createdDate',
        'desc'
      );
      this.transactionHistory = new GroupByPipe().transform(
        this.transactionHistory,
        'displayCreatedDate'
      );
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  calculateSplitAmounts(transactionHistory) {
    transactionHistory.forEach((transaction) => {
      transaction.fundInvestmentSplits.forEach((breakdown) => {
        breakdown.splitAmount = breakdown.unit * breakdown.unitPrice;
      });
    });
    return transactionHistory;
  }

  getStatementLink(month) {
    const base_url = TOPUPANDWITHDRAW_CONFIG.STATEMENT.STATEMENT_BASE_PATH;
    const customerId = this.userProfileInfo.id;
    const sub_path = 'statements/' + customerId + '/';
    const fileName =
      month.monthName.substring(0, 3).toLowerCase() + '_' + month.year + '.pdf';
    return base_url + sub_path + fileName;
  }

  expandCollapseAccordion(groupIndex, transactionIndex) {
    const index = groupIndex.toString() + transactionIndex.toString();
    if (index !== this.activeTransactionIndex) {
      this.activeTransactionIndex = index;
    } else {
      this.activeTransactionIndex = null;
    }
  }
}
