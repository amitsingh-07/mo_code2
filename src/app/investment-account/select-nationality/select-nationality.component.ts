import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
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
  selectedNationality: any;
  nationality: any;
  formValues: any;
  blocked: any;
  country: any;
  notSingaporeNationality = false;
  singaporeNationality = false;
  nationalityObj: any;
  selectNationalityFormValues: any;
  editModalData: any;
  ButtonTitle: any;
  blockedNationalityModal: any;
  countries: any;
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
    this.selectedNationality = 'Select Nationality';
    this.getNationalityCountryList();
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.selectNationalityFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.selectNationalityForm = new FormGroup({
      nationality: new FormControl(this.selectNationalityFormValues.nationality)
    });
    this.buildFormControls();
  }

  getSelectedNationality(nationalityCode) {
    const selectedNationality = this.nationalityList.filter(
      (nationality) => nationality.nationalityCode === nationalityCode
    );
    this.nationality = selectedNationality[0];
    return selectedNationality[0].name;
  }

  buildFormControls() {
    if (this.selectedNationality === 'Select Nationality' || this.blocked) {
      this.singaporeNationality = false;
      this.notSingaporeNationality = false;
    } else if (['SINGAPOREAN', 'SG'].includes(this.selectedNationality)) {
      this.singaporeNationality = true;
      this.notSingaporeNationality = false;
      this.selectNationalityForm = new FormGroup({
        unitedStatesResident: new FormControl(
          this.selectNationalityFormValues.unitedStatesResident,
          Validators.required
        )
      });
    } else {
      this.singaporeNationality = true;
      this.notSingaporeNationality = true;
      this.selectNationalityForm = new FormGroup({
        unitedStatesResident: new FormControl(
          this.selectNationalityFormValues.unitedStatesResident,
          Validators.required
        ),
        singaporeanResident: new FormControl(
          this.selectNationalityFormValues.singaporeanResident,
          Validators.required
        )
      });
    }
  }

  selectNationality(nationality) {
    this.blocked = nationality.blocked;
    this.selectedNationality = nationality.name;
    this.nationality = nationality;
    this.buildFormControls();
  }

  getNationalityCountryList() {
    this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
      this.nationalityList = data.objectList;
      this.countryList = this.getCountryList(data.objectList);
      if (this.selectNationalityFormValues.nationalityCode) {
        this.selectedNationality = this.getSelectedNationality(
          this.selectNationalityFormValues.nationalityCode
        );
        this.buildFormControls();
      }
    });
  }

  getCountryList(data) {
    const countryList = [];
    data.forEach((nationality) => {
      if (!nationality.blocked) {
        nationality.countries.forEach((country) => {
          countryList.push(country);
        });
      }
    });
    return countryList;
  }

  save(form) {
    const singaporeanResident = form.controls.singaporeanResident
      ? form.controls.singaporeanResident.value
      : false;
    this.investmentAccountService.setNationality(
      this.nationalityList,
      this.countryList,
      this.nationality,
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
      this.router.navigate(['home']);
    });
  }

  goToNext(form) {
    this.saveNationality();
    if (this.nationality.name === 'AMERICAN') {
      this.showErrorMessage(
        this.editModalData.modalTitle,
        this.editModalData.modalMessage
      );
    } else if (this.blocked) {
      this.showErrorMessage(
        this.blockedNationalityModal.blockedNationalityTitle,
        this.blockedNationalityModal.blockedNationalityMessage
      );
    } else if (form.valid && form.controls.unitedStatesResident) {
      if (
        (['SINGAPOREAN', 'SG'].includes(this.selectedNationality) &&
          form.controls.unitedStatesResident.value === true) ||
        ((form.controls.unitedStatesResident.value === true &&
          form.controls.singaporeanResident.value === true) ||
          (form.controls.unitedStatesResident.value === true &&
            form.controls.singaporeanResident.value === false))
      ) {
        this.showErrorMessage(
          this.editModalData.modalTitle,
          this.editModalData.modalMessage
        );
      } else {
        this.save(form);
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
      }
    }
  }
  saveNationality() {
    this.investmentAccountService.saveNationality(this.nationality).subscribe(
      (data) => {
        this.investmentAccountService.setAccountCreationStatus(
          INVESTMENT_ACCOUNT_CONFIG.status.ddc_submitted
        );
      },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant(
          'INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.TITLE'
        );
        ref.componentInstance.errorMessage = this.translate.instant(
          'INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.DESCRIPTION'
        );
      }
    );
  }

  isDisabled() {
    return this.investmentAccountService.isDisabled('nationality');
  }
}
