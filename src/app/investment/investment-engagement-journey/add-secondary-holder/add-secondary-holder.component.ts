import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';
import { ErrorModalComponent } from 'src/app/shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from 'src/app/shared/modal/model-with-button/model-with-button.component';
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
  secondaryHolderForm: FormGroup;
  secondaryHolderFormValues: any;
  userProfileType: any;
  tooltipDetails: any;
  blockedCountryModal: any;
  activeTabId = 1;
  investmentAccountSecondaryHolder: any;
  @Input('portfolioCategory') portfolioCategory;
  editModalData: any;
  blockedNationalityModal: any;
  constructor(
    public authService: AuthenticationService,
    private investmentCommonService: InvestmentCommonService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modal: NgbModal,
    public readonly translate: TranslateService
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
  }

  ngOnInit(): void {
    console.log('secondary holder');
    this.secondaryHolderForm = new FormGroup({
      isMinor: new FormControl('', Validators.required),
      unitedStatesResident: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required)
    });
    this.getNationalityCountryList();
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
    this.secondaryHolderForm.controls.isMinor.setValue(true);
    this.secondaryHolderForm.controls.nationality.setValue(nationality);
    if (nationality.blocked) {
      this.showBlockedCountryErrorMessage('Oops, Unable To Proceed', 'Due to compliance issues, MoneyOwl is unable to accept customers from the selected country.');
      this.secondaryHolderForm.removeControl('singaporeanResident');
    } else {
      if (!this.isNationalitySingapore()) {
        this.secondaryHolderForm.addControl(
          'singaporeanResident', new FormControl('', Validators.required)
        );
      } else {
        this.secondaryHolderForm.removeControl('singaporeanResident');
      }
    }
  }

  isNationalitySingapore() {
    const selectedNationalityName = this.secondaryHolderForm.controls.nationality.value &&
      this.secondaryHolderForm.controls.nationality.value.name ?
      this.secondaryHolderForm.controls.nationality.value.name.toUpperCase() : '';
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
    console.log('us pr', this.secondaryHolderForm.value);
  }

  showErrorMessage(modalTitle: any, modalMessage: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = modalTitle;
    ref.componentInstance.errorMessage = modalMessage;
  }

  singaporeanPRChange(isSingaporePR) {
    console.log('SR pr', isSingaporePR);
    // this.secondaryHolderForm.controls.singaporeanResident.setValue(isSingaporePR);
    console.log('form', this.secondaryHolderForm.value);
  }

  goToNext() {
    console.log('form', this.secondaryHolderForm.controls);
    // if(this.secondaryHolderForm.valid) {
    if (this.secondaryHolderForm.value.nationality?.blocked) {
      this.showBlockedCountryErrorMessage('Oops, Unable To Proceed', 'Due to compliance issues, MoneyOwl is unable to accept customers from the selected country.');
    } else if (this.secondaryHolderForm.value.unitedStatesResident) {
      this.showErrorMessage('Oops, Unable To Proceed',
        'Due to compliance issues, MoneyOwl is unable to accept customers who are US Citizens, Permanent Residents or Tax Residents.');
    }
    // }
  }
}
