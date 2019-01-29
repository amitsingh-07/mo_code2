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
import { FooterService } from './../../shared/footer/footer.service';

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
  hideAddBankAccount = true;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public footerService: FooterService,
    public navbarService: NavbarService,
    public topupAndWithDrawService: TopupAndWithDrawService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
     });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getLookupList();
    this.getUserBankList();
    this.getUserAddress();
    this.formValues = this.topupAndWithDrawService.getTopUpFormData();
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
        if (this.userBankList.length > 0) {
          this.hideAddBankAccount = false;
          }
        this.pageTitle = this.getTitle();
        this.setPageTitle(this.pageTitle);
       }
    });
  }

  getTitle() {
    let title = '';
    title = (this.hideAddBankAccount) ? this.translate.instant('WITHDRAW_PAYMENT_METHOD.ADD_BANK_ACCOUNT')
       : this.translate.instant('WITHDRAW_PAYMENT_METHOD.BANK_DETAIL');
    return title;
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

  showConfirmWithdrawModal() {
    const ref = this.modal.open(ConfirmWithdrawalModalComponent, {
      centered: true
    });
    ref.componentInstance.withdrawAmount = this.formValues.withdrawAmount;
    ref.componentInstance.withdrawType = this.formValues.withdrawType;
    ref.componentInstance.confirmed.subscribe((data) => {
      ref.close();
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
      if (response.responseMessage.responseCode < 6000) {
        if (response.objectList && response.objectList.serverStatus && response.objectList.serverStatus.errors.length) {
          this.showCustomErrorModal('Error!', response.objectList.serverStatus.errors[0].msg);
        }
      } else {
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL_SUCCESS]);
      }
    },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant('COMMON_ERRORS.API_FAILED.TITLE');
        ref.componentInstance.errorMessage = this.translate.instant('COMMON_ERRORS.API_FAILED.DESC');
      });
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  goToNext() {
    this.showConfirmWithdrawModal();
  }
}
