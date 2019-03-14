import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-select-nationality',
  templateUrl: './select-nationality.component.html',
  styleUrls: ['./select-nationality.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectNationalityComponent implements OnInit {
  selectNationalityForm: FormGroup;
  nationalityList: any;
  countryList: any;
  selectNationalityFormValues: any;
  editModalData: any;
  ButtonTitle: any;
  blockedNationalityModal: any;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.editModalData = this.translate.instant('SELECT_NATIONALITY.editModalData');
      this.blockedNationalityModal = this.translate.instant('SELECT_NATIONALITY.blockedNationality');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.selectNationalityFormValues = this.investmentAccountService.getInvestmentAccountFormData();
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
    const selectedNationality = this.selectNationalityForm.controls.nationality.value;
    const selectedNationalityName = this.selectNationalityForm.controls.nationality.value &&
      this.selectNationalityForm.controls.nationality.value.name ?
      this.selectNationalityForm.controls.nationality.value.name.toUpperCase() : '';
    if (['SINGAPOREAN', 'SG'].includes(selectedNationalityName)) {
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
    this.buildAdditionalControls();
  }

  setNationlityFormData(form) {
    const singaporeanResident = form.controls.singaporeanResident
      ? form.controls.singaporeanResident.value
      : false;
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

  goToNext(form) {
    if (form.valid) {
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
      } else if (form.controls.unitedStatesResident) {
        const nationalityName = form.controls.nationality.value.name.toUpperCase();
        if (
          (['SINGAPOREAN', 'SG'].includes(nationalityName) &&
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
        } else {
          this.setNationlityFormData(form);
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
        }
      }
    }
  }
  saveNationality(form) {
    this.investmentAccountService.saveNationality(form.controls.nationality.value).subscribe(
      (data) => {
        this.investmentAccountService.setAccountCreationStatus(
          INVESTMENT_ACCOUNT_CONFIG.status.nationality_selected
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
    if (['SINGAPOREAN', 'SG'].includes(selectedNationalityName)) {
      return true;
    } else {
      return false;
    }
  }

  isDisabled() {
    return this.investmentAccountService.isDisabled('nationality');
  }
}
