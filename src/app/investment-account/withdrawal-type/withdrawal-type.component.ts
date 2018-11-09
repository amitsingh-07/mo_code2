import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';
import { ConfirmWithdrawalModalComponent } from './confirm-withdrawal-modal/confirm-withdrawal-modal.component';

@Component({
  selector: 'app-withdrawal-type',
  templateUrl: './withdrawal-type.component.html',
  styleUrls: ['./withdrawal-type.component.scss']
})
export class WithdrawalTypeComponent implements OnInit {

  pageTitle: string;
  withdrawForm;
  formValues;
  showWithdrawalAmountControl = false;
  isFromPortfolio = false;
  withdrawalTypes = [
    { id: 1, name: 'Portfolio to Cash Account' },
    { id: 2, name: 'Portfolio to Bank Account' },
    { id: 3, name: 'Cash Account to Bank Ac' }
  ];
  portfolioList = [
    { id: 1, name: 'Growth' },
    { id: 2, name: 'Conservative' },
    { id: 3, name: 'Equity' }
  ];

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WITHDRAW.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.buildForm();

    // Withdraw Type Changed Event
    this.withdrawForm.get('withdrawType').valueChanges.subscribe((value) => {
      this.withdrawForm.removeControl('portfolioGroup');
      this.isFromPortfolio = false;
      this.showWithdrawalAmountControl = true;
      if (value.id === INVESTMENT_ACCOUNT_CONFIG.withdraw.PORTFOLIO_TO_CASH_TYPE_ID
        || value.id === INVESTMENT_ACCOUNT_CONFIG.withdraw.PORTFOLIO_TO_BANK_TYPE_ID) {
        this.withdrawForm.addControl('portfolioGroup', this.formBuilder.group({
          portfolio: new FormControl(null, [Validators.required])
        }));
        this.isFromPortfolio = true;
        this.showWithdrawalAmountControl = false;
        this.withdrawForm.get('portfolioGroup').get('portfolio').valueChanges.subscribe((portfolio) => {
          if (portfolio) {
            this.showWithdrawalAmountControl = true;
          }
        });
      }
    });
  }

  buildForm() {
    this.withdrawForm = this.formBuilder.group({
      withdrawType: [this.formValues.withdrawType, Validators.required],
      withdrawAmount: [this.formValues.withdrawAmount, Validators.required]
    });
  }

  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  setDropDownValue(key, value) {
    this.withdrawForm.controls[key].setValue(value);
  }

  setNestedDropDownValue(key, value, nestedKey) {
    this.withdrawForm.controls[nestedKey]['controls'][key].setValue(value);
  }

  showConfirmWithdrawModal() {
    const ref = this.modal.open(ConfirmWithdrawalModalComponent, {
      centered: true
    });
    ref.componentInstance.withdrawAmount = this.withdrawForm.get('withdrawAmount').value;
    ref.componentInstance.withdrawType = this.withdrawForm.get('withdrawType').value;
    ref.componentInstance.confirmed.subscribe(() => {
      ref.close();
      // confirmed
    });
    this.dismissPopup(ref);
  }

  dismissPopup(ref: NgbModalRef) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ref.close();
      }
    });
  }

}
