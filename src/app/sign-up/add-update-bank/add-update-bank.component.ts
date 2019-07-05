import { distinctUntilChanged } from 'rxjs/operators';

import { Component, OnInit, ViewEncapsulation,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    IfastErrorModalComponent
} from '../../shared/modal/ifast-error-modal/ifast-error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-add-update-bank',
  templateUrl: './add-update-bank.component.html',
  styleUrls: ['./add-update-bank.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUpdateBankComponent implements OnInit {
  pageTitle;
  formValues: any;
  banks: any;
  bankForm: FormGroup;
  addBank: any;
  queryParams: any;
  buttonTitle;
  updateId: any;
  isAccountEdited: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private footerService: FooterService,
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpService: SignUpService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService,
    public topupAndWithDrawService: TopupAndWithDrawService,
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
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(102);
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
      this.isAccountEdited = true;
    });
  }
  buildBankForm() {
    this.formValues = this.investmentAccountService.getBankInfo();
    this.updateId = this.formValues.id;
    this.bankForm = this.formBuilder.group({
      accountHolderName: [this.formValues.fullName, [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
      bank: [this.formValues.bank, [Validators.required]],
      accountNo: [this.formValues.accountNumber, [Validators.required]]
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
    } else {
      // tslint:disable-next-line:no-all-duplicated-branches
      if (this.addBank === 'true') {
        // Add Bank API Here
        this.loaderService.showLoader({
          title: this.translate.instant('GENERAL_LOADER.TITLE'),
          desc: this.translate.instant('GENERAL_LOADER.DESC')
        });
        this.topupAndWithDrawService.saveNewBank(form.getRawValue()).subscribe((response) => {
          this.loaderService.hideLoader();
          if (response.responseMessage.responseCode < 6000) {
            if (
              response.objectList &&
              response.objectList.length &&
              response.objectList[response.objectList.length - 1].serverStatus &&
              response.objectList[response.objectList.length - 1].serverStatus.errors &&
              response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              const errorResponse = response.objectList[response.objectList.length - 1];
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
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        });
      } else {
        // tslint:disable-next-line:max-line-length
        let accountNum = null;
        if (this.isAccountEdited) {
          accountNum = form.value.accountNo;
        }
        this.loaderService.showLoader({
          title: this.translate.instant('GENERAL_LOADER.TITLE'),
          desc: this.translate.instant('GENERAL_LOADER.DESC')
        });
        this.signUpService.updateBankInfo(form.value.bank,
          form.value.accountHolderName, accountNum, this.updateId).subscribe((data) => {
          this.loaderService.hideLoader();
          // tslint:disable-next-line:triple-equals
          if (data.responseMessage.responseCode < 6000) {
            if (
              data.objectList &&
              data.objectList.length &&
              data.objectList[data.objectList.length - 1].serverStatus &&
              data.objectList[data.objectList.length - 1].serverStatus.errors &&
              data.objectList[data.objectList.length - 1].serverStatus.errors.length
            ) {
            const errorResponse = data.objectList[data.objectList.length - 1];
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
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        });
        // Edit Bank APi here
      }
    }
  }
  getLookupList() {
    this.topupAndWithDrawService.getAllDropDownList().subscribe((data) => {
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
