import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';
import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { InvestmentAccountCommon } from '../../investment-account/investment-account-common';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../investment-account/investment-account.constant';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';

@Component({
  selector: 'app-add-secondary-holder',
  templateUrl: './add-secondary-holder.component.html',
  styleUrls: ['./add-secondary-holder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSecondaryHolderComponent implements OnInit {

  nationalityList: any;
  countryList: any;
  secondaryHolderMinorForm: FormGroup;
  secondaryHolderMajorForm: FormGroup;
  secondaryHolderFormValues: any;
  userProfileType: any;
  tooltipDetails: any;
  blockedCountryModal: any;
  activeTabId = 1;
  investmentAccountSecondaryHolder: any;
  @Input('portfolioCategory') portfolioCategory;
  editModalData: any;
  blockedNationalityModal: any;
  optionList: any;
  raceList: any;
  helpData: any;
  editMode: boolean;
  minorForeignerRelationships: any;
  minorSGRelationships: any;
  majorRelationships: any;
  countries: any;
  tabChangeCount = 0;
  investmentAccountCommon: InvestmentAccountCommon = new InvestmentAccountCommon();
  isNationalitySingaporePR: boolean;
  constructor(
    public authService: AuthenticationService,
    private investmentCommonService: InvestmentCommonService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modal: NgbModal,
    public readonly translate: TranslateService,
    private loaderService: LoaderService
  ) {
    this.userProfileType = investmentEngagementService.getUserPortfolioType();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.blockedNationalityModal = this.translate.instant('SELECT_NATIONALITY.blockedNationality');
      this.blockedCountryModal = this.translate.instant('SELECT_NATIONALITY.blockedCountry');
      this.editModalData = this.translate.instant('SELECT_NATIONALITY.editModalData');
      this.blockedCountryModal = this.translate.instant('SELECT_NATIONALITY.blockedCountry');
      this.tooltipDetails = this.translate.instant('BLOCKED_COUNTRY_TOOLTIP');
      this.helpData = this.translate.instant('SECONDARY_HOLDER.MAJOR.helpData');
    });
    this.buildMajorForm();
    this.setOptionList();
  }

  ngOnInit(): void {
    this.prefetchData();
  }

  prefetchData() {
    let majorHolderFormData = this.investmentEngagementService.getMajorSecondaryHolderData();
    let minorHolderFormData = this.investmentEngagementService.getMinorSecondaryHolderData();
    if (majorHolderFormData) {

    }
  }

  buildMinorForm() {
    this.secondaryHolderMinorForm = new FormGroup({
      isMinor: new FormControl('', Validators.required),
      unitedStatesResident: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
    });
    this.addPersonalInfoControls();
    this.secondaryHolderMinorForm.controls.isMinor.setValue(true);
  }

  buildMajorForm() {
    this.secondaryHolderMajorForm = new FormGroup({
      isMinor: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(RegexConstants.Email)]),
      relationship: new FormControl('', Validators.required),
      nricNumber: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern(RegexConstants.Alphanumeric)]),
    });
    this.secondaryHolderMajorForm.controls.isMinor.setValue(false);
  }

  getNationalityCountryList() {
    this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
      this.nationalityList = data.objectList;
      this.countryList = this.investmentAccountService.getCountryList(data.objectList);
      // if (this.secondaryHolderFormValues.nationalityCode) {
      //   const nationalityObj = this.getSelectedNationality(
      //     this.secondaryHolderFormValues.nationalityCode
      //   );
      //   this.secondaryHolderForm.controls.nationality.setValue(nationalityObj);
      // }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  showBlockedCountryErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
  }

  openModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.tooltipDetails.TITLE;
    ref.componentInstance.errorDescription = this.tooltipDetails.DESC;
    ref.componentInstance.tooltipButtonLabel = this.tooltipDetails.GOT_IT;
    return false;
  }

  isDisabled() {
    return true;
  }

  selectNationality(nationality) {
    this.removePersonaInfoControls();
    this.removeNonSingaporeanControls();
    this.secondaryHolderMinorForm.controls.nationality.setValue(nationality);
    this.secondaryHolderMinorForm.controls.unitedStatesResident.setValue('');
    if (nationality.blocked) {
      this.showBlockedCountryErrorMessage('Oops, Unable To Proceed', 'Due to compliance issues, MoneyOwl is unable to accept customers from the selected country.');
      this.secondaryHolderMinorForm.removeControl('singaporeanResident');
    } else {
      if (!this.isNationalitySingapore()) {
        this.secondaryHolderMinorForm.addControl(
          'singaporeanResident', new FormControl('', Validators.required)
        );
      } else {
        this.secondaryHolderMinorForm.removeControl('singaporeanResident');
        this.addPersonalInfoControls();
      }
    }
  }

  isNationalitySingapore() {
    const selectedNationalityName = this.secondaryHolderMinorForm.controls.nationality.value &&
      this.secondaryHolderMinorForm.controls.nationality.value.name ?
      this.secondaryHolderMinorForm.controls.nationality.value.name.toUpperCase() : '';
    if (['SINGAPOREAN', 'SG'].indexOf(selectedNationalityName) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  unitedStatesPRChange(isUnitedStatesPR) {
    if (isUnitedStatesPR) {
      this.showErrorMessage('Oops, Unable To Proceed',
        'Due to compliance issues, MoneyOwl is unable to accept customers who are US Citizens, Permanent Residents or Tax Residents.');
    }
  }

  showErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
  }

  singaporeanPRChange(isSingaporePR) {
    isSingaporePR ? this.addSingaporeanControls() : this.addNonSingaporeanControls();
  }

  minorHolderGoToNext() {
    // if(this.secondaryHolderForm.valid) {
    if (this.secondaryHolderMinorForm.value.nationality?.blocked) {
      this.showBlockedCountryErrorMessage('Oops, Unable To Proceed', 'Due to compliance issues, MoneyOwl is unable to accept customers from the selected country.');
    } else if (this.secondaryHolderMinorForm.value.unitedStatesResident) {
      this.showErrorMessage('Oops, Unable To Proceed',
        'Due to compliance issues, MoneyOwl is unable to accept customers who are US Citizens, Permanent Residents or Tax Residents.');
    }
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
    // }
  }

  setOptionList() {
    this.loaderService.showLoader({
      title: this.translate.instant(
        'COMMON_LOADER.TITLE'
      ),
      desc: this.translate.instant(
        'COMMON_LOADER.DESC'
      )
    });
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.loaderService.hideLoader();
      this.investmentAccountService.setOptionList(data.objectList);
      this.optionList = this.investmentAccountService.getOptionList();
      this.raceList = this.optionList.race;
      this.countries = this.investmentAccountService.getCountriesFormData();
      this.minorForeignerRelationships = this.optionList?.jointAccountMinorForeignerRelationship;
      this.majorRelationships = this.optionList?.jointAccountMajorRelationship;
      this.minorSGRelationships = this.optionList?.jointAccountMinorRelationship;
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  majorHolderGoToNext() {
    if (this.secondaryHolderMajorForm.valid) {
      this.investmentEngagementService.setMajorSecondaryHolderData(this.secondaryHolderMajorForm.value);
      this.investmentEngagementService.validateMajorSecondaryHolder().subscribe(resp => {
        console.log('major details validate resp', resp);
      })
    }
  }

  tabChange() {
    if (this.tabChangeCount === 0) {
      if (this.activeTabId === 2) {
        this.buildMinorForm();
        this.getNationalityCountryList();
      } else {
        this.buildMajorForm();
      }
    }
    this.tabChangeCount++;
  }

  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.helpData.modalTitle;
    ref.componentInstance.errorDescription = this.helpData.modalDesc;
    return false;
  }

  setDropDownValue(event, key, value, isMinor) {
    setTimeout(() => {
      isMinor ? this.secondaryHolderMinorForm.controls[key].setValue(value) : this.secondaryHolderMajorForm.controls[key].setValue(value);
    }, 100);
  }

  private validateExpiry(control: AbstractControl) {
    const value = control.value;
    const today = new Date();
    if (control.value !== undefined && isNaN(control.value) && !(control.errors && control.errors.ngbDate)) {
      const isMinExpiry =
        new Date(value.year, value.month - 1, value.day) >=
        new Date(
          today.getFullYear(),
          today.getMonth() + INVESTMENT_ACCOUNT_CONSTANTS.personal_info.min_passport_expiry,
          today.getDate()
        );
      if (!isMinExpiry) {
        return { isMinExpiry: true };
      }
    }
    return null;
  }

  private validateMinimumAge(control: AbstractControl) {
    const value = control.value;
    if (control.value !== undefined && isNaN(control.value) && !(control.errors && control.errors.ngbDate)) {
      const isMinAge =
        new Date(
          value.year + INVESTMENT_ACCOUNT_CONSTANTS.personal_info.min_age,
          value.month - 1,
          value.day
        ) <= new Date();
      if (!isMinAge) {
        return { isMinAge: true };
      }
    }
    return null;
  }

  validateNric(control: AbstractControl) {
    const value = control.value;
    if (value && value !== undefined) {
      const isValidNric = this.investmentAccountCommon.isValidNric(value);
      if (!isValidNric) {
        return { nric: true };
      }
    }
    return null;
  }

  addSingaporeanControls() {
    this.isNationalitySingaporePR = false;
    this.removeNonSingaporeanControls();
    this.addPersonalInfoControls();
  }

  addNonSingaporeanControls() {
    this.isNationalitySingaporePR = true;
    this.addPersonalInfoControls();
    this.secondaryHolderMinorForm.removeControl('nricNumber');
    this.secondaryHolderMinorForm.addControl(
      'passportNumber', new FormControl('', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'passportExpiry', new FormControl('', [Validators.required, this.validateExpiry])
    );
  }

  addPersonalInfoControls() {
    this.secondaryHolderMinorForm.addControl(
      'fullName', new FormControl('', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)])
    );
    this.secondaryHolderMinorForm.addControl(
      'nricNumber', new FormControl('', [Validators.required, this.validateNric.bind(this)])
    );
    this.secondaryHolderMinorForm.addControl(
      'race', new FormControl('', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'relationship', new FormControl('', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'birthCountry', new FormControl('', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'gender', new FormControl('', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'dob', new FormControl('', [Validators.required, this.validateMinimumAge])
    );
    this.secondaryHolderMinorForm.addControl(
      'issuedCountry', new FormControl('', Validators.required)
    );
  }

  removePersonaInfoControls() {
    this.secondaryHolderMinorForm.removeControl('fullName');
    this.secondaryHolderMinorForm.removeControl('nricNumber');
    this.secondaryHolderMinorForm.removeControl('race');
    this.secondaryHolderMinorForm.removeControl('relationship');
    this.secondaryHolderMinorForm.removeControl('birthCountry');
    this.secondaryHolderMinorForm.removeControl('gender');
    this.secondaryHolderMinorForm.removeControl('dob');
    this.secondaryHolderMinorForm.removeControl('issuedCountry');
  }

  removeNonSingaporeanControls() {
    this.secondaryHolderMinorForm.removeControl('passportNumber');
    this.secondaryHolderMinorForm.removeControl('passportExpiry');
  }
}
