import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS, MANAGE_INVESTMENTS_ROUTES } from '../manage-investments-routes.constants';
import { ManageInvestmentsService } from '../manage-investments.service';
import { ConfirmWithdrawalModalComponent } from '../withdrawal/confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import {
  ForwardPricingModalComponent
} from '../withdrawal/forward-pricing-modal/forward-pricing-modal.component';
import { AddBankModalComponent } from './add-bank-modal/add-bank-modal.component';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { INVESTMENT_ACCOUNT_ROUTES, INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';


@Component({
  selector: 'app-withdrawal-bank-account',
  templateUrl: './withdrawal-bank-account.component.html',
  styleUrls: ['./withdrawal-bank-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WithdrawalBankAccountComponent implements OnInit, OnDestroy {
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
  error2fa: any;
  activeRef: any;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public footerService: FooterService,
    public navbarService: NavbarService,
    public manageInvestmentsService: ManageInvestmentsService,
    private loaderService: LoaderService,
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    private authService: AuthenticationService
  ) {
    this.translate.use('en');
    this.translate.get('ERROR').subscribe((results: any) => {
      this.error2fa = {
        title: results.SESSION_2FA_EXPIRED.TITLE,
        subtitle: results.SESSION_2FA_EXPIRED.SUB_TITLE,
        button: results.SESSION_2FA_EXPIRED.BUTTON,
      };

      this.authService.get2faErrorEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
          if (data) {
            if (this.activeRef !== undefined) {
              this.activeRef.close();
            }
            this.authService.openErrorModal(this.error2fa.title, this.error2fa.subtitle, this.error2fa.button);
          }
        });
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(10);
    this.footerService.setFooterVisibility(false);
    this.getLookupList();
    this.getUserBankList();
    this.getUserAddress();
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.userInfo = this.signUpService.getUserProfileInfo();
    this.fullName = this.userInfo.fullName ? this.userInfo.fullName : this.userInfo.firstName + ' ' + this.userInfo.lastName;

    this.signUpService.getEditProfileInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        const personalData = data.objectList.personalInformation;
        if (personalData) {
          this.signUpService.setContactDetails(personalData.countryCode, personalData.mobileNumber, personalData.email);
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getLookupList() {
    this.manageInvestmentsService.getAllDropDownList().subscribe((data) => {
      this.banks = data.objectList.bankList;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  getUserBankList() {
    this.manageInvestmentsService.getUserBankList().subscribe((data) => {
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
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  getTitle() {
    let title = '';
    title = this.translate.instant('WITHDRAW_PAYMENT_METHOD.BANK_DETAIL');
    return title;
  }

  getUserAddress() {
    this.manageInvestmentsService.getUserAddress().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        this.userAddress = data.objectList.mailingAddress
          ? data.objectList.mailingAddress
          : data.objectList.homeAddress;
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
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
    this.activeRef = this.modal.open(ConfirmWithdrawalModalComponent, {
      centered: true
    });
    this.activeRef.componentInstance.withdrawAmount = this.formValues.withdrawAmount;
    this.activeRef.componentInstance.withdrawType = this.formValues.withdrawType;
    this.activeRef.componentInstance.portfolio = this.formValues.withdrawPortfolio;
    if (this.userBankList && this.userBankList.length) {
      this.activeRef.componentInstance.bankAccountNo = this.userBankList[0].accountNumber;
      this.formValues['bankAccountNo'] = this.userBankList[0].accountNumber;
    }
    this.activeRef.componentInstance.userInfo = this.userInfo;
    this.activeRef.componentInstance.confirmed.subscribe((data) => {
      this.activeRef.close();
      this.saveWithdrawal();
      // confirmed
    });
    this.activeRef.componentInstance.showLearnMore.subscribe(() => {
      this.dismissPopup(this.activeRef);
      this.showLearnMoreModal();
    });
    this.dismissPopup(this.activeRef);
  }

  showLearnMoreModal() {
    const learnMoreRef = this.modal.open(ForwardPricingModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
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

  verify2faNewBank() {
    if (this.authService.is2FAVerified()) {
      this.showNewBankFormModal();
    } else {
      this.signUpService.setRedirectUrl(MANAGE_INVESTMENTS_ROUTE_PATHS.WITHDRAWAL_PAYMENT_METHOD);
      this.authService.set2faVerifyAllowed(true);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_2FA], { skipLocationChange: true });
    }
  }

  showNewBankFormModal() {
    this.activeRef = this.modal.open(AddBankModalComponent, {
      centered: true
    });
    this.activeRef.componentInstance.banks = this.banks;
    this.activeRef.componentInstance.fullName = this.fullName;
    this.activeRef.componentInstance.saved.subscribe((data) => {
      this.activeRef.close();
      this.manageInvestmentsService.saveProfileNewBank(data).subscribe((response) => {
        if (response.responseMessage.responseCode >= 6000) {
          this.getUserBankList(); // refresh updated bank list
        } else if (
          response.objectList &&
          response.objectList.serverStatus &&
          response.objectList.serverStatus.errors &&
          response.objectList.serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            response.objectList.serverStatus.errors[0].msg + '('
            + response.objectList.serverStatus.errors[0].code + ')'
          );
        } else if (response.responseMessage && response.responseMessage.responseDescription) {
          const errorResponse = response.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.investmentAccountService.showGenericErrorModal();
        }
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
    });
    this.dismissPopup(this.activeRef);
  }

  verify2faEditBank(index) {
    if (this.authService.is2FAVerified()) {
      this.showEditBankFormModal(index);
    } else {
      this.signUpService.setRedirectUrl(MANAGE_INVESTMENTS_ROUTE_PATHS.WITHDRAWAL_PAYMENT_METHOD);
      this.authService.set2faVerifyAllowed(true);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_2FA], { skipLocationChange: true });
    }
  }
  showEditBankFormModal(index) {
    this.activeRef = this.modal.open(AddBankModalComponent, {
      centered: true
    });
    this.activeRef.componentInstance.bankDetails = this.userBankList[index];
    this.activeRef.componentInstance.fullName = this.fullName;
    this.activeRef.componentInstance.banks = this.banks;
    this.activeRef.componentInstance.saved.subscribe((data) => {
      this.activeRef.close();
      this.manageInvestmentsService.updateBankInfo(data.bank, data.accountHolderName,
        data.accountNo, this.userBankList[index].id).subscribe((response) => {
          if (response.responseMessage.responseCode >= 6000) {
            this.getUserBankList(); // refresh updated bank list
          } else if (
            response.objectList &&
            response.objectList.serverStatus &&
            response.objectList.serverStatus.errors &&
            response.objectList.serverStatus.errors.length
          ) {
            this.showCustomErrorModal(
              'Error!',
              response.objectList.serverStatus.errors[0].msg + '('
              + response.objectList.serverStatus.errors[0].code + ')'
            );
          } else if (response.responseMessage && response.responseMessage.responseDescription) {
            const errorResponse = response.responseMessage.responseDescription;
            this.showCustomErrorModal('Error!', errorResponse);
          } else {
            this.investmentAccountService.showGenericErrorModal();
          }
        },
          (err) => {
            this.investmentAccountService.showGenericErrorModal();
          });
    });
    this.dismissPopup(this.activeRef);
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
  gotoEditProfile() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
  }
  goToNext() {
    this.showConfirmWithdrawModal();
  }
}
