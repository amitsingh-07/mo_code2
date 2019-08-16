import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators
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
} from '../confirm-portfolio/account-creation-error-modal/account-creation-error-modal.component';
import { ACCOUNT_CREATION_ROUTE_PATHS } from '../account-creation-routes.constants';
import { AccountCreationService } from '../account-creation-service';
import { ACCOUNT_CREATION_CONSTANTS } from '../account-creation.constant';

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
  constructor(
    public navbarService: NavbarService,
    public footerService: FooterService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private accountCreationService: AccountCreationService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('ADDITIONAL_DECLARATIONS_SCREEN_TWO.TITLE');
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
    this.formValues = this.accountCreationService.getInvestmentAccountFormData();
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
      source: [this.formValues.source, Validators.required]
    },
    );
    this.addAndRemoveSourseFields();
    if (this.formValues.pep) {
      this.accountCreationService.loadDDCRoadmap();
    } else {
      this.accountCreationService.loadDDCInvestmentRoadmap();
    }
  }

  addAndRemoveSourseFields() {
    if (
      this.additionDeclarationtwo.controls.source.value &&
      this.additionDeclarationtwo.controls.source.value.key ===
      ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.PERSONAL_SAVING
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
      ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.GIFT_INHERITANCE
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
      ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.INVESTMENT_EARNINGS
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
      ACCOUNT_CREATION_CONSTANTS.ADDITIONAL_DECLARATION_TWO.OTHERS
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
    this.accountCreationService.getAllDropDownList().subscribe((data) => {
      this.sourceOfIncomeList = data.objectList.investmentSource;
    },
      (err) => {
        this.accountCreationService.showGenericErrorModal();
      });
  }

  getGeneratedFrom() {
    this.accountCreationService.getGeneratedFrom().subscribe((data) => {
      this.generatedList = data.objectList.earningsGenerated;
    },
      (err) => {
        this.accountCreationService.showGenericErrorModal();
      });
  }

  selectInvestmentPeriod(key, value, nestedKey) {
    this.additionDeclarationtwo.controls[nestedKey]['controls'][key].setValue(value);
  }
  selectEarningsGenerated(key, value, nestedKey) {
    this.additionDeclarationtwo.controls[nestedKey]['controls'][key].setValue(value);
  }

  selectSource(key, value) {
    this.additionDeclarationtwo.controls[key].setValue(value);
    this.addAndRemoveSourseFields();
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
      const error = this.accountCreationService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, {
        centered: true
      });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else if (this.accountCreationService.setAdditionDeclaration(form.getRawValue())) {
      this.saveAdditionalDeclarations();
    }
  }

  saveAdditionalDeclarations() {
    this.accountCreationService.saveAdditionalDeclarations().subscribe(
      (data) => {
        this.accountCreationService.setAccountCreationStatus(
          ACCOUNT_CREATION_CONSTANTS.status.ddc_submitted
        );
        this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.SETUP_PENDING]);
      },
      (err) => {
        this.accountCreationService.showGenericErrorModal();
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
    const value = control.value;
    if (control.value < 1) {
      return { minValueCheck: true };
    }
    return null;
  }

}
