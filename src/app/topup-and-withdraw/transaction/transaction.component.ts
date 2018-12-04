import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NavbarService } from '../../shared/navbar/navbar.service';
import { GroupByPipe } from '../../shared/Pipes/group-by.pipe';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

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

  constructor(
    private router: Router,
    public navbarService: NavbarService,
    private translate: TranslateService,
    private topupAndWithDrawService: TopupAndWithDrawService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = 'Transaction';
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.topupAndWithDrawService.getAllTransactionHistory().subscribe((response) => {
      this.transactionHistory = response.objectList;
      this.transactionHistory = new GroupByPipe().transform(this.transactionHistory, 'displayCreatedDate');
    });

    // Statement
    this.accountCreationDate = new Date('2016-04-23');
    this.statementMonthsList = this.topupAndWithDrawService.getMonthListByPeriod(this.accountCreationDate, new Date());
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title, null, false, false, true);
  }

  getStatementLink(month) {
    const base_url = TOPUPANDWITHDRAW_CONFIG.STATEMENT.STATEMENT_BASE_PATH;
    const customerId = 'ngvdkf'; // todo
    const sub_path = 'statements/' + customerId + '/';
    const fileName = month.monthName.substring(0, 3).toLowerCase() + '_' + month.year + '.pdf';
    return base_url + sub_path + fileName ;
  }

}