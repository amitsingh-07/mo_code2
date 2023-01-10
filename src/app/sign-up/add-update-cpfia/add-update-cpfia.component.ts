import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subject, Subscription } from 'rxjs';

import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { InvestmentEngagementJourneyService } from '../../investment/investment-engagement-journey/investment-engagement-journey.service';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { LoaderService } from '../../shared/components/loader/loader.service';

import { InvestmentCommonService } from '../../investment/investment-common/investment-common.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-add-update-cpfia',
  templateUrl: './add-update-cpfia.component.html',
  styleUrls: ['./add-update-cpfia.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUpdateCpfiaComponent implements OnInit {
  pageTitle: string;
  addUpdateCpfFrom: FormGroup;
  formValues;
  investmentAccountFormValues;
  fundingMethods: any;
  cpfAgentBankList;
  cpfDetail;
  isEdit = true;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  subscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private footerService: FooterService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpService: SignUpService,
    private authService: AuthenticationService,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    public readonly translate: TranslateService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    private loaderService: LoaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('ADD_UPDATE_CPFIA.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit(): void {
    this.subscribeBackEvent();
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.cpfDetail = this.signUpService.getCpfDetails();
    this.buildForm();
    this.getCPFBankOperator();

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
    
    this.authService.get2faAuthEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((token) => {
        if (!token) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
        }
      });

    this.manageInvestmentsService.getProfileCPFIAccountDetails(false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        if (data) {
          this.cpfDetail = data;
          this.addUpdateCpfFrom.patchValue({
            cpfOperator: { name: data.cpfiaOperator },
            cpfAccount: data.cpfiaAccountNumber.conformedValue
          });
        }
      });
  }
  getCPFBankOperator() {
    this.investmentAccountService.getSpecificDropList('cpfAgentBank').subscribe((data) => {
      this.cpfAgentBankList = data.objectList.cpfAgentBank;
    }, () => {
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
  buildForm() {
    this.addUpdateCpfFrom = this.formBuilder.group({
      cpfOperator: [this.cpfDetail && this.cpfDetail.cpfOperatorBank, [Validators.required]],
      cpfAccount: [this.cpfDetail && this.cpfDetail.cpfAccountNumber, [Validators.required]]
    });
  }
  selectCPFOperator(key, value) {
    this.addUpdateCpfFrom.controls[key].setValue(value);
    this.addUpdateCpfFrom.controls['cpfAccount'].setValue(null);
    this.addorRemoveAccNoValidator();
  }
  addorRemoveAccNoValidator() {
    const accNoControl = this.addUpdateCpfFrom.get('cpfAccount');
    const selectedBank = this.addUpdateCpfFrom.get('cpfOperator').value;
    if (selectedBank) {
      switch (selectedBank.name.toUpperCase()) {
        case SIGN_UP_CONFIG.BANK_KEYS.DBS:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.DBS)]);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.OCBC:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.OCBC)]);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.UOB:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.UOB)]);
          break;
      }
      this.addUpdateCpfFrom.updateValueAndValidity();
    }
  }
  getOperatorIdByName(operatorName, OperatorOptions) {
    if (operatorName && OperatorOptions) {
      const operatorBank = OperatorOptions.filter(
        (prop) => prop.name === operatorName
      );
      return operatorBank[0].id;
    } else {
      return '';
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
      if (content.length >= SIGN_UP_CONFIG.ACCOUNT_NUM_MAX_LIMIT) {
        const contentList = content.substring(0, SIGN_UP_CONFIG.ACCOUNT_NUM_MAX_LIMIT);
        const el = document.querySelector('#' + id);
        this.investmentAccountService.setCaratTo(el, SIGN_UP_CONFIG.ACCOUNT_NUM_MAX_LIMIT, contentList);
      }
    }
  }

  maskConfig() {
    const config = {
      mask: RegexConstants.operatorMask.DBS
    };
    if (this.addUpdateCpfFrom.get('cpfOperator').value) {
      const operator = this.addUpdateCpfFrom.get('cpfOperator').value.name;
      if (operator) {
        switch (operator.toUpperCase()) {
          case SIGN_UP_CONFIG.BANK_KEYS.DBS:
            config.mask = RegexConstants.cpfOperatorMask.DBS;
            break;
          case SIGN_UP_CONFIG.BANK_KEYS.OCBC:
            config.mask = RegexConstants.cpfOperatorMask.OCBC;
            break;
          case SIGN_UP_CONFIG.BANK_KEYS.UOB:
            config.mask = RegexConstants.cpfOperatorMask.UOB;
            break;
        }
      }
    }
    return config;
  }

  getAccNoLength() {
    if (this.addUpdateCpfFrom.get('cpfOperator').value) {
      const accNo = this.addUpdateCpfFrom.get('cpfAccount').value;
      if (accNo) {
        return accNo.match(/\d/g).join('').length;
      } else {
        return 0;
      }
    }
  }

  getAccNoMaxLength() {
    let accNoMaxLength;
    switch (this.addUpdateCpfFrom.get('cpfOperator').value.name) {
      case SIGN_UP_CONFIG.BANK_KEYS.DBS:
        accNoMaxLength = 13;
        break;
      case SIGN_UP_CONFIG.BANK_KEYS.OCBC:
        accNoMaxLength = 9;
        break;
      case SIGN_UP_CONFIG.BANK_KEYS.UOB:
        accNoMaxLength = 9;
        break;
    }
    return accNoMaxLength;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  updateCPFSaveCall(form: any) {
    if (!form.valid) {
      return false;
    } else if (this.isEdit) {
      this.isEdit = false;
      const formValue = form.getRawValue();
      const reqParams = {};
      const opertorId = this.getOperatorIdByName(formValue.cpfOperator.name, this.cpfAgentBankList);
      reqParams['cpfDetails'] = {
        accountNumber: formValue.cpfAccount ? formValue.cpfAccount.replace(/[-]/g, '') : null,
        operatorId: opertorId ? opertorId : null
      };
      const json = {
        accountNumber: formValue.cpfAccount ? formValue.cpfAccount.replace(/[-]/g, '') : null,
        bankOperatorId: opertorId ? opertorId : null
      }
      this.showLoader();
      this.investmentCommonService.saveCKABankAccount(json).subscribe(() => {
        this.loaderService.hideLoaderForced();
        this.isEdit = true;
        this.manageInvestmentsService.setCpfiaAccountDetails(null);
        this.manageInvestmentsService.setCPFSuccessFlag(true);
        this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
      }, () => {
        this.isEdit = true;
        this.loaderService.hideLoaderForced();
        this.investmentAccountService.showGenericErrorModal();
      });
    }
  }

  subscribeBackEvent() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE])
      }
    });
  }
  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }
}
