import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import {
  ConfirmWithdrawalModalComponent
} from '../confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

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
  withdrawalTypes;
  portfolioList;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public topupAndWithDrawService: TopupAndWithDrawService) {
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
    this.getLookupList();
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.formValues = this.topupAndWithDrawService.getTopUpFormData();
    this.buildForm();
    // Withdraw Type Changed Event
    this.withdrawForm.get('withdrawType').valueChanges.subscribe((value) => {
      this.withdrawForm.removeControl('portfolioGroup');
      this.isFromPortfolio = false;
      this.showWithdrawalAmountControl = true;
      if (value.id === TOPUPANDWITHDRAW_CONFIG.WITHDRAW.PORTFOLIO_TO_CASH_TYPE_ID
        || value.id === TOPUPANDWITHDRAW_CONFIG.WITHDRAW.PORTFOLIO_TO_BANK_TYPE_ID) {
        console.log(this.formValues);
        this.withdrawForm.addControl('portfolioGroup', this.formBuilder.group({
          withdrawPortfolio: new FormControl(this.formValues.withdrawPortfolio, [Validators.required])
        }));
        this.isFromPortfolio = true;
        this.showWithdrawalAmountControl = false;
        this.withdrawForm.get('portfolioGroup').get('withdrawPortfolio').valueChanges.subscribe((portfolio) => {
          if (portfolio) {
            this.showWithdrawalAmountControl = true;
          }
        });
      }
    });
    if (this.formValues.withdrawType) { // trigger change event
      this.withdrawForm.get('withdrawType').setValue(this.formValues.withdrawType);
    }
    if (this.withdrawForm.get('portfolioGroup')) { // trigger change event
      this.withdrawForm.get('portfolioGroup').get('withdrawPortfolio').setValue(this.formValues.withdrawPortfolio);
    }
  }

  getLookupList() {
    this.topupAndWithDrawService.getAllDropDownList().subscribe((data) => {
      this.withdrawalTypes = [
        { id: 1, name: 'Portfolio to Cash Account' },
        { id: 2, name: 'Portfolio to Bank Account' },
        { id: 3, name: 'Cash Account to Bank Ac' }
      ];
      this.portfolioList = [
        { id: 'PORT2334', name: 'Growth', value: 12050 },
        { id: 'PORT2335', name: 'Conservative', value: 9500 }
      ];
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

  showConfirmWithdrawModal(form) {
    const ref = this.modal.open(ConfirmWithdrawalModalComponent, {
      centered: true
    });
    ref.componentInstance.withdrawAmount = this.withdrawForm.get('withdrawAmount').value;
    ref.componentInstance.withdrawType = this.withdrawForm.get('withdrawType').value;
    ref.componentInstance.confirmed.subscribe(() => {
      ref.close();
      this.topupAndWithDrawService.setWithdrawalTypeFormData(form.getRawValue());
      this.saveWithdrawal();
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

  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }

  saveWithdrawal() {
    this.topupAndWithDrawService.saveWithdrawalRequest(this.formValues).subscribe((response) => {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL_SUCCESS]);
    });
  }

  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.topupAndWithDrawService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.topupAndWithDrawService.setWithdrawalTypeFormData(form.getRawValue());
      if ((form.value.withdrawType.id === TOPUPANDWITHDRAW_CONFIG.WITHDRAW.CASH_TO_BANK_TYPE_ID) ||
        (form.value.withdrawType.id === TOPUPANDWITHDRAW_CONFIG.WITHDRAW.PORTFOLIO_TO_BANK_TYPE_ID)) {
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL_PAYMENT_METHOD]);
      } else {
        this.showConfirmWithdrawModal(form);
      }
    }
  }

}
