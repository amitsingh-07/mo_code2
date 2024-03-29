import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  AccountCreationErrorModalComponent
} from '../../investment-common/confirm-portfolio/account-creation-error-modal/account-creation-error-modal.component';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../investment-account.constant';
import { INVESTMENT_COMMON_CONSTANTS } from '../../investment-common/investment-common.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';

@Component({
  selector: 'app-additional-declaration2',
  templateUrl: './additional-declaration2.component.html',
  styleUrls: ['./additional-declaration2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalDeclaration2Component implements OnInit {
  pageTitle: string;
  sourceOfIncomeList;
  generatedList;
  additionDeclarationtwo: FormGroup;
  formValues;
  sourceOfInvestmentHelpModal: any = {
    title: '',
    desc: ''
  };
  sourceOfWealthHelpModal: any = {
    title: '',
    desc: ''
  };
  constructor(
    public navbarService: NavbarService,
    public footerService: FooterService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('ADDITIONAL_DECLARATIONS_SCREEN_TWO.TITLE');
      this.sourceOfInvestmentHelpModal.title = this.translate.instant('ADDITIONAL_DECLARATIONS_SCREEN_TWO.SOURCE_OF_INV_FUNDS_HELP.TITLE');
      this.sourceOfInvestmentHelpModal.desc = this.translate.instant('ADDITIONAL_DECLARATIONS_SCREEN_TWO.SOURCE_OF_INV_FUNDS_HELP.DESC');
      this.sourceOfWealthHelpModal.title = this.translate.instant('ADDITIONAL_DECLARATIONS_SCREEN_TWO.SOURCE_OF_WEALTH_HELP.TITLE');
      this.sourceOfWealthHelpModal.desc = this.translate.instant('ADDITIONAL_DECLARATIONS_SCREEN_TWO.SOURCE_OF_WEALTH_HELP.DESC');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {

    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getSourceList();
    this.getGeneratedFrom();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.additionDeclarationtwo = this.formBuilder.group({
      expectedNumberOfTransation: [
        this.formValues.expectedNumberOfTransation,
        [
          Validators.required, this.minValueValidation
        ]
      ],
      expectedAmountPerTranction: [
        this.formValues.expectedAmountPerTranction,
        [
          Validators.required, this.minValueValidation
        ]
      ],
      source: [this.formValues.source, Validators.required],
      sourceOfWealth: [null, Validators.required]
    },
    );
    this.addAndRemoveSourseFields();
    if (this.formValues.pep) {
      this.investmentAccountService.loadDDCRoadmap();
    } else {
      this.investmentAccountService.loadDDCInvestmentRoadmap();
    }
  }

  addAndRemoveSourseFields() {
    if (
      this.additionDeclarationtwo.controls.source.value &&
      this.additionDeclarationtwo.controls.source.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.PERSONAL_SAVING
    ) {
      this.additionDeclarationtwo.addControl(
        'personalSavingForm',
        this.formBuilder.group({
          personalSavings: [this.formValues.personalSavings, Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl('investmentEarnings');
      this.additionDeclarationtwo.removeControl('inheritanceGiftFrom');
      this.additionDeclarationtwo.removeControl('othersFrom');
    }
    if (
      this.additionDeclarationtwo.controls.source.value &&
      this.additionDeclarationtwo.controls.source.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.GIFT_INHERITANCE
    ) {
      this.additionDeclarationtwo.addControl(
        'inheritanceGiftFrom',
        this.formBuilder.group({
          inheritanceGift: [this.formValues.inheritanceGift, Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl('personalSavingForm');
      this.additionDeclarationtwo.removeControl('investmentEarnings');
      this.additionDeclarationtwo.removeControl('otherSources');
    }
    if (
      this.additionDeclarationtwo.controls.source.value &&
      this.additionDeclarationtwo.controls.source.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
    ) {
      this.additionDeclarationtwo.addControl(
        'investmentEarnings',
        this.formBuilder.group({
          durationInvestment: [this.formValues.durationInvestment, [Validators.required, this.minValueValidation]],
          earningsGenerated: [this.formValues.earningsGenerated, Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl('personalSavingForm');
      this.additionDeclarationtwo.removeControl('inheritanceGiftFrom');
      this.additionDeclarationtwo.removeControl('othersFrom');
    }
    if (
      this.additionDeclarationtwo.controls.source.value &&
      this.additionDeclarationtwo.controls.source.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.OTHERS
    ) {
      this.additionDeclarationtwo.addControl(
        'othersFrom',
        this.formBuilder.group({
          otherSources: [this.formValues.otherSources, Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl('personalSavingForm');
      this.additionDeclarationtwo.removeControl('investmentEarnings');
      this.additionDeclarationtwo.removeControl('inheritanceGiftFrom');
    }
  }

  getSourceList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.sourceOfIncomeList = data.objectList.investmentSource;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  getGeneratedFrom() {
    this.investmentAccountService.getGeneratedFrom().subscribe((data) => {
      this.generatedList = data.objectList.earningsGenerated;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  selectEarningsGenerated(key, value, nestedKey) {
    this.additionDeclarationtwo.controls[nestedKey]['controls'][key].setValue(value);
  }

  selectSource(key, value) {
    this.additionDeclarationtwo.controls[key].setValue(value);
    if (key == 'sourceOfWealth') {
      this.addAndRemoveSourceOfWealthFields();
    } else {
      this.addAndRemoveSourseFields();
    }
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

  showInvestmentAccountErrorModal(errorList) {
    const errorTitle = this.translate.instant(
      'INVESTMENT_ACCOUNT_COMMON.ACCOUNT_CREATION_ERROR_MODAL.TITLE'
    );
    const ref = this.modal.open(AccountCreationErrorModalComponent, {
      centered: true
    });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorList = errorList;
  }

  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, {
        centered: true
      });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else if (this.investmentAccountService.setAdditionDeclaration(form.getRawValue())) {
      this.saveAdditionalDeclarations();
    }
  }

  saveAdditionalDeclarations() {
    this.investmentAccountService.saveAdditionalDeclarations().subscribe(
      (data) => {
        this.investmentAccountService.setAccountCreationStatus(
          INVESTMENT_ACCOUNT_CONSTANTS.status.ddc_submitted
        );
        const isCpfEnabled = this.investmentCommonService.getInvestmentCommonFormData().portfolioDetails.fundingTypeValue === INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.CPF_OA;
        if (isCpfEnabled) {
          this.investmentCommonService.getCKAAssessmentStatus().subscribe((res) => {
            if ((res.responseMessage.responseCode === 6000)) {
              const cpfStatus = (res.objectList && res.objectList.cKAStatusMessage) ? res.objectList.cKAStatusMessage : '';
              if (cpfStatus === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_BE_CERTIFICATE_UPLOADED) {
                this.updatePortfolioAccountStatus();
              } else {
                this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.STATUS]);
              }
            }
          });
        } else {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.STATUS]);
        }
      },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      }
    );
  }

  showCustomErrorModal(title, desc) {
    const errorTitle = title;
    const errorMessage = desc;
    const ref = this.modal.open(ErrorModalComponent, {
      centered: true
    });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessage = errorMessage;
  }

  private minValueValidation(control: AbstractControl) {
    if (control.value < 1) {
      return { minValueCheck: true };
    }
    return null;
  }

  updatePortfolioAccountStatus() {
    this.loaderService.showLoader({
      title: this.translate.instant(
        'PORTFOLIO_RECOMMENDATION.UPDATING_PORTFOLIO_STATUS_LOADER.TITLE'
      ),
      desc: this.translate.instant(
        'PORTFOLIO_RECOMMENDATION.UPDATING_PORTFOLIO_STATUS_LOADER.DESCRIPTION'
      ),
      autoHide: false
    });
    const param = this.constructUpdatePortfolioAccountStatusParams();

    this.investmentCommonService.updatePortfolioStatus(param).subscribe((response) => {
      this.loaderService.hideLoaderForced();
      if (response.responseMessage.responseCode === 6000) {
        this.clearData();
        this.redirectToPortfolioInProgress();
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
      (err) => {
        this.loaderService.hideLoaderForced();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  constructUpdatePortfolioAccountStatusParams() {
    return {
      customerPortfolioId: +this.formValues.recommendedCustomerPortfolioId,
    };
  }

  redirectToPortfolioInProgress() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.PORTFOLIO_APP_INPROGRESS_SCREEN]);
  }

  clearData() {
    this.investmentAccountService.clearInvestmentAccountFormData();
    this.investmentCommonService.clearJourneyData();
    this.investmentCommonService.clearFundingDetails();
    this.investmentCommonService.clearAccountCreationActions();
  }

  openHelpModal(source) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    if (source == 1) {
      ref.componentInstance.errorTitle = this.sourceOfInvestmentHelpModal.title;
      ref.componentInstance.errorDescription = this.sourceOfInvestmentHelpModal.desc;
    } else if (source == 2) {
      ref.componentInstance.errorTitle = this.sourceOfWealthHelpModal.title;
      ref.componentInstance.errorDescription = this.sourceOfWealthHelpModal.desc;
    }
    return false;
  }

  addAndRemoveSourceOfWealthFields() {
    const wealthPersonalSavings = 'srcOfWealthPersonalSavingForm';
    const wealthInvEarnings = 'srcOfWealthInvestmentEarningsForm';
    const wealthOtherSources = 'srcOfWealthOthersForm';
    const wealthInheritanceGift = 'srcOfWealthInheritanceGiftForm'
    if (
      this.additionDeclarationtwo.controls.sourceOfWealth.value &&
      this.additionDeclarationtwo.controls.sourceOfWealth.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.PERSONAL_SAVING
    ) {
      this.additionDeclarationtwo.addControl(
        wealthPersonalSavings,
        this.formBuilder.group({
          personalSavingsWealth: ['', Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl(wealthInvEarnings);
      this.additionDeclarationtwo.removeControl(wealthInheritanceGift);
      this.additionDeclarationtwo.removeControl(wealthOtherSources);
    }
    if (
      this.additionDeclarationtwo.controls.sourceOfWealth.value &&
      this.additionDeclarationtwo.controls.sourceOfWealth.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.GIFT_INHERITANCE
    ) {
      this.additionDeclarationtwo.addControl(
        wealthInheritanceGift,
        this.formBuilder.group({
          inheritanceGiftWealth: ['', Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl(wealthPersonalSavings);
      this.additionDeclarationtwo.removeControl(wealthInvEarnings);
      this.additionDeclarationtwo.removeControl(wealthOtherSources);
    }
    if (
      this.additionDeclarationtwo.controls.sourceOfWealth.value &&
      this.additionDeclarationtwo.controls.sourceOfWealth.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
    ) {
      this.additionDeclarationtwo.addControl(
        wealthInvEarnings,
        this.formBuilder.group({
          durationInvestmentWealth: ['', [Validators.required, this.minValueValidation]],
          earningsGeneratedWealth: ['', Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl(wealthPersonalSavings);
      this.additionDeclarationtwo.removeControl(wealthInheritanceGift);
      this.additionDeclarationtwo.removeControl(wealthOtherSources);
    }
    if (
      this.additionDeclarationtwo.controls.sourceOfWealth.value &&
      this.additionDeclarationtwo.controls.sourceOfWealth.value.key ===
      INVESTMENT_ACCOUNT_CONSTANTS.ADDITIONAL_DECLARATION_TWO.OTHERS
    ) {
      this.additionDeclarationtwo.addControl(
        wealthOtherSources,
        this.formBuilder.group({
          otherSourcesWealth: ['', Validators.required]
        })
      );
      this.additionDeclarationtwo.removeControl(wealthPersonalSavings);
      this.additionDeclarationtwo.removeControl(wealthInvEarnings);
      this.additionDeclarationtwo.removeControl(wealthInheritanceGift);
    }
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }
}
