import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';
import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
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
    });
    this.buildMajorForm();
  }

  ngOnInit(): void {

  }

  buildMinorForm() {
    this.secondaryHolderMinorForm = new FormGroup({
      isMinor: new FormControl('', Validators.required),
      unitedStatesResident: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required)
    });
    this.secondaryHolderMinorForm.controls.isMinor.setValue(true);
  }

  buildMajorForm() {
    this.secondaryHolderMajorForm = new FormGroup({
      isMinor: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(RegexConstants.Email)]),
      relationship: new FormControl('', Validators.required),
      nricNumber: new FormControl('', [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]),
    });
    this.secondaryHolderMajorForm.controls.isMinor.setValue(false);
  }

  selectedSecondaryHolderAge(secondaryHolderType) {
    this.investmentEngagementService.setIsMinor(secondaryHolderType);
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
    console.log('cointry', nationality);
    this.secondaryHolderMinorForm.controls.nationality.setValue(nationality);
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
    console.log('us pr', this.secondaryHolderMinorForm.value);
  }

  showErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
  }

  singaporeanPRChange(isSingaporePR) {
  }

  minorHolderGoToNext() {
    console.log('form', this.secondaryHolderMinorForm.controls);
    // if(this.secondaryHolderForm.valid) {
    if (this.secondaryHolderMinorForm.value.nationality?.blocked) {
      this.showBlockedCountryErrorMessage('Oops, Unable To Proceed', 'Due to compliance issues, MoneyOwl is unable to accept customers from the selected country.');
    } else if (this.secondaryHolderMinorForm.value.unitedStatesResident) {
      this.showErrorMessage('Oops, Unable To Proceed',
        'Due to compliance issues, MoneyOwl is unable to accept customers who are US Citizens, Permanent Residents or Tax Residents.');
    }
    // }
  }

  isSingaporePR() {
    if (this.secondaryHolderMinorForm.value.singaporeanResident) {
      return true;
    } else {
      return false;
    }
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
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  majorHolderGoToNext() {

  }

  tabChange() {
    if (this.activeTabId === 2) {
      this.buildMinorForm();
      this.getNationalityCountryList();
    } else {
      this.buildMajorForm();
    }
  }
}
