import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentCommonService } from '../investment-common.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { CpfiaTooltipComponent } from './cpfia-tooltip/cpfia-tooltip.component';
import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';
import { Util } from '../../../shared/utils/util';

@Component({
  selector: 'app-cpf-prerequisites',
  templateUrl: './cpf-prerequisites.component.html',
  styleUrls: ['./cpf-prerequisites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CpfPrerequisitesComponent implements OnInit {

  pageTitle: string;
  preRequisitesForm: FormGroup;
  ckaInfo: any;
  cpfBankOperators: any;
  cpfBankDetails: any;
  showOperatorBank = false;

  constructor(
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private modal: NgbModal,
    private investmentCommonService: InvestmentCommonService,
    private investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CPF_PREREQUISITES.TITLE');
      this.setPageTitle(this.pageTitle);
      this.buildPreRequisitesForm();
      this.getCPFBankOptionList();
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  buildPreRequisitesForm() {
    this.preRequisitesForm = new FormGroup({
      cpfOperator: new FormControl("", Validators.required),
      cpfAccountNo: new FormControl({ value: '', disabled: true }, Validators.required)
    });
  }

  getCPFBankOptionList() {
    this.showLoader();
    this.investmentAccountService.getSpecificDropList('cpfAgentBank').subscribe((resp: any) => {
      this.loaderService.hideLoaderForced();
      if (resp.responseMessage.responseCode >= 6000 && resp.objectList) {
        this.cpfBankOperators = resp.objectList.cpfAgentBank;
      }
    }, () => {
      this.loaderService.hideLoaderForced();
    });

    this.getCKAAssessmentData();
  }

  selectCPFOperator(key, value) {
    this.preRequisitesForm.controls[key].setValue(value);
    this.preRequisitesForm.controls['cpfAccountNo'].setValue(null);
    this.addorRemoveAccNoValidator();
  }

  addorRemoveAccNoValidator() {
    const accNoControl = this.preRequisitesForm.get('cpfAccountNo');
    const selectedBank = this.preRequisitesForm.get('cpfOperator').value;
    if (selectedBank) {
      switch (selectedBank.name.toUpperCase()) {
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.DBS:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.DBS)]);
          break;
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.OCBC:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.OCBC)]);
          break;
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.UOB:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.UOB)]);
          break;
      }
      this.preRequisitesForm.controls['cpfAccountNo'].enable();
      this.preRequisitesForm.updateValueAndValidity();
    }
  }

  startAssessment() {
    this.investmentCommonService.setCKARedirectFromLocation(INVESTMENT_COMMON_ROUTE_PATHS.CPF_PREREQUISITES);
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'OPEN_CKA.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'OPEN_CKA.DESC'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'OPEN_CKA.BTN-TEXT'
    );
    ref.componentInstance.primaryAction.subscribe(() => {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_ASSESSMENT]);
    });
    ref.componentInstance.closeBtn = false;
  }

  getCKAAssessmentData() {
    this.showLoader();
    this.investmentCommonService.getCKAAssessmentStatus().subscribe((data) => {
      this.loaderService.hideLoaderForced();
      const responseMessage = data.responseMessage;
      if (responseMessage && responseMessage.responseCode === 6000) {
        if (data.objectList) {
          this.ckaInfo = data.objectList;
          this.getCPFBankDetails();
          if (this.ckaInfo.cKAStatusMessage && this.ckaInfo.cKAStatusMessage === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_PASSED_STATUS) {
            this.investmentCommonService.setCKAStatus(INVESTMENT_COMMON_CONSTANTS.CKA.CKA_PASSED_STATUS);
          } else if (this.ckaInfo.cKAStatusMessage && this.ckaInfo.cKAStatusMessage === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_BE_CERTIFICATE_UPLOADED) {
            this.investmentCommonService.setCKAStatus(INVESTMENT_COMMON_CONSTANTS.CKA.CKA_BE_CERTIFICATE_UPLOADED);
          } else if (this.ckaInfo.cKAStatusMessage && this.ckaInfo.cKAStatusMessage === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_REJECTED_STATUS) {
            this.investmentCommonService.setCKAStatus(INVESTMENT_COMMON_CONSTANTS.CKA.CKA_REJECTED_STATUS);
            this.enableDisableStepTwo();
          }
        } else {
          this.enableDisableStepTwo();
        }
      } else {
        this.enableDisableStepTwo();
      }
    }, () => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  getCPFBankDetails() {
    this.showLoader();
    this.investmentCommonService.getCKABankDetails(false).subscribe((resp: any) => {
      this.loaderService.hideLoaderForced();
      if (resp && resp.responseMessage && resp.responseMessage.responseCode >= 6000) {
        if (resp.objectList) {
          this.cpfBankDetails = resp.objectList;
          this.updateCkaFormDetails();
        }
      } else {
        this.enableDisableStepTwo();
      }
    }, () => {
      this.loaderService.hideLoaderForced();
    });
  }

  updateCkaFormDetails() {
    if (this.cpfBankDetails) {
      this.preRequisitesForm.controls['cpfOperator'].setValue(this.cpfBankDetails.bankOperator);
      this.preRequisitesForm.controls['cpfAccountNo'].setValue(this.cpfBankDetails.accountNumber);
      this.enableDisableStepTwo();
      this.addorRemoveAccNoValidator();
    }
  }

  enableDisableStepTwo() {
    this.setBankEnableStatus();
    if (this.isCKACompleted()) {
      this.preRequisitesForm.get('cpfOperator').value ? this.preRequisitesForm.controls['cpfAccountNo'].enable() : this.preRequisitesForm.controls['cpfAccountNo'].disable();
    } else {
      this.preRequisitesForm.get('cpfAccountNo').disable();
    }
  }

  isCKACompleted() {
    return this.ckaInfo && this.ckaInfo.cKAStatusMessage &&
      (this.ckaInfo.cKAStatusMessage === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_PASSED_STATUS
        || this.ckaInfo.cKAStatusMessage === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_BE_CERTIFICATE_UPLOADED)
  }

  goToNext() {
    if (!this.preRequisitesForm.valid) {
      return false;
    } else {
      this.saveCPFAccountDetails(this.preRequisitesForm);
    }
  }

  saveCPFAccountDetails(form) {
    const params = this.constructCpfAccountParams(form.value);
    this.investmentCommonService.saveCKABankAccount(params).subscribe((data) => {
      if (data && data.objectList) {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
      }
    }, () => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  constructCpfAccountParams(data) {
    let reqParams = {
      accountNumber: data.cpfAccountNo ? data.cpfAccountNo.replace(/[-]/g, '') : null,
      bankOperatorId: data.cpfOperator ? data.cpfOperator.id : null
    };
    return reqParams;
  }

  maskConfig() {
    const config = {
      mask: RegexConstants.cpfOperatorMask.DBS
    };
    if (this.preRequisitesForm.get('cpfOperator').value) {
      const operator = this.preRequisitesForm.get('cpfOperator').value.name;
      if (operator) {
        switch (operator.toUpperCase()) {
          case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.DBS:
            config.mask = RegexConstants.cpfOperatorMask.DBS;
            break;
          case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.OCBC:
            config.mask = RegexConstants.cpfOperatorMask.OCBC;
            break;
          case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.UOB:
            config.mask = RegexConstants.cpfOperatorMask.UOB;
            break;
        }
      }
    }
    return config;
  }

  getAccNoLength() {
    if (this.preRequisitesForm.get('cpfOperator').value) {
      const accNo = this.preRequisitesForm.get('cpfAccountNo').value;
      if (accNo) {
        return accNo.match(/\d/g).join('').length;
      } else {
        return 0;
      }
    }
  }

  getAccNoMaxLength() {
    let accNoMaxLength;
    switch (this.preRequisitesForm.get('cpfOperator').value.name) {
      case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.DBS:
        accNoMaxLength = 13;
        break;
      case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.OCBC:
        accNoMaxLength = 9;
        break;
      case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.UOB:
        accNoMaxLength = 9;
        break;
    }
    return accNoMaxLength;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }

  showTooltip() {
    this.modal.open(CpfiaTooltipComponent, { centered: true });
  }

  disableContinue() {
    if (Util.isEmptyOrNull(this.ckaInfo) || !this.preRequisitesForm.valid) {
      return true;
    }
    return false;
  }

  setBankEnableStatus() {
    if (Util.isEmptyOrNull(this.ckaInfo) || (!Util.isEmptyOrNull(this.ckaInfo) && this.ckaInfo.cKAStatusMessage
      && this.ckaInfo.cKAStatusMessage === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_REJECTED_STATUS)) {
      this.showOperatorBank = true;
    } else {
      this.showOperatorBank = false;
    }
  }

  uploadCertificate() {
    this.investmentCommonService.setCKARedirectFromLocation(INVESTMENT_COMMON_ROUTE_PATHS.CPF_PREREQUISITES);
    const url = INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_UPLOAD_DOCUMENT;
    this.router.navigate([url]);
  }
}
