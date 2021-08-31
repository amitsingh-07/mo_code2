import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';

@Component({
  selector: 'app-add-secondary-holder',
  templateUrl: './add-secondary-holder.component.html',
  styleUrls: ['./add-secondary-holder.component.scss']
})
export class AddSecondaryHolderComponent implements OnInit {

  nationalityList: any;
  selectNationalityForm: FormGroup;
  selectNationalityFormValues: any;
  countryList: any;
  isMinor: boolean;
  @Input('portfolioCategory') portfolioCategory;
  constructor(
    public authService: AuthenticationService,
    private investmentCommonService: InvestmentCommonService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('secondary holder');
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

  isDisabled() {
    return this.investmentAccountService.isDisabled('nationality');
  }

  selectNationality(nationality) {
    this.selectNationalityForm.get('nationality').setValue(nationality);
    this.investmentAccountService.clearNationalityQuestionsSelection(); /* Clearing previously selection for questions */
    this.selectNationalityFormValues = this.investmentAccountService.getInvestmentAccountFormData(); /* Updating variable with form data */
    this.buildAdditionalControls();
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

  goToNext() {
    this.addPortfolio();
  }

  addPortfolio() {
    this.authService.removeEnquiryId();
    this.investmentCommonService.clearFundingDetails();  // #MO2-2446
    this.investmentCommonService.clearJourneyData();
    const portfolioType = this.toDecidedPortfolioType(this.portfolioCategory);
    this.investmentEngagementService.setSelectPortfolioType({ selectPortfolioType: portfolioType });
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
  }

  toDecidedPortfolioType(selectedPortfolioValue) {
    if (selectedPortfolioValue.toUpperCase() ===
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVESTMENT.toUpperCase()) {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO
    } else if (selectedPortfolioValue.toUpperCase() ===
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME.toUpperCase()) {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO
    } else if (selectedPortfolioValue.toUpperCase() ===
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER.toUpperCase()) {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO
    } else {
      return false;
    }
  }

}
