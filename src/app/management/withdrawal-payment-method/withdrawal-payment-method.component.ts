import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AccountCreationService } from '../../account-creation/account-creation-service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { AddBankModalComponent } from '../add-bank-modal/add-bank-modal.component';
import {
    ConfirmWithdrawalModalComponent
} from '../confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import {
    ForwardPricingModalComponent
} from '../forward-pricing-modal/forward-pricing-modal.component';
import { MANAGEMENT_ROUTE_PATHS } from '../management-routes.constants';
import { ManagementService } from '../management.service';

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
  userInfo: any;
  fullName: string;
  hideAddBankAccount = true;
  isRequestSubmitted = false;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public footerService: FooterService,
    public navbarService: NavbarService,
    public managementService: ManagementService,
    private loaderService: LoaderService,
    private accountCreationService: AccountCreationService,
    private signUpService: SignUpService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getLookupList();
    this.getUserBankList();
    this.getUserAddress();
    this.formValues = this.managementService.getTopUpFormData();
    this.userInfo = this.signUpService.getUserProfileInfo();
    this.fullName = this.userInfo.fullName ? this.userInfo.fullName : this.userInfo.firstName + ' ' + this.userInfo.lastName;
  }

  getLookupList() {
    this.managementService.getAllDropDownList().subscribe((data) => {
      this.banks = data.objectList.bankList;
    },
      (err) => {
        this.accountCreationService.showGenericErrorModal();
      });
  }

  getUserBankList() {
    this.managementService.getUserBankList().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        this.userBankList = data.objectList;
        if (this.userBankList.length > 0) {
          this.hideAddBankAccount = false;
        }
        this.pageTitle = this.getTitle();
        this.setPageTitle(this.pageTitle);
      }
    },
      (err) => {
        this.accountCreationService.showGenericErrorModal();
      });
  }

  getTitle() {
    let title = '';
    title = this.hideAddBankAccount
      ? this.translate.instant('WITHDRAW_PAYMENT_METHOD.ADD_BANK_ACCOUNT')
      : this.translate.instant('WITHDRAW_PAYMENT_METHOD.BANK_DETAIL');
    return title;
  }

  getUserAddress() {
    this.managementService.getUserAddress().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        this.userAddress = data.objectList.mailingAddress
          ? data.objectList.mailingAddress
          : data.objectList.homeAddress;
      }
    },
      (err) => {
        this.accountCreationService.showGenericErrorModal();
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
    ref.componentInstance.portfolio = this.formValues.withdrawPortfolio;
    if (this.userBankList && this.userBankList.length) {
      ref.componentInstance.bankAccountNo = this.userBankList[0].accountNumber;
    }
    ref.componentInstance.userInfo = this.userInfo;
    ref.componentInstance.confirmed.subscribe((data) => {
      ref.close();
      this.saveWithdrawal();
      // confirmed
    });
    ref.componentInstance.showLearnMore.subscribe(() => {
      ref.close();
      this.showLearnMoreModal();
    });
    this.dismissPopup(ref);
  }

  showLearnMoreModal() {
    const learnMoreRef = this.modal.open(ForwardPricingModalComponent, {
      centered: true,
      backdrop : 'static',
      keyboard : false
    });
    learnMoreRef.result.then((data) => {
    }, (reason) => {
      learnMoreRef.close();
      this.showConfirmWithdrawModal();
      // on dismiss
    });
  }

  currentPortfolioValue() {
    if (this.formValues.withdrawPortfolio) {
      const portfolioValue = this.formValues.withdrawPortfolio.currentValue;
      return portfolioValue;
    }
   }

  showNewBankFormModal() {
    const ref = this.modal.open(AddBankModalComponent, {
      centered: true
    });
    ref.componentInstance.banks = this.banks;
    ref.componentInstance.fullName = this.fullName;
    ref.componentInstance.saved.subscribe((data) => {
      ref.close();
      this.managementService.saveNewBank(data).subscribe((response) => {
        if (response.responseMessage.responseCode >= 6000) {
          this.getUserBankList(); // refresh updated bank list
        } else if (
          response.objectList &&
          response.objectList.length &&
          response.objectList[response.objectList.length - 1].serverStatus &&
          response.objectList[response.objectList.length - 1].serverStatus.errors &&
          response.objectList[response.objectList.length - 1].serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg + '('
            + response.objectList[response.objectList.length - 1].serverStatus.errors[0].code + ')'
          );
        } else if (response.responseMessage && response.responseMessage.responseDescription) {
          const errorResponse = response.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.accountCreationService.showGenericErrorModal();
        }
      },
        (err) => {
          this.accountCreationService.showGenericErrorModal();
        });
    });
    this.dismissPopup(ref);
  }
  showEditBankFormModal(index) {
    const ref = this.modal.open(AddBankModalComponent, {
      centered: true
    });
    ref.componentInstance.bankDetails = this.userBankList[index];
    ref.componentInstance.fullName = this.fullName;
    ref.componentInstance.banks = this.banks;
    ref.componentInstance.saved.subscribe((data) => {
      ref.close();
      this.managementService.updateBankInfo(data.bank, data.accountHolderName,
         data.accountNo,  this.userBankList[index].id).subscribe((response) => {
        if (response.responseMessage.responseCode >= 6000) {
          this.getUserBankList(); // refresh updated bank list
        } else if (
          response.objectList &&
          response.objectList.length &&
          response.objectList[response.objectList.length - 1].serverStatus &&
          response.objectList[response.objectList.length - 1].serverStatus.errors &&
          response.objectList[response.objectList.length - 1].serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            response.objectList[response.objectList.length - 1].serverStatus.errors[0].msg + '('
            + response.objectList[response.objectList.length - 1].serverStatus.errors[0].code + ')'
          );
        } else if (response.responseMessage && response.responseMessage.responseDescription) {
          const errorResponse = response.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.accountCreationService.showGenericErrorModal();
        }
      },
        (err) => {
          this.accountCreationService.showGenericErrorModal();
        });
    });
    this.dismissPopup(ref);
   }
  saveWithdrawal() {
    if(!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant('WITHDRAW.WITHDRAW_REQUEST_LOADER.TITLE'),
        desc: this.translate.instant('WITHDRAW.WITHDRAW_REQUEST_LOADER.DESC')
      });
      this.managementService.sellPortfolio(this.formValues).subscribe(
        (response) => {
          this.isRequestSubmitted = false;
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
              this.accountCreationService.showGenericErrorModal();
            }
          } else {
            this.router.navigate([MANAGEMENT_ROUTE_PATHS.WITHDRAWAL_SUCCESS]);
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.accountCreationService.showGenericErrorModal();
        }
      );
    }
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }
  gotoEditProfile() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
  }
  goToNext() {
    this.showConfirmWithdrawModal();
  }
}
