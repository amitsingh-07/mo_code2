import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../manage-investments-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';
import { environment } from './../../../../environments/environment';
import { AuthenticationService } from './../../../shared/http/auth/authentication.service';
import {
  ConfirmWithdrawalModalComponent
} from './confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import {
  ForwardPricingModalComponent
} from './forward-pricing-modal/forward-pricing-modal.component';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DecimalPipe]
})
export class WithdrawalComponent implements OnInit, OnDestroy {
  pageTitle: string;
  withdrawForm;
  formValues;
  isFromPortfolio = false;
  withdrawalTypes;
  portfolioList;
  cashBalance;
  isRedeemAll;
  isRedeemAllChecked;
  translateParams;
  isRequestSubmitted = false;
  entitlements: any;
  userProfileInfo;
  srsAccountInfo: any;
  cfmWithdrawalModal: NgbModalRef;
  private subscription: Subscription;
  userBankList: any;
  isBankDetailsAvailable;
  isInvestAndJointAccountHolder;

  private destroySubscription$ = new Subject();

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public manageInvestmentsService: ManageInvestmentsService,
    private loaderService: LoaderService,
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    private decimalPipe: DecimalPipe,
    public authService: AuthenticationService
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
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(105);
    } else {
      this.navbarService.setNavbarMode(103);
    }
    this.footerService.setFooterVisibility(false);
    this.getLookupList();
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.portfolioList = this.manageInvestmentsService.getUserPortfolioList();
    this.translateParams = {
      MIN_WITHDRAW_AMOUNT: MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT,
      MIN_BALANCE_AMOUNT: MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_BALANCE_AMOUNT
    };
    this.buildForm();
    this.setSelectedPortfolio();
    this.getAndSetSrsDetails();
    this.isInvestAndJointAccountHolder = this.manageInvestmentsService.isInvestAndJointAccount();
    if (this.isInvestAndJointAccountHolder) {
      this.getUserBankList();
    }

    this.withdrawForm.get('withdrawRedeem').valueChanges.subscribe((value) => {
      if(value && !this.withdrawForm.controls['withdrawAmount'].disabled) {
        this.withdrawForm.get('withdrawAmount').disable();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.destroySubscription$.next();
    this.destroySubscription$.complete();
  }

  getUserBankList() {
    this.subscription = this.authService.get2faUpdateEvent.subscribe((token) => {
      this.manageInvestmentsService.getUserBankList().subscribe((data) => {
        if (data.responseMessage.responseCode >= 6000) {
          this.userBankList = data.objectList;
          if (this.userBankList.length > 0) {
            this.isBankDetailsAvailable = true;
          } else {
            this.isBankDetailsAvailable = false;
          }
        }
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
    });
  }

  getAndSetSrsDetails() {
    this.subscription = this.authService.get2faUpdateEvent.subscribe((token) => {
      if (!token) {
        this.manageInvestmentsService.getProfileSrsAccountDetails().subscribe((data) => {
          if (data) {
            this.srsAccountInfo = data;
            if (this.cfmWithdrawalModal) {
              this.cfmWithdrawalModal.componentInstance.srsAccountInfo = data;
            }
          } else {
            this.srsAccountInfo = null;
          }
        },
          (err) => {
            this.investmentAccountService.showGenericErrorModal();
          });
      }
    });
  }

  // Set selected portfolio's entitlements, cash balance
  setSelectedPortfolio() {
    if (this.formValues) {
      // Set the customerPortfolioId depend on which is the portfolio
      const customerPortfolioId = this.formValues.withdrawPortfolio ?
        this.formValues.withdrawPortfolio.customerPortfolioId : this.formValues.selectedCustomerPortfolioId;
      const data = this.portfolioList.find((portfolio) => {
        return portfolio.customerPortfolioId === customerPortfolioId;
      });
      this.setDropDownValue('withdrawPortfolio', data);
      if (data.portfolioType !== 'SRS') {
        this.setWithdrawTypeAndAmt();
      }
    }
  }

  setWithdrawTypeAndAmt() {
    // If user press back from withdrawal-bank-account set the type and amount
    if (this.formValues.withdrawType && this.formValues.withdrawAmount) {
      this.setDropDownValue('withdrawType', this.formValues.withdrawType);
      setTimeout(() => {
        this.withdrawForm.get('withdrawAmount').setValue(this.formValues.withdrawAmount);
      }, 0);
    }
  }

  buildForm() {
    this.withdrawForm = this.formBuilder.group({
      withdrawType: [this.formValues.withdrawType, Validators.required],
      withdrawPortfolio: [this.formValues.withdrawPortfolio ? this.formValues.withdrawPortfolio : this.formValues.selectedCustomerPortfolio, new FormControl('', Validators.required)],
      withdrawAmount: [this.formValues.withdrawAmount, Validators.required],
      withdrawRedeem: []
    });

    // Withdraw Type Changed Event
    this.withdrawForm.get('withdrawType').valueChanges.subscribe((value) => {
      this.isRedeemAll = false;
      if (value) {
        this.withdrawForm.removeControl('withdrawAmount');
        setTimeout(() => {
          switch (value.id) {
            case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.PORTFOLIO_TO_CASH_TYPE_ID:
            case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.PORTFOLIO_TO_BANK_TYPE_ID:
            case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.PORTFOLIO_TO_SRS_TYPE_ID:
              this.buildFormForPortfolioType();
              this.isFromPortfolio = true;
              break;
            case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.CASH_TO_BANK_TYPE_ID:
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
  }

  buildFormForPortfolioToCash() {
    this.withdrawForm.get('withdrawType').valueChanges.subscribe((value) => {
      if (value) {
        const roundOffValue = value.currentValue
          ? parseFloat(this.decimalPipe.transform(value.currentValue, '1.2-2').replace(/,/g, ''))
          : 0;
        this.isRedeemAll = (roundOffValue <
          (MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT + MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_BALANCE_AMOUNT)
          && roundOffValue > 0);
        this.withdrawForm.addControl(
          'withdrawAmount',
          new FormControl({
            value: this.isRedeemAll ? roundOffValue : '',
            disabled: this.isRedeemAll
          }, [
            Validators.required,
            this.withdrawAmountValidator(
              this.withdrawForm.get('withdrawPortfolio').value.currentValue,
              'PORTFOLIO'
            )
          ])
        );
        this.withdrawForm.get('withdrawAmount').valueChanges
        .pipe(takeUntil(this.destroySubscription$))
        .subscribe((amtValue) => {
          amtValue = amtValue.replace(/[,]+/g, '').trim();
          this.isRedeemAll = ((amtValue == roundOffValue) && roundOffValue > 0);
        });
      } else {
        this.withdrawForm.removeControl('withdrawAmount');
      }
    });
    this.withdrawForm.controls.withdrawPortfolio.setValue(
      this.formValues.PortfolioValues
    );
  }

  // tslint:disable
  buildFormForPortfolioToBank() {
    this.withdrawForm.get('withdrawPortfolio').valueChanges.subscribe((value) => {
      if (value) {
        const roundOffValue = value.currentValue
          ? parseFloat(this.decimalPipe.transform(value.currentValue, '1.2-2').replace(/,/g, ''))
          : 0;
        this.isRedeemAll = (roundOffValue <
          (MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT + MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_BALANCE_AMOUNT)
          && roundOffValue > 0);
        this.withdrawForm.addControl(
          'withdrawAmount',
          new FormControl({
            value: this.isRedeemAll ? roundOffValue : '',
            disabled: this.isRedeemAll
          }, [
            Validators.required,
            this.withdrawAmountValidator(
              this.withdrawForm.get('withdrawPortfolio').value.currentValue,
              'PORTFOLIO'
            )
          ])
        )
        this.withdrawForm.get('withdrawAmount').valueChanges.subscribe((amtValue) => {
          amtValue = amtValue.replace(/[,]+/g, '').trim();
          this.isRedeemAll = ((amtValue == roundOffValue) && roundOffValue > 0);
        });
      } else {
        this.withdrawForm.removeControl('withdrawAmount');
      }
    });
    this.withdrawForm.controls.withdrawPortfolio.setValue(
      this.formValues.PortfolioValues
    );
  }

  buildFormForPortfolioType() {
    const roundOffValue = this.withdrawForm.get('withdrawPortfolio').value.portfolioValue
      ? parseFloat(this.decimalPipe.transform(this.withdrawForm.get('withdrawPortfolio').value.portfolioValue, '1.2-2').replace(/,/g, ''))
      : 0;
    this.isRedeemAll = (roundOffValue <
      (MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT + MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_BALANCE_AMOUNT)
      && roundOffValue > 0); this.withdrawForm.addControl(
        'withdrawAmount',
        new FormControl({
          value: this.isRedeemAll ? roundOffValue : '',
          disabled: this.isRedeemAll
        }, [
          Validators.required,
          this.withdrawAmountValidator(
            this.withdrawForm.get('withdrawPortfolio').value.portfolioValue,
            'PORTFOLIO'
          )
        ])
      );

    this.withdrawForm.get('withdrawAmount').valueChanges.subscribe((amtValue) => {
      amtValue = amtValue.replace(/[,]+/g, '').trim();
      this.isRedeemAll = ((amtValue == roundOffValue) && roundOffValue > 0);
      if (this.isRedeemAll) {
        this.enableRedeem();
      }
    });
  }

  buildFormForCashToBank() {
    this.isRedeemAll = (this.cashBalance < MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT && this.cashBalance > 0);
    this.withdrawForm.addControl(
      'withdrawAmount',
      new FormControl({
        value: this.isRedeemAll ? this.cashBalance : '',
        disabled: this.isRedeemAll
      }, [
        Validators.required,
        this.withdrawAmountValidator(this.cashBalance, 'CASH_ACCOUNT')
      ])
    );
    this.withdrawForm.get('withdrawAmount').valueChanges.subscribe((amtValue) => {
      amtValue = amtValue.replace(/[,]+/g, '').trim();
      this.isRedeemAll = ((amtValue == this.cashBalance) && this.cashBalance > 0);
    });
  }

  getLookupList() {
    this.withdrawalTypes = MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.WITHDRAWAL_TYPES;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  setDropDownValue(key, value) {
    this.withdrawForm.controls[key].setValue(value);
    // Set the entitlements based on the selected portfolio
    if (key === 'withdrawPortfolio') {
      this.entitlements = value['entitlements'];
      this.entitlements.portfolioType = value.portfolioType;
      this.withdrawForm.controls.withdrawType.value = null;
      this.cashBalance = parseFloat(this.decimalPipe.transform(value.cashAccountBalance || 0, '1.2-2').replace(/,/g, ''));
      this.withdrawForm.removeControl('withdrawAmount');
      if (value.portfolioType === 'SRS') {
        this.withdrawForm.controls.withdrawType.value = MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.WITHDRAWAL_TYPES[3];
        this.buildFormForPortfolioType();
        this.isFromPortfolio = true;
      }
    }
    if (key === 'withdrawType' || value.portfolioType === 'SRS') {
      setTimeout(() => {
        this.checkRedeemAll();
      }, 100);
    }
  }

  setNestedDropDownValue(key, value, nestedKey) {
    this.withdrawForm.controls[nestedKey]['controls'][key].setValue(value);
  }

  showConfirmWithdrawModal(form) {
    this.cfmWithdrawalModal = this.modal.open(ConfirmWithdrawalModalComponent, {
      centered: true
    });
    this.cfmWithdrawalModal.componentInstance.srsAccountInfo = this.srsAccountInfo;
    this.cfmWithdrawalModal.componentInstance.withdrawAmount = this.withdrawForm.get('withdrawAmount').value;
    this.cfmWithdrawalModal.componentInstance.withdrawType = this.withdrawForm.get('withdrawType').value;
    this.cfmWithdrawalModal.componentInstance.portfolioValue = this.formValues.withdrawPortfolio.portfolioValue;
    this.cfmWithdrawalModal.componentInstance.portfolio = this.formValues.withdrawPortfolio;
    this.cfmWithdrawalModal.componentInstance.userInfo = this.signUpService.getUserProfileInfo();
    this.cfmWithdrawalModal.componentInstance.confirmed.subscribe(() => {
      this.cfmWithdrawalModal.close();
      this.manageInvestmentsService.setWithdrawalTypeFormData(form.getRawValue(), this.isRedeemAll);
      this.saveWithdrawal();
      // confirmed
    });
    this.cfmWithdrawalModal.componentInstance.showLearnMore.subscribe(() => {
      this.cfmWithdrawalModal.close();
      this.showLearnMoreModal(form);
    });
    this.dismissPopup(this.cfmWithdrawalModal);
  }

  showLearnMoreModal(form) {
    const learnMoreRef = this.modal.open(ForwardPricingModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
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
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant('WITHDRAW.WITHDRAW_REQUEST_LOADER.TITLE'),
        desc: this.translate.instant('WITHDRAW.WITHDRAW_REQUEST_LOADER.DESC')
      });
      this.manageInvestmentsService.sellPortfolio(this.formValues).subscribe(
        (response) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          if (response.responseMessage.responseCode < 6000) {
            if(response.responseMessage.responseCode == 5129) {
              // Insufficient balance Error due to pending withdrawal request in progress
              this.showCustomErrorModal(
                this.translate.instant('ERROR.ERROR_TEXT'),
                this.translate.instant('WITHDRAW.PENDING_WITHDRAWAL_ERROR')
              );
            } else if (
              response.objectList &&
              response.objectList.length &&
              response.objectList[response.objectList.length - 1].serverStatus &&
              response.objectList[response.objectList.length - 1].serverStatus.errors &&
              response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              this.showCustomErrorModal(
                this.translate.instant('ERROR.ERROR_TEXT'),
                response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg
              );
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal(this.translate.instant('ERROR.ERROR_TEXT'), errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else {
            this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.WITHDRAWAL_SUCCESS]);
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.manageInvestmentsService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      const amtControl = this.withdrawForm.get('withdrawAmount');
      if (amtControl) {
        amtControl.setValue(amtControl.value.toString().replace(/,/g, '').trim());
      }
      this.manageInvestmentsService.setWithdrawalTypeFormData(form.getRawValue(), this.isRedeemAll);
      if (
        form.value.withdrawType.id ===
        MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.CASH_TO_BANK_TYPE_ID ||
        form.value.withdrawType.id ===
        MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.PORTFOLIO_TO_BANK_TYPE_ID
      ) {
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.WITHDRAWAL_PAYMENT_METHOD]);
      } else {
        this.showConfirmWithdrawModal(form);
      }
    }
  }

  withdrawAmountValidator(balance, source): ValidatorFn {
    balance = balance ? parseFloat(this.decimalPipe.transform(balance, "1.2-2").replace(/,/g, "")) : 0;
    return (control: AbstractControl) => {
      if (control && !isNaN(control.value)) {
        let userInput = control.value ? parseFloat(this.decimalPipe.transform(control.value.replace(/,/g, ""), "1.2-2").replace(/,/g, "")) : 0;
        if (userInput <= 0) { // Not less than 0
          return { MinValue: true };
        }
        else if (userInput > balance) { // Not greater than available balance
          if (source === 'PORTFOLIO') {
            return { MoreThanBalancePortfolio: true };
          } else {
            return { MoreThanBalanceCash: true };
          }
        } else if ((source === 'PORTFOLIO') && (balance - userInput >= MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_BALANCE_AMOUNT)) { // Minimum Withdrawal Check
          if (userInput < MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT) {
            return { MinWithdrawal: true };
          }
        } else if ((source === 'CASH_ACCOUNT')) { // Minimum Withdrawal Check
          if (userInput < MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT) {
            return { MinWithdrawal: true };
          }
        } else if ((source === 'PORTFOLIO') && (balance - userInput < MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_BALANCE_AMOUNT) && (userInput != balance)) { // Minimum Balance Check
          return { MinBalance: true };
        } else { // Successful Validation
          return null;
        }
      }
    };
  }

  redeemAllChecked() {
    if (this.withdrawForm.controls.withdrawRedeem.value && this.withdrawForm.controls.withdrawPortfolio.value) {
      const cashBalance = (this.isFromPortfolio) ? this.withdrawForm.controls.withdrawPortfolio.value.portfolioValue.toString() :
        this.cashBalance.toString();
      this.withdrawForm.controls.withdrawAmount.setValue(cashBalance);
      this.withdrawForm.get('withdrawAmount').disable();
      this.isRedeemAllChecked = true;
    } else {
      this.withdrawForm.controls.withdrawAmount.setValue("0");
      this.withdrawForm.get('withdrawAmount').enable();
      this.isRedeemAllChecked = false;
    }
  }
  checkRedeemAll() {
    if (this.withdrawForm.controls.withdrawPortfolio.value) {
      const cashBalance = (this.isFromPortfolio) ? this.withdrawForm.controls.withdrawPortfolio.value.portfolioValue ? this.withdrawForm.controls.withdrawPortfolio.value.portfolioValue : 0 :
        this.cashBalance;
      // Minimum cash balance amount 50
      if (cashBalance <= (MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_WITHDRAW_AMOUNT + MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.MIN_BALANCE_AMOUNT) && cashBalance > 0) {
        this.withdrawForm.controls.withdrawRedeem.setValue(true);
        this.withdrawForm.controls.withdrawAmount.setValue(cashBalance.toString());
        this.withdrawForm.get('withdrawAmount').disable();
        this.withdrawForm.get('withdrawRedeem').disable();
        this.isRedeemAllChecked = true;
      } else {
        this.withdrawForm.controls.withdrawRedeem.setValue(false);
        this.withdrawForm.controls.withdrawAmount.setValue("0");
        this.withdrawForm.get('withdrawAmount').enable();
        if (cashBalance > 0) {
          this.withdrawForm.get('withdrawRedeem').enable();
        } else {
          this.withdrawForm.get('withdrawRedeem').disable();
        }
        this.isRedeemAllChecked = false;
      }
    }
  }

  enableRedeem() {
    this.withdrawForm.controls.withdrawRedeem.setValue(true);
    this.isRedeemAllChecked = true;
  }
}

