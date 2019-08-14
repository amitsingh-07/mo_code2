import { ManagementService } from 'src/app/investment/management/management.service';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ProfileIcons } from '../../../investment/engagement-journey/recommendation/profileIcons';
import { AccountCreationService } from '../../../investment/account-creation/account-creation-service';

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

  constructor(private managementService: ManagementService,
              private accountCreationService: AccountCreationService) { }

  ngOnInit() {
  }

  getEntitlementsFromPortfolio(portfolio) {
    return this.managementService.getEntitlementsFromPortfolio(portfolio);
  }

  formatReturns(value) {
    return this.accountCreationService.formatReturns(value);
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
