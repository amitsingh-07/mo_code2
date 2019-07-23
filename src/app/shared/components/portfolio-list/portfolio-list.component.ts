import { TopupAndWithDrawService } from 'src/app/topup-and-withdraw/topup-and-withdraw.service';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { InvestmentAccountService } from '../../../investment-account/investment-account-service';
import { ProfileIcons } from '../../../portfolio/risk-profile/profileIcons';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {

  selected;
  showAlretPopUp = false;

  @Input('portfolioList') portfolioList;
  @Input('showTotalReturn') showTotalReturn;
  @Output() transferInstSelected = new EventEmitter<boolean>();
  @Output() detailSelected = new EventEmitter<boolean>();
  @Output() deleteSelected = new EventEmitter<boolean>();
  @Output() investAgainSelected = new EventEmitter<boolean>();

  constructor(private topupAndWithDrawService: TopupAndWithDrawService,
              private investmentAccountService: InvestmentAccountService) { }

  ngOnInit() {
  }

  getEntitlementsFromPortfolio(portfolio) {
    return this.topupAndWithDrawService.getEntitlementsFromPortfolio(portfolio);
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
