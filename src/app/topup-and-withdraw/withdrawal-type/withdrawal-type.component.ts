import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmWithdrawalModalComponent } from '../confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';
import { TranslateService } from '@ngx-translate/core';
import { ForwardPricingModalComponent } from '../forward-pricing-modal/forward-pricing-modal.component';

@Component({
  selector: 'app-withdrawal-type',
  templateUrl: './withdrawal-type.component.html',
  styleUrls: ['./withdrawal-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WithdrawalTypeComponent implements OnInit {
  pageTitle: string;
  withdrawForm;
  formValues;
  isFromPortfolio = false;
  withdrawalTypes;
  portfolioList;
  cashBalance;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    private loaderService: LoaderService,
    private investmentAccountService: InvestmentAccountService
  ) {
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
    this.navbarService.setNavbarMode(103);
    this.footerService.setFooterVisibility(false);
    this.getLookupList();
    this.formValues = this.topupAndWithDrawService.getTopUpFormData();
    this.portfolioList = this.topupAndWithDrawService.getUserPortfolioList();
    this.cashBalance = this.topupAndWithDrawService.getUserCashBalance();
    this.buildForm();
  }

  buildForm() {
    this.withdrawForm = this.formBuilder.group({
      withdrawType: [this.formValues.withdrawType, Validators.required]
    });

    // Withdraw Type Changed Event
    this.withdrawForm.get('withdrawType').valueChanges.subscribe((value) => {
      if (value) {
        this.withdrawForm.removeControl('withdrawPortfolio');
        this.withdrawForm.removeControl('withdrawAmount');
        setTimeout(() => {
          switch (value.id) {
            case TOPUPANDWITHDRAW_CONFIG.WITHDRAW.PORTFOLIO_TO_CASH_TYPE_ID:
              this.buildFormForPortfolioToCash();
              this.isFromPortfolio = true;
              break;
            case TOPUPANDWITHDRAW_CONFIG.WITHDRAW.PORTFOLIO_TO_BANK_TYPE_ID:
              this.buildFormForPortfolioToBank();
              this.isFromPortfolio = true;
              break;
            case TOPUPANDWITHDRAW_CONFIG.WITHDRAW.CASH_TO_BANK_TYPE_ID:
              this.buildFormForCashToBank();
              this.isFromPortfolio = false;
              break;
          }
        }, 1);
      }
    });

    if (this.formValues.withdrawType) {
      // trigger change event
      this.withdrawForm.get('withdrawType').setValue(this.formValues.withdrawType);
    }
    if (this.withdrawForm.get('withdrawPortfolio')) {
      // trigger change event
      this.withdrawForm
        .get('withdrawPortfolio')
        .setValue(this.formValues.withdrawPortfolio);
    }
  }

  buildFormForPortfolioToCash() {
    this.withdrawForm.addControl(
      'withdrawPortfolio',
      new FormControl('', Validators.required)
    );
    this.withdrawForm.get('withdrawPortfolio').valueChanges.subscribe((value) => {
      value
        ? this.withdrawForm.addControl(
          'withdrawAmount',
          new FormControl('', [
            Validators.required,
            this.withdrawAmountValidator(
              this.withdrawForm.get('withdrawPortfolio'),
              'CONTROL'
            )
          ])
        )
        : this.withdrawForm.removeControl('withdrawAmount');
    });
    this.withdrawForm.controls.withdrawPortfolio.setValue(
      this.formValues.PortfolioValues
    );
  }

  // tslint:disable
  buildFormForPortfolioToBank() {
    this.withdrawForm.addControl(
      'withdrawPortfolio',
      new FormControl('', Validators.required)
    );
    this.withdrawForm.get('withdrawPortfolio').valueChanges.subscribe((value) => {
      value
        ? this.withdrawForm.addControl(
          'withdrawAmount',
          new FormControl('', [
            Validators.required,
            this.withdrawAmountValidator(
              this.withdrawForm.get('withdrawPortfolio'),
              'CONTROL'
            )
          ])
        )
        : this.withdrawForm.removeControl('withdrawAmount');
    });
    this.withdrawForm.controls.withdrawPortfolio.setValue(
      this.formValues.PortfolioValues
    );
  }

  buildFormForCashToBank() {
    this.withdrawForm.addControl(
      'withdrawAmount',
      new FormControl('', [
        Validators.required,
        this.withdrawAmountValidator(this.cashBalance, 'VALUE')
      ])
    );
    this.withdrawForm.removeControl('withdrawPortfolio');
  }

  getLookupList() {
    this.withdrawalTypes = TOPUPANDWITHDRAW_CONFIG.WITHDRAW.WITHDRAWAL_TYPES;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
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
    ref.componentInstance.portfolioValue = this.formValues.withdrawPortfolio.currentValue;
    ref.componentInstance.portfolio = this.formValues.withdrawPortfolio;
    ref.componentInstance.confirmed.subscribe(() => {
      ref.close();
      this.topupAndWithDrawService.setWithdrawalTypeFormData(form.getRawValue());
      this.saveWithdrawal();
      // confirmed
    });
    ref.componentInstance.showLearnMore.subscribe(() => {
      ref.close();
      this.showLearnMoreModal(form);
    });
    this.dismissPopup(ref);
  }

  showLearnMoreModal(form) {
    const learnMoreRef = this.modal.open(ForwardPricingModalComponent, {
      centered: true,
      backdrop : 'static',
      keyboard : false
    });
    learnMoreRef.result.then((data) => {
    }, (reason) => {
      learnMoreRef.close();
      this.showConfirmWithdrawModal(form);
      // on dismiss
    });
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
    this.loaderService.showLoader({
      title: this.translate.instant('WITHDRAW.WITHDRAW_REQUEST_LOADER.TITLE'),
      desc: this.translate.instant('WITHDRAW.WITHDRAW_REQUEST_LOADER.DESC')
    });
    this.topupAndWithDrawService.sellPortfolio(this.formValues).subscribe(
      (response) => {
        this.loaderService.hideLoader();
        if (response.responseMessage.responseCode < 6000) {
          if (
            response.objectList &&
            response.objectList.length &&
            response.objectList[response.objectList.length - 1].serverStatus &&
            response.objectList[response.objectList.length - 1].serverStatus.errors &&
            response.objectList[response.objectList.length - 1].serverStatus.errors.length
          ) {
            this.showCustomErrorModal(
              'Error!',
              response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg
            );
          } else if (response.responseMessage && response.responseMessage.responseDescription) {
            const errorResponse = response.responseMessage.responseDescription;
            this.showCustomErrorModal('Error!', errorResponse);
          } else {
            this.investmentAccountService.showGenericErrorModal();
          }
        } else {
          this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL_SUCCESS]);
        }
      },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      }
    );
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
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
      if (
        form.value.withdrawType.id ===
        TOPUPANDWITHDRAW_CONFIG.WITHDRAW.CASH_TO_BANK_TYPE_ID ||
        form.value.withdrawType.id ===
        TOPUPANDWITHDRAW_CONFIG.WITHDRAW.PORTFOLIO_TO_BANK_TYPE_ID
      ) {
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL_PAYMENT_METHOD]);
      } else {
        this.showConfirmWithdrawModal(form);
      }
    }
  }

  withdrawAmountValidator(amount, type): ValidatorFn {
    return (c: AbstractControl) => {
      if (c) {
        let isValid;
        if (type === 'CONTROL') {
          isValid = c.value <= amount.value.currentValue;
        } else {
          isValid = c.value <= amount;
        }
        if (c.value <= 0) {
          return { MinValue: true };
        }

        if (isValid) {
          return null;
        } else if (type === 'CONTROL') {
          return { portfolioToBank: true };
        } else {
          return { PortfolioToCash: true };
        }
      }
    };
  }
}
