import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { GroupByPipe } from '../../../shared/Pipes/group-by.pipe';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionsComponent implements OnInit {
  pageTitle: string;
  transactionHistory: any;
  statementMonthsList: any;
  Object = Object;
  activeTransactionIndex;
  userProfileInfo;
  portfolio: any;
  constructor(
    private router: Router,
    public footerService: FooterService,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private manageInvestmentsService: ManageInvestmentsService,
    private signUpService: SignUpService,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService
  ) {
    this.portfolio = this.manageInvestmentsService.getSelectedCustomerPortfolio();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('TRANSACTIONS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(103);
    this.footerService.setFooterVisibility(false);
    this.getTransactionHistory();
    this.createTransactionStatement();
  }

  createTransactionStatement() {
    if (this.portfolio && this.portfolio.accountCreatedDate) {
      const accountCreationDate = this.convertStringToDate(
        this.portfolio.accountCreatedDate
      );
      const recentStatementAvailDate = this.convertStringToDate(
        this.portfolio.statementCreatedDate
       );
      this.statementMonthsList = this.manageInvestmentsService.getMonthListByPeriod(
        accountCreationDate,
        recentStatementAvailDate
      );
    }
  }

  setPageTitle(title: string) {
    console.log(this.portfolio.portfolioName);
    this.navbarService.setPageTitle(title, null, false, false, true, this.portfolio.portfolioName);
  }

  convertStringToDate(dateStr) {
    const dateArr = dateStr.split('-');
    return new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
  }

  getTransactionHistory() {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.loaderService.showLoader({
        title: this.translate.instant('TRANSACTIONS.MODAL.TRANSACTION_FETCH_LOADER.TITLE'),
        desc: this.translate.instant('TRANSACTIONS.MODAL.TRANSACTION_FETCH_LOADER.MESSAGE')
      });
    });
    if (this.portfolio) {
      this.manageInvestmentsService.getTransactionHistory(
        this.portfolio.customerPortfolioId).subscribe((response) => {
        this.loaderService.hideLoader();
        this.transactionHistory = response.objectList;
        this.transactionHistory = this.calculateSplitAmounts(this.transactionHistory);
        this.investmentEngagementJourneyService.sortByProperty(
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
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
    } else {
      this.loaderService.hideLoader();
    }
  }

  calculateSplitAmounts(transactionHistory) {
    if (transactionHistory) {
      transactionHistory.forEach((transaction) => {
        if (transaction.fundInvestmentSplits) {
          transaction.fundInvestmentSplits.forEach((breakdown) => {
            breakdown.splitAmount = breakdown.unit * breakdown.unitPrice;
          });
        }
      });
    }
    return transactionHistory;
  }

  downloadStatement(month) {
    const params = this.constructDonwloadStatementParams(month);
    this.translate.get('COMMON').subscribe((result: string) => {
      this.loaderService.showLoader({
        title: this.translate.instant('TRANSACTIONS.MODAL.STATEMENT_FETCH_LOADER.TITLE'),
        desc: this.translate.instant('TRANSACTIONS.MODAL.STATEMENT_FETCH_LOADER.MESSAGE')
      });
    });
    this.manageInvestmentsService.downloadStatement(params, this.portfolio.customerPortfolioId).subscribe((response) => {
      this.loaderService.hideLoader();
      this.downloadFile(response, month);
    },
    (err) => {
      this.loaderService.hideLoader();
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  constructDonwloadStatementParams(data) {
    if (data && data.monthName) {
      return data.monthName.substring(0, 3).toUpperCase() + '/' + data.year;
    }
    return '';
  }

  downloadFile(data, month) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = month.monthName + '_' + month.year + '_' + '.pdf';
    a.click();
    // window.URL.revokeObjectURL(url);
    // a.remove();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

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
