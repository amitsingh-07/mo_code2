import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { Util } from '../../../shared/utils/util';
import { InvestmentAccountCommon } from '../../investment-account/investment-account-common';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../investment-account/investment-account.constant';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';

@Component({
  selector: 'app-add-secondary-holder',
  templateUrl: './add-secondary-holder.component.html',
  styleUrls: ['./add-secondary-holder.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  encapsulation: ViewEncapsulation.None
})
export class AddSecondaryHolderComponent implements OnInit {

  nationalityList: any;
  countryList: any;
  secondaryHolderMinorForm: FormGroup;
  secondaryHolderMinorFormValues: any;
  secondaryHolderMajorForm: FormGroup;
  secondaryHolderMajorFormValues: any;
  secondaryHolderFormValues: any;
  userProfileType: any;
  tooltipDetails: any;
  blockedCountryModal: any;
  activeTabId = 3;
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
  noTinReasonlist: any;
  formCount: any;
  singPlaceHolder: string;
  showNricHint = false;
  minDate: any;
  maxDate: any;
  passportMinDate: any;
  passportMaxDate: any;
  taxInfoModal: any;
  errorModalData: any;
  navigationType: any;
  constructor(
    public authService: AuthenticationService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
    private router: Router,
    private modal: NgbModal,
    public readonly translate: TranslateService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.userProfileType = investmentEngagementService.getUserPortfolioType();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.blockedNationalityModal = this.translate.instant('SELECT_NATIONALITY.blockedNationality');
      this.blockedCountryModal = this.translate.instant('SECONDARY_HOLDER.blockedCountry');
      this.editModalData = this.translate.instant('SELECT_NATIONALITY.editModalData');
      this.tooltipDetails = this.translate.instant('BLOCKED_COUNTRY_TOOLTIP');
      this.helpData = this.translate.instant('SECONDARY_HOLDER.MAJOR.helpData');
      this.taxInfoModal = this.translate.instant('SECONDARY_HOLDER.MINOR.TAX_INFO');
      this.errorModalData = this.translate.instant('SECONDARY_HOLDER.MAJOR.errorModalData');
      const today: Date = new Date();
      this.minDate = {
        year: today.getFullYear() - 100,
        month: today.getMonth() + 1,
        day: today.getDate()
      };
      this.maxDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      };
      this.passportMinDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      };
      this.passportMaxDate = {
        year: today.getFullYear() + 20,
        month: today.getMonth() + 1,
        day: today.getDate()
      };
    });
    this.secondaryHolderMinorFormValues = investmentEngagementService.getMinorSecondaryHolderData();
    this.secondaryHolderMajorFormValues = investmentEngagementService.getMajorSecondaryHolderData();
    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.isMinor) {
      this.activeTabId = 2;
      this.tabChange();
    }
    if (this.secondaryHolderMajorFormValues && !this.secondaryHolderMajorFormValues.isMinor) {
      this.activeTabId = 1;
      this.tabChange();
    }
    this.buildMajorForm();
    this.setOptionList();
  }

  ngOnInit(): void {
    this.navigationType = this.route.snapshot.paramMap.get('navigationType');
  }

  buildMinorForm() {
    this.secondaryHolderMinorForm = this.formBuilder.group({
      isMinor: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      isSingaporean: new FormControl('')
    });
    this.secondaryHolderMinorForm.controls.isSingaporean.setValue(this.secondaryHolderMinorFormValues?.isSingaporean);
    this.secondaryHolderMinorForm.controls.isMinor.setValue(true);
  }

  buildMajorForm() {
    this.secondaryHolderMajorForm = new FormGroup({
      isMinor: new FormControl('', Validators.required),
      email: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.email ? this.secondaryHolderMajorFormValues.email : '', [Validators.required, Validators.pattern(RegexConstants.Email)]),
      relationship: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.relationship ? this.secondaryHolderMajorFormValues.relationship : '', Validators.required),
      nricNumber: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.nricNumber ? this.secondaryHolderMajorFormValues.nricNumber : '', [Validators.required, Validators.minLength(4), Validators.pattern(RegexConstants.Alphanumeric)]),
    });
    this.secondaryHolderMajorForm.controls.isMinor.setValue(false);
  }

  /* Get List of Nationalities */
  getNationalityCountryList() {
    this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
      this.nationalityList = data.objectList;
      this.countryList = this.investmentAccountService.getCountryList(data.objectList);
      if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.nationality.nationalityCode && this.secondaryHolderMinorFormValues.nationality.nationalityCode) {
        const nationalityObj = this.getSelectedNationality(
          this.secondaryHolderMinorFormValues.nationality.nationalityCode
        );
        this.secondaryHolderMinorForm.controls.nationality.setValue(nationalityObj);
        this.secondaryHolderMinorForm.controls.isMinor.setValue(nationalityObj);
        this.setSingaporeanResidentControl();
      }
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

  isDisabled(fieldName) {
    return this.investmentAccountService.isDisabled(fieldName);
  }

  showBlockedCountryErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
  }

  openModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.taxInfoModal.BLOCKED_COUNTRY_TOOLTIP.TITLE;
    ref.componentInstance.errorDescription = this.taxInfoModal.BLOCKED_COUNTRY_TOOLTIP.DESC;
    ref.componentInstance.tooltipButtonLabel = this.taxInfoModal.BLOCKED_COUNTRY_TOOLTIP.GOT_IT;
    return false;
  }

  /* Method called when there is a change in the nationality selected */
  selectNationality(nationality) {
    this.secondaryHolderMinorForm.addControl(
      'unitedStatesResident', new FormControl('', Validators.required)
    );
    this.removePersonaInfoControls();
    this.removeNonSingaporeanControls();
    this.secondaryHolderMinorForm.controls.nationality.setValue(nationality);
    if (nationality.blocked) {
      this.showBlockedCountryErrorMessage(this.blockedCountryModal.error_title, this.blockedCountryModal.blockedCountryMessage);
      this.secondaryHolderMinorForm.removeControl('singaporeanResident');
    } else {
      if (!this.isNationalitySingapore()) {
        this.secondaryHolderMinorForm.addControl(
          'singaporeanResident', new FormControl('', Validators.required)
        );
        this.secondaryHolderMinorForm.controls.isSingaporean.setValue(false);
      } else {
        this.secondaryHolderMinorForm.controls.isSingaporean.setValue(true);
        setTimeout(() => {
          this.secondaryHolderMinorForm.removeControl('singaporeanResident');
          if (this.secondaryHolderMinorForm.value && !Util.isEmptyOrNull(this.secondaryHolderMinorForm.value.unitedStatesResident) && !this.secondaryHolderMinorForm.value.unitedStatesResident) {
            this.addPersonalInfoControls();
          }
        });
      }
    }
  }

  /* Method called when there is a change in the country and check if selected
  country is Singapore */
  setSingaporeanResidentControl() {
    let singaporeResident;
    let unitedStatesResident;
    if (this.secondaryHolderMinorFormValues && !Util.isEmptyOrNull(this.secondaryHolderMinorFormValues.singaporeanResident)) {
      singaporeResident = this.secondaryHolderMinorFormValues.singaporeanResident;
    }
    if (this.secondaryHolderMinorFormValues && !Util.isEmptyOrNull(this.secondaryHolderMinorFormValues.unitedStatesResident)) {
      unitedStatesResident = this.secondaryHolderMinorFormValues.unitedStatesResident;
      this.secondaryHolderMinorForm.addControl(
        'unitedStatesResident', new FormControl(!Util.isEmptyOrNull(unitedStatesResident) ? unitedStatesResident : '', Validators.required)
      );
    }
    if (!Util.isEmptyOrNull(unitedStatesResident) && !unitedStatesResident) {
      this.addPersonalInfoControls();
    }
    if (!this.isNationalitySingapore()) {
      this.secondaryHolderMinorForm.addControl(
        'singaporeanResident', new FormControl(!Util.isEmptyOrNull(singaporeResident) ? singaporeResident : '', Validators.required)
      );
      this.singaporeanPRChange(singaporeResident);
    } else {
      setTimeout(() => {
        this.secondaryHolderMinorForm.removeControl('singaporeanResident');
      });
    }
  }

  /* Method to check if nationality is Singapore */
  isNationalitySingapore() {
    const selectedNationalityName = this.secondaryHolderMinorForm.controls.nationality.value &&
      this.secondaryHolderMinorForm.controls.nationality.value.name ?
      this.secondaryHolderMinorForm.controls.nationality.value.name.toUpperCase() : '';
    if ([INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_NAME, INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_CODE]
      .indexOf(selectedNationalityName) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  /* Method called when user clicks on United States PR */
  unitedStatesPRChange(isUnitedStatesPR) {
    if (isUnitedStatesPR) {
      this.removePersonaInfoControls();
      this.showErrorMessage(this.blockedCountryModal.error_title,
        this.blockedCountryModal.unitedStatesPRYes);
    } else if (this.isNationalitySingapore() && !isUnitedStatesPR) {
      setTimeout(() => {
        this.addPersonalInfoControls();
      });
    }
  }

  showErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
  }

  /* Method called when Singapore PR radio button is clicked */
  singaporeanPRChange(isSingaporePR) {
    isSingaporePR ? this.addSingaporeanControls() : this.addNonSingaporeanControls();
  }

  /* Handle Continue button of Minor holder */
  minorHolderGoToNext() {
    if (this.secondaryHolderMinorForm.valid) {
      if (this.secondaryHolderMinorForm.value.nationality?.blocked) {
        this.showBlockedCountryErrorMessage(this.blockedCountryModal.error_title, this.blockedCountryModal.blockedCountryMessage);
      } else if (this.secondaryHolderMinorForm.value.unitedStatesResident) {
        this.showErrorMessage(this.blockedCountryModal.error_title, this.blockedCountryModal.unitedStatesPRYes);
      } else if (Util.isEmptyOrNull(this.validateMinimumAge(this.secondaryHolderMinorForm.controls['dob']))) {
        const error = this.investmentEngagementService.getSecondaryHolderFormError('dob');
        this.showErrorMessage(error?.errorMessages?.errorTitle, error?.errorMessages?.errorMessage);
      } else if (this.secondaryHolderMinorForm.controls['passportExpiry'] && !Util.isEmptyOrNull(this.validateExpiry(this.secondaryHolderMinorForm.controls['passportExpiry']))) {
        const error = this.investmentEngagementService.getSecondaryHolderFormError('passportExpiry');
        this.showErrorMessage(error?.errorMessages?.errorTitle, error?.errorMessages?.errorMessage);
      } else {
        if (this.secondaryHolderMinorForm.value && this.secondaryHolderMinorForm.value.dob && typeof this.secondaryHolderMinorForm.value.dob !== 'object') {
          this.secondaryHolderMinorForm.get('dob').setValue(this.investmentEngagementService.convertStringToDateObj(this.secondaryHolderMinorForm.value.dob));
        }
        if (this.secondaryHolderMinorForm.value && this.secondaryHolderMinorForm.value.passportExpiry && typeof this.secondaryHolderMinorForm.value.passportExpiry !== 'object') {
          this.secondaryHolderMinorForm.get('passportExpiry').setValue(this.investmentEngagementService.convertStringToDateObj(this.secondaryHolderMinorForm.value.passportExpiry));
        }
        this.investmentEngagementService.setMinorSecondaryHolderData(this.secondaryHolderMinorForm.value);
        this.investmentEngagementService.setMajorSecondaryHolderData(null);
        this.investmentEngagementService.saveMinorSecondaryHolder().subscribe(resp => {
          this.secondaryHolderMinorForm.addControl('jaAccountId', new FormControl(resp.objectList));
          this.investmentEngagementService.setMinorSecondaryHolderData(this.secondaryHolderMinorForm.value);
          this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.JA_UPLOAD_DOCUMENT]);
        });
      }
    }
  }

  /* Get dropdown list from a single API */
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

  /* Handle Continue button of Major holder */
  majorHolderGoToNext() {
    if (this.secondaryHolderMajorForm.valid) {
      this.investmentEngagementService.setMinorSecondaryHolderData(null);
      this.investmentEngagementService.setMajorSecondaryHolderData(this.secondaryHolderMajorForm.value);
      this.investmentEngagementService.saveMajorSecondaryHolder().subscribe(resp => {
        if (resp.responseMessage.responseCode === 6000) {
          this.secondaryHolderMajorForm.addControl('jaAccountId', new FormControl(resp.objectList));
          this.investmentEngagementService.setMajorSecondaryHolderData(this.secondaryHolderMajorForm.value);
          if (!Util.isEmptyOrNull(this.navigationType)) {
            this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.PORTFOLIO_SUMMARY]);
          } else {
            this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
          }
        }
        else {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.errorModalData.modalTitle;
          ref.componentInstance.errorDescription = this.errorModalData.modalDesc;
        }
      });
    }
  }

  /* Method called when user selects below 18 or Above 18 */
  tabChange() {
    if (this.activeTabId === 2) {
      this.buildMinorForm();
      this.getNationalityCountryList();
      this.getReasonList();
    } else {
      this.buildMajorForm();
    }
    this.tabChangeCount++;
  }

  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'major-tooltip' });
    ref.componentInstance.errorTitle = this.helpData.modalTitle;
    ref.componentInstance.errorDescription = this.helpData.modalDesc;
    return false;
  }

  setDropDownValue(event, key, isMinor) {
    setTimeout(() => {
      isMinor ? this.secondaryHolderMinorForm.controls[key].setValue(event) : this.secondaryHolderMajorForm.controls[key].setValue(event);
    }, 100);
  }

  /* To Validate Passport Expiry */
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

  /* To Validate Minimum age of secondary holder */
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

  /* To validate the NRIC number entered */
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
    this.removeNonSingaporeanControls();
    this.removePersonaInfoControls();
    setTimeout(() => {
      this.addPersonalInfoControls();
    });
  }

  addNonSingaporeanControls() {
    this.removePersonaInfoControls();
    this.addPersonalInfoControls();
    let passportNumber = '';
    let passportExpiry;
    let passportIssuedCountry = '';
    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.passportNumber) {
      passportNumber = this.secondaryHolderMinorFormValues.passportNumber;
    }
    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.passportIssuedCountry) {
      passportIssuedCountry = this.secondaryHolderMinorFormValues.passportIssuedCountry;
    }
    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.passportExpiry) {
      passportExpiry = this.secondaryHolderMinorFormValues.passportExpiry;
    }
    this.secondaryHolderMinorForm.removeControl('nricNumber');
    this.secondaryHolderMinorForm.removeControl('issuedCountry');
    this.secondaryHolderMinorForm.addControl(
      'passportNumber', new FormControl(passportNumber !== '' ? passportNumber : '', [Validators.required, Validators.pattern(RegexConstants.PassportNumber)])
    );
    this.secondaryHolderMinorForm.addControl(
      'passportExpiry', new FormControl(passportExpiry ? passportExpiry : '', [Validators.required, this.validateExpiry])
    );
    this.secondaryHolderMinorForm.addControl(
      'passportIssuedCountry', new FormControl(passportIssuedCountry ? passportIssuedCountry : {}, [Validators.required])
    );
  }

  /* Add personal info controls */
  addPersonalInfoControls() {
    let dob: any;
    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.dob) {
      dob = this.secondaryHolderMinorFormValues.dob;
    }

    this.secondaryHolderMinorForm.addControl(
      'fullName', new FormControl(this.secondaryHolderMinorFormValues?.fullName ? this.secondaryHolderMinorFormValues?.fullName : '', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)])
    );
    this.secondaryHolderMinorForm.addControl(
      'nricNumber', new FormControl(this.secondaryHolderMinorFormValues?.nricNumber ? this.secondaryHolderMinorFormValues?.nricNumber : '', [Validators.required, this.validateNric.bind(this)])
    );
    this.secondaryHolderMinorForm.addControl(
      'race', new FormControl(this.secondaryHolderMinorFormValues?.race ? this.secondaryHolderMinorFormValues?.race : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'relationship', new FormControl(this.secondaryHolderMinorFormValues?.relationship ? this.secondaryHolderMinorFormValues?.relationship : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'birthCountry', new FormControl(this.secondaryHolderMinorFormValues?.birthCountry ? this.secondaryHolderMinorFormValues?.birthCountry : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'gender', new FormControl(this.secondaryHolderMinorFormValues?.gender ? this.secondaryHolderMinorFormValues?.gender : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'dob', new FormControl(dob ? dob : '', [Validators.required])
    );
    this.secondaryHolderMinorForm.addControl(
      'issuedCountry', new FormControl(this.secondaryHolderMinorFormValues?.issuedCountry ? this.secondaryHolderMinorFormValues?.issuedCountry : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'addTax', this.formBuilder.array([])
    );

    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.addTax) {
      // Existing Value
      this.secondaryHolderMinorFormValues.addTax.map((item) => {
        this.addTaxForm(item);
      });
    } else {
      this.addTaxForm(null);
    }
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
    this.secondaryHolderMinorForm.removeControl('addTax');
  }

  removeNonSingaporeanControls() {
    this.secondaryHolderMinorForm.removeControl('passportNumber');
    this.secondaryHolderMinorForm.removeControl('passportExpiry');
    this.secondaryHolderMinorForm.removeControl('passportIssuedCountry');
  }

  setControlValue(value, controlName, formName) {
    value = value.trim().replace(RegexConstants.trimSpace, ' ');
    this.investmentAccountService.setControlValue(value, controlName, formName);
  }

  onKeyPressEvent(event: any, content: any) {
    this.investmentAccountService.onKeyPressEvent(event, content);
  }

  // Tax Info Functionality
  getReasonList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.noTinReasonlist = data.objectList.noTinReason;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  addTaxForm(data): void {
    const control = this.secondaryHolderMinorForm.get('addTax') as FormArray;
    const newFormGroup = this.createForm(data);
    this.showHint(newFormGroup.controls.taxCountry.value.countryCode, newFormGroup);
    control.push(newFormGroup);
    this.secondaryHolderMinorForm.updateValueAndValidity();
    if (data) {
      let tinNoOrReasonValue;
      if (data.radioTin) {
        tinNoOrReasonValue = data.tinNumber ? data.tinNumber.toUpperCase() : null;
      } else {
        tinNoOrReasonValue = data.noTinReason ? data.noTinReason : null;
      }
      this.isTinNumberAvailChanged(data.radioTin, newFormGroup, tinNoOrReasonValue);
    }
    this.formCount = this.secondaryHolderMinorForm.controls.addTax.value.length;
  }

  createForm(data) {
    let formGroup;
    formGroup = this.formBuilder.group({
      radioTin: [data ? data.radioTin : '', Validators.required],
      taxCountry: [data ? data.taxCountry : '', Validators.required],
      showTinHint: [false]
    });
    return formGroup;
  }

  selectCountry(country, taxInfoItem) {
    taxInfoItem.controls.taxCountry.setValue(country);
    taxInfoItem.removeControl('tinNumber');
    taxInfoItem.removeControl('noTinReason');
    setTimeout(() => { /* Removing and adding control instantly, causes view to not refresh, hence settimeout */
      taxInfoItem.controls.radioTin.setValue(null);
      this.showHint(country.countryCode, taxInfoItem);
    });
  }

  /*
  * Method to show TIN hint based on country code if singapore
  */
  showHint(countryCode, taxInfoItem) {
    this.showNricHint = countryCode === INVESTMENT_ACCOUNT_CONSTANTS.SINGAPORE_COUNTRY_CODE;
    taxInfoItem.controls.showTinHint.setValue(this.showNricHint);
  }

  selectReason(reasonObj, taxInfoItem) {
    taxInfoItem.controls.noTinReason.setValue(reasonObj);
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

  isTinNumberAvailChanged(flag, formgroup, data) {
    if (flag) {
      formgroup.addControl(
        'tinNumber',
        new FormControl('', [
          Validators.required,
          this.validateTin.bind(this)
        ])
      );
      formgroup.controls.tinNumber.setValue(data);
      formgroup.removeControl('noTinReason');
    } else {
      formgroup.addControl(
        'noTinReason',
        new FormControl('', Validators.required)
      );
      formgroup.controls.noTinReason.setValue(data);
      formgroup.removeControl('tinNumber');
    }
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  getBorder() {
    return this.secondaryHolderMinorForm.get('addTax')['controls'].length > 1;
  }
  removeTaxForm(formGroup, index): void {
    const control = formGroup.controls['addTax'] as FormArray;
    control.removeAt(index);
    this.formCount = this.secondaryHolderMinorForm.controls.addTax.value.length;
  }

  hasDuplicates(array) {
    return new Set(array).size !== array.length;
  }

  validateTin(control: AbstractControl) {
    const value = control.value;
    let isValidTin;
    if (value) {
      if (control && control.parent && control.parent.controls && control.parent.controls['taxCountry'].value) {
        const countryCode = control.parent.controls['taxCountry'].value.countryCode;
        switch (countryCode) {
          case INVESTMENT_ACCOUNT_CONSTANTS.SINGAPORE_COUNTRY_CODE:
            isValidTin = this.investmentAccountCommon.isValidNric(value);
            break;
          case INVESTMENT_ACCOUNT_CONSTANTS.MALAYSIA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.MalaysianTin).test(value);
            break;
          case INVESTMENT_ACCOUNT_CONSTANTS.INDONESIA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.IndonesianTin).test(value);
            break;
          case INVESTMENT_ACCOUNT_CONSTANTS.INDIA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.IndianTin).test(value);
            break;
          case INVESTMENT_ACCOUNT_CONSTANTS.CHINA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.ChineseTin).test(value);
            break;
          default:
            isValidTin = true;
            break;
        }
      }
      if (!isValidTin) {
        return { tinFormat: true };
      }
    }
    return null;
  }

  setTinNoValue(taxInfoItem, value) {
    if (taxInfoItem.controls.tinNumber) {
      taxInfoItem.controls.tinNumber.setValue(value);
      taxInfoItem.controls.tinNumber.updateValueAndValidity();
    }
  }

  setControlEnableDisable(taxInfoItem, controlName, enableFlag) {
    if (taxInfoItem.controls[controlName]) {
      if (enableFlag) {
        taxInfoItem.controls[controlName].enable(true);
      } else {
        taxInfoItem.controls[controlName].disable(true);
      }
    }
  }

  showHelpModalCountry() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.taxInfoModal.BLOCKED_COUNTRY_TOOLTIP.TITLE;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.taxInfoModal.BLOCKED_COUNTRY_TOOLTIP.DESC;
    ref.componentInstance.tooltipButtonLabel = this.taxInfoModal.BLOCKED_COUNTRY_TOOLTIP.GOT_IT;
    return false;
  }

  showHelpModalTinNumber() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.taxInfoModal.TAX_MODEL_TITLE;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.taxInfoModal.TAX_MODEL_DESC;
    return false;
  }

  toggleDate(openEle, closeEle) {
    if (openEle) {
      openEle.toggle();
    }
    if (closeEle) {
      closeEle.close();
    }
  }

  @HostListener('input', ['$event'])
  onChange(event) {
    const id = event.target.id;
    if (id === 'fullname') {
      const content = event.target.innerText;
      if (content.length >= 100) {
        const contentList = content.substring(0, 100);
        this.secondaryHolderMinorForm.controls.fullName.setValue(contentList);
        const el = document.querySelector('#' + id);
        this.investmentAccountService.setCaratTo(el, 100, contentList);
      }
    }
  }

  checkSingaporePR() {
    if (this.secondaryHolderMinorForm.get('singaporeanResident') && this.secondaryHolderMinorForm.get('singaporeanResident')) {
      return true;
    } else {
      return false;
    }
  }
}
