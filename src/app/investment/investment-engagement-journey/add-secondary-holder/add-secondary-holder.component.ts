import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
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
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES, INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { INVESTMENT_COMMON_CONSTANTS } from './../../../investment/investment-common/investment-common.constants';
import { IToastMessage } from '../../manage-investments/manage-investments-form-data';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../manage-investments/manage-investments-routes.constants';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';

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

  pageTitle: string;
  editPageTitle: any;
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
  previousTabValue: number;
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
  verifyApplicantData: any;
  customerPortfolioId: any;
  routeParams: any;
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
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private investmentCommonService: InvestmentCommonService,
    public manageInvestmentsService: ManageInvestmentsService
  ) {
    this.userProfileType = investmentEngagementService.getUserPortfolioType();
    this.navigationType = this.investmentCommonService.setNavigationType(this.router.url, INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.EDIT_SECONDARY_HOLDER, INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NAVIGATION_TYPE.EDIT);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('SECONDARY_HOLDER.PAGE_TITLE');
      this.editPageTitle = this.translate.instant('SECONDARY_HOLDER.EDIT_PAGE_TITLE');
      if (this.navigationType) {
        this.setPageTitle(this.editPageTitle);
      } else {
        this.setPageTitle(this.pageTitle);
      }
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
    this.secondaryHolderMinorFormValues = investmentEngagementService.getMinorSecondaryHolderData() ? JSON.parse(JSON.stringify(investmentEngagementService.getMinorSecondaryHolderData())) : null;
    this.secondaryHolderMajorFormValues = investmentEngagementService.getMajorSecondaryHolderData() ? JSON.parse(JSON.stringify(investmentEngagementService.getMajorSecondaryHolderData())) : null;
    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.isMinor) {
      this.activeTabId = 2;
      this.tabChange();
    }
    if (this.secondaryHolderMajorFormValues && !this.secondaryHolderMajorFormValues.isMinor) {
      this.activeTabId = 1;
      this.tabChange();
    }
    this.buildMajorForm();
    let apiCalls = [];
    apiCalls.push(this.investmentAccountService.getAllDropDownList());
    apiCalls.push(this.investmentAccountService.getNationalityCountryList());
    this.showLoader();
    forkJoin(apiCalls).subscribe(results => {
      this.setDropdownLists(results[0]);
      this.getNationalityCountriesList(results[1]);
      this.route.paramMap.subscribe(params => {
        this.routeParams = params;
        if (this.routeParams && this.routeParams.get('customerPortfolioId')) {
          this.customerPortfolioId = this.routeParams.get('customerPortfolioId');
          this.verifyCall(this.customerPortfolioId);
        } else {
          this.loaderService.hideLoaderForced();
        }
      });
    }, err => {
      this.loaderService.hideLoaderForced();
      investmentAccountService.showGenericErrorModal();
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

  buildMinorForm() {
    this.secondaryHolderMinorForm = this.formBuilder.group({
      isMinor: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      isSingaporean: new FormControl(''),
      customerPortfolioId: new FormControl(this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.customerPortfolioId ? this.secondaryHolderMinorFormValues.customerPortfolioId : ''),
      jaAccountId: new FormControl(this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.jaAccountId ? this.secondaryHolderMinorFormValues.jaAccountId : ''),
    });
    this.secondaryHolderMinorForm.controls.isSingaporean.setValue(this.secondaryHolderMinorFormValues?.isSingaporean);
    this.secondaryHolderMinorForm.controls.isMinor.setValue(true);
    if (this.secondaryHolderMinorFormValues) {
      this.secondaryHolderMinorForm.controls.nationality.setValue(this.secondaryHolderMinorFormValues.nationality);
      this.setSingaporeanResidentControl();
    }
  }

  buildMajorForm() {
    this.secondaryHolderMajorForm = new FormGroup({
      isMinor: new FormControl('', Validators.required),
      email: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.email ? this.secondaryHolderMajorFormValues.email : '', [Validators.required, Validators.pattern(RegexConstants.Email)]),
      relationship: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.relationship ? this.secondaryHolderMajorFormValues.relationship : '', Validators.required),
      customerPortfolioId: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.customerPortfolioId ? this.secondaryHolderMajorFormValues.customerPortfolioId : ''),
      jaAccountId: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.jaAccountId ? this.secondaryHolderMajorFormValues.jaAccountId : ''),
      nricNumber: new FormControl(this.secondaryHolderMajorFormValues && this.secondaryHolderMajorFormValues.nricNumber ? this.secondaryHolderMajorFormValues.nricNumber : '', [Validators.required, Validators.minLength(4), Validators.pattern(RegexConstants.Alphanumeric)]),
    });
    this.secondaryHolderMajorForm.controls.isMinor.setValue(false);
  }

  getNationalityCountriesList(data) {
    this.nationalityList = data.objectList;
    this.countryList = this.investmentAccountService.getCountryList(data.objectList);
    this.investmentAccountService.setNationalitiesCountries(this.nationalityList, this.countryList);
    this.countries = this.investmentAccountService.getCountriesFormDataByFilter();
    if (this.secondaryHolderMinorFormValues && this.secondaryHolderMinorFormValues.nationality.nationalityCode && this.secondaryHolderMinorFormValues.nationality.nationalityCode) {
      const nationalityObj = this.getSelectedNationality(
        this.secondaryHolderMinorFormValues.nationality.nationalityCode
      );
      this.secondaryHolderMinorForm.controls.nationality.setValue(nationalityObj);
    }
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
    const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'limited-width' });
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
    } else if (nationality.nationalityCode.indexOf('US') >= 0) {
      this.secondaryHolderMinorForm.removeControl('unitedStatesResident');
      this.secondaryHolderMinorForm.removeControl('singaporeanResident');
      this.showErrorMessage(this.blockedCountryModal.error_title,
        this.blockedCountryModal.unitedStatesPRYes);
    } else {
      if (!this.isNationalitySingapore()) {
        this.secondaryHolderMinorForm.addControl(
          'singaporeanResident', new FormControl(this.secondaryHolderMinorFormValues && !Util.isEmptyOrNull(this.secondaryHolderMinorFormValues.singaporeanResident) ?
            this.secondaryHolderMinorFormValues.singaporeanResident : '', Validators.required)
        );
        this.secondaryHolderMinorForm.controls.isSingaporean.setValue(false);
        if (this.secondaryHolderMinorFormValues && !Util.isEmptyOrNull(this.secondaryHolderMinorFormValues.singaporeanResident)) {
          this.singaporeanPRChange(this.secondaryHolderMinorFormValues.singaporeanResident);
        }
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
      this.secondaryHolderMinorForm.removeControl('singaporeanResident');
      this.removePersonaInfoControls();
      this.showErrorMessage(this.blockedCountryModal.error_title,
        this.blockedCountryModal.unitedStatesPRYes);
    } else {
      if (this.isNationalitySingapore()) {
        setTimeout(() => {
          this.addPersonalInfoControls();
        });
      } else {
        this.secondaryHolderMinorForm.addControl(
          'singaporeanResident', new FormControl(this.secondaryHolderMinorFormValues && !Util.isEmptyOrNull(this.secondaryHolderMinorFormValues.singaporeanResident) ?
            this.secondaryHolderMinorFormValues.singaporeanResident : '', Validators.required)
        );
        if (this.secondaryHolderMinorFormValues && !Util.isEmptyOrNull(this.secondaryHolderMinorFormValues.singaporeanResident)) {
          const singaporeResident = this.secondaryHolderMinorFormValues.singaporeanResident;
          this.singaporeanPRChange(singaporeResident);
        }
      }
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
    if (this.secondaryHolderMinorForm.value.nationality?.blocked) {
      this.showBlockedCountryErrorMessage(this.blockedCountryModal.error_title, this.blockedCountryModal.blockedCountryMessage);
    } else if (this.secondaryHolderMinorForm.value.nationality?.nationalityCode.indexOf('US') >= 0 || this.secondaryHolderMinorForm.value.unitedStatesResident) {
      this.showErrorMessage(this.blockedCountryModal.error_title, this.blockedCountryModal.unitedStatesPRYes);
    } else {
      const form = this.secondaryHolderMinorForm.getRawValue();
      const selTaxCountryArr = [];
      if (form) {
        // Existing Value
        form.addTax.map((item) => {
          selTaxCountryArr.push(item.taxCountry.countryCode);
        });
      }
      const duplicateCountryErr: any = this.setDuplicateTaxCountryError(selTaxCountryArr);
      if ((!this.secondaryHolderMinorForm.valid)) {
        this.markAllFieldsDirty(this.secondaryHolderMinorForm);
        let error = this.investmentEngagementService.getJAFormErrorList(this.secondaryHolderMinorForm);
        let taxError = this.investmentEngagementService.getJAFormErrorList(this.secondaryHolderMinorForm.controls.addTax);
        taxError = this.setErrorData(taxError, duplicateCountryErr);
        error = this.setErrorData(error, taxError);
        this.showFormErrorMsg(error);
      } else if (duplicateCountryErr) {
        this.showFormErrorMsg(duplicateCountryErr);
      } else if (!Util.isEmptyOrNull(this.investmentEngagementService.validateMaximumAge(this.secondaryHolderMinorForm.controls['dob']))) {
        this.secondaryHolderMinorForm.controls.dob.markAsDirty();
        this.secondaryHolderMinorForm.controls.dob.setErrors({ invalid: true });
        const error = this.investmentEngagementService.getSecondaryHolderFormError('dob');
        this.showFormErrorMsg(error);
      } else {
        if (this.secondaryHolderMinorForm.value && this.secondaryHolderMinorForm.value.dob && typeof this.secondaryHolderMinorForm.value.dob !== 'object') {
          this.secondaryHolderMinorForm.get('dob').setValue(this.investmentEngagementService.convertStringToDateObj(this.secondaryHolderMinorForm.value.dob));
        }
        if (this.secondaryHolderMinorForm.value && this.secondaryHolderMinorForm.value.passportExpiry && typeof this.secondaryHolderMinorForm.value.passportExpiry !== 'object') {
          this.secondaryHolderMinorForm.get('passportExpiry').setValue(this.investmentEngagementService.convertStringToDateObj(this.secondaryHolderMinorForm.value.passportExpiry));
        }
        this.investmentEngagementService.setMinorSecondaryHolderData(this.secondaryHolderMinorForm.value);
        this.investmentEngagementService.setMajorSecondaryHolderData(null);
        this.showLoader();
        this.investmentEngagementService.saveMinorSecondaryHolder().subscribe(resp => {
          this.loaderService.hideLoaderForced();
          this.secondaryHolderMinorForm.controls.jaAccountId.setValue(resp.objectList);
          this.investmentEngagementService.setMinorSecondaryHolderData(this.secondaryHolderMinorForm.value);
          if (this.customerPortfolioId) {
            this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.JA_UPLOAD_DOCUMENT + "/" + this.customerPortfolioId]);
          } else if (!Util.isEmptyOrNull(this.navigationType)) {
            this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.EDIT_UPLOAD_DOCUMENT]);
          } else {
            this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.JA_UPLOAD_DOCUMENT]);
          }
        }, (err) => {
          this.loaderService.hideLoaderForced();
          this.investmentAccountService.showGenericErrorModal();
        });
      }
    }
  }

  showFormErrorMsg(error) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = error.title;
    ref.componentInstance.errorMessageList = error.errorMessages;
    return false;
  }

  setDuplicateTaxCountryError(countryArr) {
    if (this.hasDuplicates(countryArr)) {
      return {
        title: this.translate.instant('SECONDARY_HOLDER.MINOR.TAX_INFO.COUNTRY_ERROR'),
        errorMessages: [this.translate.instant('SECONDARY_HOLDER.MINOR.TAX_INFO.COUNTRY_ERROR_MSG')]
      }
    }
    return null;
  }

  setErrorData(src, dest) {
    if (src && src.errorMessages && src.errorMessages.length > 0 && dest && dest.errorMessages && dest.errorMessages.length > 0) {
      dest.errorMessages.forEach(element => {
        src.errorMessages.push(element);
      });
    } else if (src.errorMessages && src.errorMessages.length == 0) {
      src = dest;
    }
    return src;
  }

  hasDuplicates(array) {
    return new Set(array).size !== array.length;
  }

  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }

  setDropdownLists(data) {
    this.investmentAccountService.setOptionList(data.objectList);
    this.optionList = this.investmentAccountService.getOptionList();
    this.raceList = this.optionList.race;
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.minorForeignerRelationships = this.optionList?.jointAccountMinorForeignerRelationship;
    this.majorRelationships = this.optionList?.jointAccountMajorRelationship;
    this.minorSGRelationships = this.optionList?.jointAccountMinorRelationship;
    this.noTinReasonlist = data.objectList.noTinReasonForJA;
  }

  /* Handle Continue button of Major holder */
  majorHolderGoToNext() {
    if (this.secondaryHolderMajorForm.valid) {
      this.investmentEngagementService.setMinorSecondaryHolderData(null);
      this.investmentEngagementService.setMajorSecondaryHolderData(this.secondaryHolderMajorForm.value);
      this.showLoader();
      this.investmentEngagementService.saveMajorSecondaryHolder().subscribe(resp => {
        this.loaderService.hideLoaderForced();
        if (resp.responseMessage.responseCode === 6000) {
          this.secondaryHolderMajorForm.controls.jaAccountId.setValue(resp.objectList);
          this.investmentEngagementService.setMajorSecondaryHolderData(this.secondaryHolderMajorForm.value);
          if (this.customerPortfolioId) {
            this.verifyFlowSubmission();
          } else if (!Util.isEmptyOrNull(this.navigationType)) {
            this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.PORTFOLIO_SUMMARY]);
          } else {
            this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
          }
        }
        else {
          const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'limited-width' });
          ref.componentInstance.errorTitle = this.errorModalData.modalTitle;
          ref.componentInstance.errorDescription = this.errorModalData.modalDesc;
        }
      }, (err) => {
        this.loaderService.hideLoaderForced();
        this.investmentAccountService.showGenericErrorModal();
      });
    }
  }

  /* Method called when user selects below 18 or Above 18 */
  tabChange() {
    if (this.activeTabId === 2 && this.previousTabValue != this.activeTabId) {
      this.buildMinorForm();
    } else if (this.activeTabId === 1) {
      this.buildMajorForm();
    }
    this.previousTabValue = this.activeTabId;
  }

  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'major-tooltip limited-width' });
    ref.componentInstance.errorTitle = this.helpData.modalTitle;
    ref.componentInstance.errorDescription = this.helpData.modalDesc;
    return false;
  }

  setDropDownValue(event, key, isMinor) {
    setTimeout(() => {
      isMinor ? this.secondaryHolderMinorForm.controls[key].setValue(event) : this.secondaryHolderMajorForm.controls[key].setValue(event);
    }, 100);
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
    setTimeout(() => {
      this.addPersonalInfoControls();
      this.secondaryHolderMinorForm.removeControl('nricNumber');
      this.secondaryHolderMinorForm.removeControl('issuedCountry');
    });
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
    this.secondaryHolderMinorForm.addControl(
      'passportNumber', new FormControl(passportNumber !== '' ? passportNumber : '', [Validators.required, Validators.pattern(RegexConstants.PassportNumber)])
    );
    this.secondaryHolderMinorForm.addControl(
      'passportExpiry', new FormControl(passportExpiry ? passportExpiry : '', [Validators.required])
    );
    this.secondaryHolderMinorForm.addControl(
      'passportIssuedCountry', new FormControl(passportIssuedCountry ?
        passportIssuedCountry
        : this.investmentEngagementService.getCountryFromCountryCode(
          this.secondaryHolderMinorForm.value.nationality?.nationalityCode, this.countryList),
        [Validators.required])
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
      'nricNumber', new FormControl(this.secondaryHolderMinorFormValues?.nricNumber ? this.secondaryHolderMinorFormValues?.nricNumber : '')
    );
    this.setNricValidation();
    this.secondaryHolderMinorForm.addControl(
      'race', new FormControl(this.secondaryHolderMinorFormValues?.race ? this.secondaryHolderMinorFormValues?.race : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'relationship', new FormControl(this.secondaryHolderMinorFormValues?.relationship ? this.secondaryHolderMinorFormValues?.relationship : '', Validators.required)
    );
    this.resetRelationship();
    this.secondaryHolderMinorForm.addControl(
      'birthCountry', new FormControl(this.secondaryHolderMinorFormValues?.birthCountry ? this.secondaryHolderMinorFormValues?.birthCountry : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'gender', new FormControl(this.secondaryHolderMinorFormValues?.gender ? this.secondaryHolderMinorFormValues?.gender : '', Validators.required)
    );
    this.secondaryHolderMinorForm.addControl(
      'dob', new FormControl(dob ? dob : '', [Validators.required, this.investmentEngagementService.validateMaximumAge])
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

  setNricValidation() {
    if (this.isNationalitySingapore()) {
      this.secondaryHolderMinorForm.controls.nricNumber.clearValidators();
      this.secondaryHolderMinorForm.controls.nricNumber.setValidators([Validators.required, this.investmentEngagementService.validateNric.bind(this)]);
    } else {
      this.secondaryHolderMinorForm.controls.nricNumber.clearValidators();
      this.secondaryHolderMinorForm.controls.nricNumber.setValidators([Validators.required]);
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
          let nestedControls = (<FormArray>form.get(key).controls[nestedKey]).controls;
          for (const taxcontrol in nestedControls) {
            nestedControls[taxcontrol].markAsDirty();
          }
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
          this.investmentEngagementService.validateTin.bind(this)
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

  setTinNoValue(taxInfoItem, value) {
    if (taxInfoItem.controls.tinNumber) {
      taxInfoItem.controls.tinNumber.setValue(value);
      taxInfoItem.controls.tinNumber.updateValueAndValidity();
    }
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

  verifyCall(customerPortfolioId) {
    this.investmentEngagementService.getVerifyDetails(Number(customerPortfolioId), INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.VERIFY).subscribe(resp => {
      this.loaderService.hideLoaderForced();
      if (resp.responseMessage.responseCode === 6000) {
        this.secondaryHolderMajorFormValues = null;
        this.secondaryHolderMinorFormValues = null;
        this.verifyApplicantData = resp.objectList;
        //Major Major flow
        if (!this.verifyApplicantData.minor) {
          this.activeTabId = 1;
          this.buildMajorForm();
          this.secondaryHolderMajorForm.addControl('isMinor', new FormControl(false));
          this.secondaryHolderMajorForm.controls.isMinor.setValue(this.verifyApplicantData.minor);
          this.secondaryHolderMajorForm.controls.nricNumber.setValue(this.verifyApplicantData.secondaryHolderNricOrPassport);
          if (this.majorRelationships) {
            const relationshipId = this.verifyApplicantData.secondaryHolderRelationshipId;
            const relationship = this.majorRelationships.find(x => x.id == relationshipId);
            this.secondaryHolderMajorForm.controls.relationship.setValue(relationship);
          }
          this.secondaryHolderMajorForm.controls.email.setValue(this.verifyApplicantData.secondaryHolderEmail);
          this.secondaryHolderMajorForm.controls.customerPortfolioId.setValue(customerPortfolioId);
          //session save
          this.investmentEngagementService.setMajorSecondaryHolderData(this.secondaryHolderMajorForm.value);
          this.secondaryHolderMajorFormValues = this.secondaryHolderMajorForm.value;
        } else {//else - Major Minor
          this.activeTabId = 2;
          this.buildMinorForm();
          this.secondaryHolderMinorForm.controls.customerPortfolioId.setValue(customerPortfolioId);
          this.secondaryHolderMinorForm.controls.isMinor.setValue(true);
          let dob = this.investmentEngagementService.convertStringToDateObj(this.verifyApplicantData.minorSecondaryHolderSummary.dob);
          this.secondaryHolderMinorForm.controls.isMinor.setValue(this.verifyApplicantData.minor);
          if (this.nationalityList) {
            const nationalityCode = this.verifyApplicantData.minorSecondaryHolderSummary.nationalityCode;
            const nationality = this.nationalityList.find(x => x.nationalityCode == nationalityCode);
            this.secondaryHolderMinorForm.controls.nationality.setValue(nationality)
          }
          this.secondaryHolderMinorForm.addControl(
            'unitedStatesResident', new FormControl(this.verifyApplicantData.minorSecondaryHolderSummary.usPR, Validators.required)
          );
          this.secondaryHolderMinorForm.addControl(
            'fullName', new FormControl(this.verifyApplicantData.minorSecondaryHolderSummary.fullName, [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)])
          );

          this.secondaryHolderMinorForm.addControl(
            'dob', new FormControl(dob ? dob : '', [Validators.required, this.investmentEngagementService.validateMaximumAge])
          );
          this.secondaryHolderMinorForm.addControl(
            'gender', new FormControl(this.verifyApplicantData.minorSecondaryHolderSummary.gender, Validators.required)
          );

          const birthCountryId = this.verifyApplicantData.minorSecondaryHolderSummary.birthCountryId;
          this.secondaryHolderMinorForm.addControl(
            'birthCountry', new FormControl('', [Validators.required])
          );
          if (this.countryList && birthCountryId) {
            const birthCountry = this.countryList.find(x => x.id == birthCountryId);
            this.secondaryHolderMinorForm.controls.birthCountry.setValue(birthCountry);
          }

          const raceName = this.verifyApplicantData.minorSecondaryHolderSummary.race;
          this.secondaryHolderMinorForm.addControl(
            'race', new FormControl('', [Validators.required])
          );
          if (this.raceList && raceName) {
            const race = this.raceList.find(x => x.name.toUpperCase() == raceName.toUpperCase());
            this.secondaryHolderMinorForm.controls.race.setValue(race);
          }

          //iteration 
          const taxArray = this.verifyApplicantData.minorSecondaryHolderSummary.taxDetails;
          let taxArrayResponse = [];
          taxArray.forEach(element => {
            let taxCountry;
            let reasonObj;
            const taxCountryName = element.taxCountryName;
            if (this.countryList && taxCountryName) {
              taxCountry = this.countryList.find(x => x.name.toUpperCase() == taxCountryName.toUpperCase());
            }
            const reason = element.noTinReason;
            if (this.noTinReasonlist && reason) {
              reasonObj = this.noTinReasonlist.find(x => x.name.toUpperCase() == reason.toUpperCase());
            }
            taxArrayResponse.push({
              radioTin: element.isTinNumberPresent,
              taxCountry: taxCountry,
              tinNumber: element.tinNumber,
              noTinReason: reasonObj
            });
          });
          this.setTaxDetails(taxArrayResponse);

          if (this.checkSingaporeNationality()) {
            this.secondaryHolderMinorForm.addControl('isSingaporean', new FormControl(true));
            this.setSingaporeanData();
          } else {
            this.secondaryHolderMinorForm.addControl('isSingaporean', new FormControl(false));
            this.secondaryHolderMinorForm.addControl(
              'singaporeanResident', new FormControl(this.verifyApplicantData.minorSecondaryHolderSummary.singaporePR, Validators.required)
            );
            if (this.checkSingaporeResident()) {
              this.setSingaporeanData();
            } else {
              if (this.minorForeignerRelationships) {
                const relationshipId = this.verifyApplicantData.secondaryHolderRelationshipId;
                const relationship = this.minorForeignerRelationships.find(x => x.id == relationshipId);
                this.secondaryHolderMinorForm.addControl(
                  'relationship', new FormControl(relationship, [Validators.required])
                );
              }
              this.secondaryHolderMinorForm.addControl(
                'passportNumber', new FormControl(this.verifyApplicantData.minorSecondaryHolderSummary.passportNumber, [Validators.required, Validators.pattern(RegexConstants.PassportNumber)])
              );
              let passportExpiryDate = this.investmentEngagementService.convertStringToDateObj(this.verifyApplicantData.minorSecondaryHolderSummary.passportExpiryDate);
              this.secondaryHolderMinorForm.addControl(
                'passportExpiry', new FormControl(passportExpiryDate, [Validators.required])
              );
              if (this.countryList) {
                const issuedCountryId = this.verifyApplicantData.minorSecondaryHolderSummary.passportIssuedCountryId;
                const issuedCountry = this.countryList.find(x => x.id == issuedCountryId);
                this.secondaryHolderMinorForm.addControl(
                  'passportIssuedCountry', new FormControl(issuedCountry, [Validators.required])
                );
              }
            }
          }
          //session save
          this.investmentEngagementService.setMinorSecondaryHolderData(this.secondaryHolderMinorForm.value);
          this.secondaryHolderMinorFormValues = this.secondaryHolderMinorForm.value;
        }
      }
    }, (err) => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  setSingaporeanData() {
    this.secondaryHolderMinorForm.addControl(
      'nricNumber', new FormControl(this.verifyApplicantData.minorSecondaryHolderSummary.nricNumber, [Validators.required])
    );
    this.setNricValidation();

    this.secondaryHolderMinorForm.addControl(
      'issuedCountry', new FormControl('', [Validators.required])
    );
    if (this.countryList) {
      const issuedCountryId = this.verifyApplicantData.minorSecondaryHolderSummary.passportIssuedCountryId;
      const issuedCountry = this.countryList.find(x => x.id == issuedCountryId);
      this.secondaryHolderMinorForm.controls.issuedCountry.setValue(issuedCountry);
    }

    this.secondaryHolderMinorForm.addControl(
      'relationship', new FormControl('', [Validators.required])
    );
    if (this.minorSGRelationships) {
      const relationshipId = this.verifyApplicantData.secondaryHolderRelationshipId;
      const relationship = this.minorSGRelationships.find(x => x.id == relationshipId);
      this.secondaryHolderMinorForm.controls.relationship.setValue(relationship);
    }
  }
  checkSingaporeNationality() {
    return this.verifyApplicantData.minorSecondaryHolderSummary.nationalityCode != null &&
      this.verifyApplicantData.minorSecondaryHolderSummary.nationalityCode == INVESTMENT_ACCOUNT_CONSTANTS.SINGAPORE_NATIONALITY_CODE
  }

  checkSingaporeResident() {
    return this.verifyApplicantData.minorSecondaryHolderSummary != null &&
      this.verifyApplicantData.minorSecondaryHolderSummary.singaporePR;
  }

  setTaxDetails(taxArray) {
    this.secondaryHolderMinorForm.addControl(
      'addTax', this.formBuilder.array([])
    );

    if (taxArray && taxArray.length > 0) {
      // Existing Value
      taxArray.map((item) => {
        this.addTaxForm(item);
      });
    } else {
      this.addTaxForm(null);
    }
  }

  verifyFlowSubmission() {
    this.showLoader();
    this.investmentEngagementService.verifyFlowSubmission(Number(this.customerPortfolioId), INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.SUBMISSION).subscribe((response) => {
      this.loaderService.hideLoader();
      if (response) {
        //clear the session data
        this.investmentCommonService.clearJourneyData();
        const toastMessage: IToastMessage = {
          isShown: true,
          desc: this.translate.instant('TOAST_MESSAGES.VERIFY_SUBMISSION'),
        };
        this.manageInvestmentsService.setToastMessage(toastMessage);
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
      }
    }, (err) => {
      this.loaderService.hideLoader();
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  resetRelationship() {
    const selectedNationalityName = this.secondaryHolderMinorFormValues &&
      this.secondaryHolderMinorFormValues.nationality &&
      this.secondaryHolderMinorFormValues.nationality.name ?
      this.secondaryHolderMinorFormValues.nationality.name.toUpperCase() : '';
    const savedAsSG = [INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_NAME, INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NATIONALITY.COUNTRY_CODE]
      .indexOf(selectedNationalityName) >= 0 ? true : false;
    if (this.secondaryHolderMinorFormValues && ((!savedAsSG &&
      this.secondaryHolderMinorForm.get('singaporeanResident') &&
      this.secondaryHolderMinorForm.get('singaporeanResident').value == !this.secondaryHolderMinorFormValues.singaporeanResident)
      || (savedAsSG && this.secondaryHolderMinorForm.get('singaporeanResident') &&
        !this.secondaryHolderMinorForm.get('singaporeanResident').value))) {
      this.secondaryHolderMinorForm.controls.relationship.setValue('');
    }
  }

  disableMinorSave() {
    return (this.secondaryHolderMinorForm.get('nationality') && !this.secondaryHolderMinorForm.get('nationality').valid)
      || (this.secondaryHolderMinorForm.get('singaporeanResident') && !this.secondaryHolderMinorForm.get('singaporeanResident').valid)
      || (this.secondaryHolderMinorForm.get('unitedStatesResident') && !this.secondaryHolderMinorForm.get('unitedStatesResident').valid)
  }
}
