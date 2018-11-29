import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PortfolioService } from '../portfolio.service';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionComponent implements OnInit {
  pageTitle: string;
  transactions: any;
  constructor(
    private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private portfolioService: PortfolioService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = 'Transaction';
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.portfolioService.getAllTransactions().subscribe((response) => {
      console.log(response);
      this.transactions = response.objectList;
      console.log(this.transactions);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title, null, false, false, true);
  }

}

//export class NgbdTabsetBasic { }



