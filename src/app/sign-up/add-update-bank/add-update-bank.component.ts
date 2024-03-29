import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Component, HostListener, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';

import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  IfastErrorModalComponent
} from '../../shared/modal/ifast-error-modal/ifast-error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { environment } from './../../../environments/environment';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-add-update-bank',
  templateUrl: './add-update-bank.component.html',
  styleUrls: ['./add-update-bank.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUpdateBankComponent implements OnInit, OnDestroy {
  pageTitle;
  formValues: any;
  banks: any;
  bankForm: FormGroup;
  addBank: any;
  queryParams: any;
  buttonTitle;
  updateId: any;
  isEdit = true;
  subscription: Subscription;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private footerService: FooterService,
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public authService: AuthenticationService,
    private signUpService: SignUpService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    public readonly translate: TranslateService,
    private loaderService: LoaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.subscribeBackEvent();
    this.navbarService.setNavbarMobileVisibility(true);
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(104);
    } else {
      this.navbarService.setNavbarMode(102);
    }
    this.queryParams = this.route.snapshot.queryParams;
    this.addBank = this.queryParams.addBank;
    this.translate.get('COMMON').subscribe(() => {
      if (this.addBank === 'true') {
        this.pageTitle = this.translate.instant('ADD_BANK.ADD');
        this.buttonTitle = this.translate.instant('ADD_BANK.ADD_NOW');
      } else {
        this.pageTitle = this.translate.instant('ADD_BANK.EDIT');
        this.buttonTitle = this.translate.instant('ADD_BANK.APPLY');
      }
      this.setPageTitle(this.pageTitle);
    });
    this.footerService.setFooterVisibility(false);
    this.getLookupList();
    this.buildBankForm();

    this.bankForm.get('accountNo').valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      this.bankForm.get('accountNo').setValidators([Validators.required,
      this.signUpService.validateBankAccNo]);
      this.bankForm.get('accountNo').updateValueAndValidity();
    });

    this.authService.get2faAuthEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((token) => {
        if (!token) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
        } else {
          if (this.formValues && this.formValues.customerPortfolioId) {
            this.getUserBankList(this.formValues.customerPortfolioId, true);
          } else {
            this.getUserBankList('', false);
          }
        }
      });

    this.translate.get('ERROR').subscribe((results) => {
      this.authService.get2faErrorEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
          if (data) {
            this.authService.openErrorModal(
              results.SESSION_2FA_EXPIRED.TITLE,
              results.SESSION_2FA_EXPIRED.SUB_TITLE,
              results.SESSION_2FA_EXPIRED.BUTTON
            );
          }
        });
    });
  }

  getUnmaskedBankDetails() {
    this.signUpService.getEditProfileInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (this.formValues && this.formValues.customerPortfolioId && data.objectList.customerJointAccountBankDetails && data.objectList.customerJointAccountBankDetails.length > 0) {
          data.objectList.customerJointAccountBankDetails.forEach(portfolio => {
            if (portfolio.customerPortfolioId == this.formValues.customerPortfolioId) {
              this.investmentAccountService.setJAPortfolioBankDetail(portfolio.accountHolderName, portfolio.bank, portfolio.bankAccountNumber, portfolio.customerPortfolioId, portfolio.id);
              this.bankForm.patchValue({
                accountHolderName: portfolio.accountHolderName,
                bank: portfolio.bank,
                accountNo: portfolio.bankAccountNumber
              });
            }
          });
        } else if (data.objectList.customerBankDetail && data.objectList.customerBankDetail.length > 0) {
          const bankDetails = data.objectList.customerBankDetail[0];
          this.investmentAccountService.setEditProfileBankDetail(bankDetails.accountName, bankDetails.bank, bankDetails.accountNumber, bankDetails.id, false);
          this.bankForm.patchValue({
            accountHolderName: bankDetails.accountName,
            bank: bankDetails.bank,
            accountNo: bankDetails.accountNumber
          });
        }
      });
  }

  subscribeBackEvent() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE])
      }
    });
  }

  getUserBankList(customerPortfolioId, isJointAccount) {
    this.manageInvestmentsService.getUserBankList(customerPortfolioId, isJointAccount).subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000) {
        if (data && data.objectList && data.objectList.length > 0) {
          const bank = data.objectList[0]
          this.investmentAccountService.setJAPortfolioBankDetail(bank.accountName, bank.bank, bank.accountNumber, bank.customerPortfolioId, bank.id);
          this.bankForm.patchValue({
            accountHolderName: bank.accountName,
            bank: bank.bank,
            accountNo: bank.accountNumber
          });
        }
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  ngOnDestroy() {
    this.signUpService.clearRedirectUrl();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.navbarService.unsubscribeBackPress();
    this.subscription.unsubscribe();
  }

  buildBankForm() {
    this.formValues = this.investmentAccountService.getBankInfo();
    this.updateId = this.formValues.id;
    this.bankForm = this.formBuilder.group({
      accountHolderName: [this.formValues.fullName, [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
      bank: [this.formValues.bank, [Validators.required]],
      accountNo: [this.formValues.accountNumber, [Validators.required]],
      customerPortfolioId: this.formValues && this.formValues.customerPortfolioId ? this.formValues.customerPortfolioId : '',
      isJAAccount: this.formValues && this.formValues.customerPortfolioId ? true : false
    });
  }
  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  setDropDownValue(key, value) {
    this.bankForm.controls[key].setValue(value);
    this.bankForm.get('accountNo').updateValueAndValidity();
  }
  setNestedDropDownValue(key, value, nestedKey) {
    this.bankForm.controls[nestedKey]['controls'][key].setValue(value);
  }
  // tslint:disable-next-line:cognitive-complexity
  applyChanges(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.signUpService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else if (this.isEdit) {
      this.isEdit = false;
      // tslint:disable-next-line:no-all-duplicated-branches
      if (this.addBank === 'true') {
        // Add Bank API Here
        this.loaderService.showLoader({
          title: this.translate.instant('GENERAL_LOADER.TITLE'),
          desc: this.translate.instant('GENERAL_LOADER.DESC')
        });
        // PASSING NULL AND FALSE VALUES AS THIS API IS CALLED FROM PROFILE PAGE TO 
        // EDIT OR ADD BANK DETAILS
        this.manageInvestmentsService.saveProfileNewBank(form.getRawValue(), '', false).subscribe((response) => {
          this.loaderService.hideLoader();
          this.isEdit = true;
          if (response.responseMessage.responseCode < 6000) {
            if (
              response.objectList &&
              response.objectList.serverStatus &&
              response.objectList.serverStatus.errors &&
              response.objectList.serverStatus.errors.length
            ) {
              const errorResponse = response.objectList;
              const errorList = errorResponse.serverStatus.errors;
              this.showIfastErrorModal(errorList);
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal('Error!', errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else {
            this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
          }
        },
          (err) => {
            this.isEdit = true;
            this.loaderService.hideLoader();
            this.investmentAccountService.showGenericErrorModal();
          });
      } else {
        // tslint:disable-next-line:max-line-length
        const accountNum = form.value.accountNo;
        this.loaderService.showLoader({
          title: this.translate.instant('GENERAL_LOADER.TITLE'),
          desc: this.translate.instant('GENERAL_LOADER.DESC')
        });
        // PASSING NULL AND FALSE VALUES AS THIS API IS CALLED FROM PROFILE PAGE TO 
        // EDIT OR ADD BANK DETAILS
        this.signUpService.updateBankInfoProfile(form.value.bank,
          form.value.accountHolderName, accountNum, this.updateId, form.value.customerPortfolioId, form.value.isJAAccount).subscribe((data) => {
            this.loaderService.hideLoader();
            this.isEdit = true;
            // tslint:disable-next-line:triple-equals
            if (data.responseMessage.responseCode < 6000) {
              if (
                data.objectList &&
                data.objectList.serverStatus &&
                data.objectList.serverStatus.errors &&
                data.objectList.serverStatus.errors.length
              ) {
                const errorResponse = data.objectList;
                const errorList = errorResponse.serverStatus.errors;
                this.showIfastErrorModal(errorList);
              } else if (data.responseMessage && data.responseMessage.responseDescription) {
                const errorResponse = data.responseMessage.responseDescription;
                this.showCustomErrorModal('Error!', errorResponse);
              } else {
                this.investmentAccountService.showGenericErrorModal();
              }
            } else {
              this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
            }
          },
            (err) => {
              this.isEdit = true;
              this.loaderService.hideLoader();
              this.investmentAccountService.showGenericErrorModal();
            });
        // Edit Bank APi here
      }
    }
  }
  getLookupList() {
    this.manageInvestmentsService.getAllDropDownList().subscribe((data) => {
      this.banks = data.objectList.bankList;
    });
  }

  showIfastErrorModal(errorList) {
    const errorTitle = this.translate.instant(
      'IFAST_ERROR_TITLE'
    );
    const ref = this.modal.open(IfastErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorList = errorList;
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }
  // #ALLOWING 100 CHARACTERS ACCOUNT HOLDER NAME
  setAccountHolderName(accountHolderName: any) {
    if (accountHolderName !== undefined) {
      accountHolderName = accountHolderName.replace(/\n/g, '');
      this.bankForm.controls.accountHolderName.setValue(accountHolderName);
      return accountHolderName;
    }
  }

  onKeyPressEvent(event: any, content: any) {
    this.investmentAccountService.onKeyPressEvent(event, content);
  }

  @HostListener('input', ['$event'])
  onChange(event) {
    const id = event.target.id;
    if (id !== '') {
      const content = event.target.innerText;
      if (content.length >= 100) {
        const contentList = content.substring(0, 100);
        this.bankForm.controls.accountHolderName.setValue(contentList);
        const el = document.querySelector('#' + id);
        this.investmentAccountService.setCaratTo(el, 100, contentList);
      }
    }
  }
}
