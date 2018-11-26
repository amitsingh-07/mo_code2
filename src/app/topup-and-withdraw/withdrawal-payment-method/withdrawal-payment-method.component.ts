import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { AddBankModalComponent } from '../add-bank-modal/add-bank-modal.component';
import {
  ConfirmWithdrawalModalComponent
} from '../confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import { TopUpAndWithdrawCommon } from '../topup-and-withdraw-common';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

@Component({
  selector: 'app-withdrawal-payment-method',
  templateUrl: './withdrawal-payment-method.component.html',
  styleUrls: ['./withdrawal-payment-method.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WithdrawalPaymentMethodComponent implements OnInit {
  pageTitle: string;
  bankForm;
  formValues: any;
  banks;
  userBankList;
  userAddress;

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
      this.pageTitle = this.translate.instant('WITHDRAW_PAYMENT_METHOD.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.getLookupList();
    this.getUserBankList();
    this.getUserAddress();
    this.formValues = this.topupAndWithDrawService.getTopUpFormData();
    this.buildForm();
  }

  buildForm() {
    this.bankForm = this.formBuilder.group({
      withdrawMode: [this.formValues.withdrawMode, Validators.required],
      withdrawBank: [this.formValues.withdrawBank, Validators.required]
    });
  }

  getLookupList() {
    this.topupAndWithDrawService.getAllDropDownList().subscribe((data) => {
      this.banks = data.objectList.bankList;
    });
  }

  getUserBankList() {
    this.topupAndWithDrawService.getUserBankList().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        this.userBankList = data.objectList;
      }
    });
  }

  getUserAddress() {
    this.topupAndWithDrawService.getUserAddress().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        this.userAddress = data.objectList.mailingAddress ? data.objectList.mailingAddress : data.objectList.homeAddress;
      }
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  selectBank(bank) {
    this.bankForm.controls.withdrawBank.setValue(bank);
  }

  selectMode(mode) {
    if (mode === 'BANK') {
      this.bankForm.controls['withdrawBank'].setValidators([Validators.required]);
    } else {
      this.bankForm.controls['withdrawBank'].clearValidators();
    }
    this.bankForm.controls['withdrawBank'].updateValueAndValidity();
    this.bankForm.controls.withdrawMode.setValue(mode);
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

  dismissPopup(ref: NgbModalRef) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ref.close();
      }
    });
  }

  showConfirmWithdrawModal(form) {
    const ref = this.modal.open(ConfirmWithdrawalModalComponent, {
      centered: true
    });
    ref.componentInstance.withdrawAmount = this.formValues.withdrawAmount;
    ref.componentInstance.withdrawType = this.formValues.withdrawType;
    ref.componentInstance.confirmed.subscribe((data) => {
      ref.close();
      this.topupAndWithDrawService.setWithdrawalPaymentFormData(form.getRawValue());
      this.saveWithdrawal();
      // confirmed
    });
    this.dismissPopup(ref);
  }

  showNewBankFormModal() {
    const ref = this.modal.open(AddBankModalComponent, {
      centered: true
    });
    ref.componentInstance.banks = this.banks;
    ref.componentInstance.saved.subscribe((data) => {
      ref.close();
      this.topupAndWithDrawService.saveNewBank(data).subscribe((response) => {
        if (response.responseMessage.responseCode >= 6000) {
          this.getUserBankList(); // refresh updated bank list
        }
      });
    });
    this.dismissPopup(ref);
  }

  saveWithdrawal() {
    this.topupAndWithDrawService.sellPortfolio(this.formValues).subscribe((response) => {
      this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL_SUCCESS]);
    });
  }

  goToNext(form) {
    // If Bank Mode
    if (this.bankForm.controls.withdrawMode.value === 'BANK') {
      if (!form.valid) { // INVALID FORM
        this.markAllFieldsDirty(form);
        const error = this.topupAndWithDrawService.getFormErrorList(form);
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = error.title;
        ref.componentInstance.errorMessageList = error.errorMessages;
        return false;
      } else { // FORM VALID
        this.showConfirmWithdrawModal(form);
      }
    } else { // If Cheque Mode
      this.showConfirmWithdrawModal(form);
    }
  }
}
