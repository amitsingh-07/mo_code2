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
  @Input('portfolioCategory') portfolioCategory;
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
      this.tooltipDetails = this.translate.instant('BLOCKED_COUNTRY_TOOLTIP');
    });
  }

  ngOnInit(): void {
    console.log('secondary holder');
    this.secondaryHolderFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.secondaryHolderForm = new FormGroup({
      isMinor: new FormControl('', Validators.required)
    });
    this.getNationalityCountryList();
  }

  addNationalityControl() {
    this.secondaryHolderForm.addControl(
      'singaporeanResident',
      new FormControl('', Validators.required)
    );
  }

  addResidentialsControl() {
    this.secondaryHolderForm.removeControl('unitedStatesResident');
    this.secondaryHolderForm.removeControl('singaporeanResident');
    this.cdr.detectChanges();
    const selectedNationality = this.secondaryHolderForm.controls.nationality.value;
    const selectedNationalityName = this.secondaryHolderForm.controls.nationality.value &&
      this.secondaryHolderForm.controls.nationality.value.name ?
      this.secondaryHolderForm.controls.nationality.value.name.toUpperCase() : '';
    if (['SINGAPOREAN', 'SG'].indexOf(selectedNationalityName) >= 0) {
      this.secondaryHolderForm.addControl(
        'unitedStatesResident',
        new FormControl(this.secondaryHolderFormValues.unitedStatesResident, Validators.required)
      );
    } else if (selectedNationality && !selectedNationality.blocked) {
      this.secondaryHolderForm.addControl(
        'unitedStatesResident',
        new FormControl(this.secondaryHolderFormValues.unitedStatesResident, Validators.required)
      );
      this.secondaryHolderForm.addControl(
        'singaporeanResident',
        new FormControl(this.secondaryHolderFormValues.singaporeanResident, Validators.required)
      );
    }
  }

  selectedSecondaryHolderAge(secondaryHolderType) {
    this.investmentEngagementService.setSecondaryHolderType(secondaryHolderType);
  }

  getNationalityCountryList() {
    this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
      this.nationalityList = data.objectList;
      this.countryList = this.investmentAccountService.getCountryList(data.objectList);
      if (this.secondaryHolderFormValues.nationalityCode) {
        const nationalityObj = this.getSelectedNationality(
          this.secondaryHolderFormValues.nationalityCode
        );
        this.secondaryHolderForm.controls.nationality.setValue(nationalityObj);
      }
      this.addResidentialsControl();
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
}
