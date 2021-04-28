import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../investment-account.constant';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NationalityComponent implements OnInit {
  selectNationalityForm: FormGroup;
  nationalityList: any;
  countryList: any;
  selectNationalityFormValues: any;
  editModalData: any;
  ButtonTitle: any;
  blockedNationalityModal: any;
  blockedCountryModal: any;
  tooltipDetails: any;
  foreignerModal: any;
  foreignerConfirmModel: any;

  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private investmentCommonService: InvestmentCommonService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.editModalData = this.translate.instant('SELECT_NATIONALITY.editModalData');
      this.blockedNationalityModal = this.translate.instant('SELECT_NATIONALITY.blockedNationality');
      this.blockedCountryModal = this.translate.instant('SELECT_NATIONALITY.blockedCountry');
      this.tooltipDetails = this.translate.instant('BLOCKED_COUNTRY_TOOLTIP');
      this.foreignerModal = this.translate.instant('SELECT_NATIONALITY.FOREIGNER');
      this.foreignerConfirmModel = this.translate.instant('SELECT_NATIONALITY.FOREIGNER_CONFIRMATION');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.selectNationalityFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    if (this.selectNationalityFormValues.showForeignerAlert) {
      this.investmentAccountService.setForeignerAlert(false);
      this.showForeignerAlert();
    }
    this.selectNationalityForm = new FormGroup({
      nationality: new FormControl(this.selectNationalityFormValues.nationality, Validators.required)
    });
    this.getNationalityCountryList();
  }

  getNationalityCountryList() {
    this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
      this.nationalityList = data.objectList;
      this.countryList = this.investmentAccountService.getCountryList(data.objectList);
      if (this.selectNationalityFormValues.nationalityCode) {
        const nationalityObj = this.getSelectedNationality(
          this.selectNationalityFormValues.nationalityCode
        );
        this.selectNationalityForm.controls.nationality.setValue(nationalityObj);
      }
      this.buildAdditionalControls();
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  getSelectedNationality(nationalityCode) {
    const selectedNationality = this.nationalityList.filter(
      (nationality) => nationality.nationalityCode === nationalityCode
    );
    return selectedNationality[0];
  }

  buildAdditionalControls() {
    this.selectNationalityForm.removeControl('unitedStatesResident');
    this.selectNationalityForm.removeControl('singaporeanResident');
    this.cdr.detectChanges();
    const selectedNationality = this.selectNationalityForm.controls.nationality.value;
    const selectedNationalityName = this.selectNationalityForm.controls.nationality.value &&
      this.selectNationalityForm.controls.nationality.value.name ?
      this.selectNationalityForm.controls.nationality.value.name.toUpperCase() : '';
    if (['SINGAPOREAN', 'SG'].indexOf(selectedNationalityName) >= 0) {
      this.selectNationalityForm.addControl(
        'unitedStatesResident',
        new FormControl(this.selectNationalityFormValues.unitedStatesResident, Validators.required)
      );
    } else if (selectedNationality && !selectedNationality.blocked) {
      this.selectNationalityForm.addControl(
        'unitedStatesResident',
        new FormControl(this.selectNationalityFormValues.unitedStatesResident, Validators.required)
      );
      this.selectNationalityForm.addControl(
        'singaporeanResident',
        new FormControl(this.selectNationalityFormValues.singaporeanResident, Validators.required)
      );
    }
  }

  selectNationality(nationality) {
    this.selectNationalityForm.get('nationality').setValue(nationality);
    this.investmentAccountService.clearNationalityQuestionsSelection(); /* Clearing previously selection for questions */
    this.selectNationalityFormValues = this.investmentAccountService.getInvestmentAccountFormData(); /* Updating variable with form data */
    this.buildAdditionalControls();
  }

  setNationlityFormData(form) {
    const singaporeanResident = form.controls.singaporeanResident
      ? form.controls.singaporeanResident.value : true;
    this.investmentAccountService.setNationality(
      this.nationalityList,
      this.countryList,
      form.controls.nationality.value,
      form.controls.unitedStatesResident.value,
      singaporeanResident
    );
  }

  showErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
    ref.componentInstance.primaryActionLabel = this.editModalData.ButtonTitle;
    ref.componentInstance.primaryAction.subscribe(() => {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
  }

  showBlockedCountryErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
    ref.componentInstance.primaryActionLabel = this.blockedCountryModal.blockedCountryButtonTitle;
    ref.componentInstance.primaryAction.subscribe(() => {
      this.investmentAccountService.clearBlockedCountry();
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
  }

  goToNext(form) {
    if (form.valid) {
      this.investmentCommonService.clearAccountCreationActions();
      this.saveNationality(form);
      if (form.controls.nationality.value.name === 'AMERICAN') {
        this.showErrorMessage(
          this.editModalData.modalTitle,
          this.editModalData.modalMessage
        );
      } else if (form.controls.nationality.value.blocked) {
        this.showErrorMessage(
          this.blockedNationalityModal.blockedNationalityTitle,
          this.blockedNationalityModal.blockedNationalityMessage
        );
      } else if (this.investmentAccountService.checkCountryBlockList()) {
        this.showBlockedCountryErrorMessage(
          this.blockedCountryModal.blockedCountryTitle,
          this.blockedCountryModal.blockedCountryMessage
        );
      } else if (form.controls.unitedStatesResident) {
        const nationalityName = form.controls.nationality.value.name.toUpperCase();
        if (
          (['SINGAPOREAN', 'SG'].indexOf(nationalityName) >= 0 &&
            form.controls.unitedStatesResident.value) ||
          ((form.controls.unitedStatesResident.value &&
            form.controls.singaporeanResident.value) ||
            (form.controls.unitedStatesResident.value &&
              !form.controls.singaporeanResident.value))
        ) {
          this.showErrorMessage(
            this.editModalData.modalTitle,
            this.editModalData.modalMessage
          );
        } else if (this.selectNationalityFormValues.isMyInfoEnabled && form.controls.singaporeanResident && !form.controls.singaporeanResident.value) {
          this.showForeignerConfirmation(form);
        } else {
          this.moveToNext(form);
        }
      }
    }
  }
  saveNationality(form) {
    this.investmentAccountService.saveNationality(form.controls.nationality.value).subscribe(
      (data) => {
        this.investmentAccountService.setAccountCreationStatus(
          INVESTMENT_ACCOUNT_CONSTANTS.status.nationality_selected
        );
      },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      }
    );
  }

  isNationalitySingapore() {
    const selectedNationalityName = this.selectNationalityForm.controls.nationality.value &&
      this.selectNationalityForm.controls.nationality.value.name ?
      this.selectNationalityForm.controls.nationality.value.name.toUpperCase() : '';
    if (['SINGAPOREAN', 'SG'].indexOf(selectedNationalityName) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  isDisabled() {
    return this.investmentAccountService.isDisabled('nationality');
  }
  openModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.tooltipDetails.TITLE;
    ref.componentInstance.errorDescription = this.tooltipDetails.DESC;
    ref.componentInstance.tooltipButtonLabel = this.tooltipDetails.GOT_IT;
    return false;
  }

  showForeignerAlert() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.foreignerModal.title;
    ref.componentInstance.errorMessageHTML = this.foreignerModal.message;
    ref.componentInstance.primaryActionLabel = this.foreignerModal.btnText;
  }

  showForeignerConfirmation(form) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.foreignerConfirmModel.title;
    ref.componentInstance.errorMessageHTML = this.foreignerConfirmModel.message;
    ref.componentInstance.primaryActionLabel = this.foreignerConfirmModel.btnText;
    ref.componentInstance.primaryAction.subscribe(() => {
      this.investmentAccountService.setMyInfoStatus(false);
      this.moveToNext(form);
    });
  }

  moveToNext(form) {
    this.setNationlityFormData(form);
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
  }
}
