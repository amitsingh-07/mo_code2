import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from '../../app.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { ApiService } from '../../shared/http/api.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { Formatter } from '../../shared/utils/formatter.util';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { IEnquiryUpdate } from '../signup-types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  userProfileInfo: any;
  insuranceEnquiry: any;
  portfolioParchased;
  showPortffolioPurchased = false;
  showNotPurchasedPortfolio = false;
  showInvestmentDetailsSaved = false;
  showNoInvestmentAccount = false;
  showAddportfolio = false;
  showPendingAccountOpening = false;
  showUnsuccessfulAccount = false;
  showSuspendedAccount = false;
  showComplianceRejected = false;
  showSetupAccount = false;


  constructor(
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    public readonly translate: TranslateService, private appService: AppService,
    private signUpService: SignUpService, private apiService: ApiService,
    public navbarService: NavbarService, public footerService: FooterService, private selectedPlansService: SelectedPlansService) { }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.footerService.setFooterVisibility(false);
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.getDashboardList();
    this.translate.use('en');

    this.insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
    if (this.insuranceEnquiry && this.insuranceEnquiry.plans && this.insuranceEnquiry.plans.length > 0) {
      const payload: IEnquiryUpdate = {
        customerId: this.appService.getCustomerId(),
        enquiryId: Formatter.getIntValue(this.insuranceEnquiry.enquiryId),
        selectedProducts: this.insuranceEnquiry.plans
      };
      this.apiService.updateInsuranceEnquiry(payload).subscribe((data) => {
        this.selectedPlansService.clearData();
      });
    }
  }

  goToEngagement() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.GET_STARTED_STEP1]);
  }

  goToEditProfile() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
  }

  goToInvOverview() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.ROOT]);
  }

  goToDocUpload() {
    this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
      const nationalityList = data.objectList;
      const countryList = this.getCountryList(data.objectList);
      this.investmentAccountService.setNationalitiesCountries(nationalityList, countryList);
      const beneficialOwner = this.userProfileInfo.investementDetails
        && this.userProfileInfo.investementDetails.beneficialOwner ? this.userProfileInfo.investementDetails.beneficialOwner : false;
      const pep = this.userProfileInfo.investementDetails && this.userProfileInfo.investementDetails.isPoliticallyExposed ?
        this.userProfileInfo.investementDetails.isPoliticallyExposed : false;
      const myInfoVerified = this.userProfileInfo.investementDetails && this.userProfileInfo.investementDetails.myInfoVerified ?
      this.userProfileInfo.investementDetails.myInfoVerified : false;
      this.investmentAccountService.setDataForDocUpload(this.userProfileInfo.nationality, beneficialOwner, pep, myInfoVerified);
      if (myInfoVerified && beneficialOwner) {
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS_BO]);
      } else {
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS]);
      }
    });
  }

  getCountryList(data) {
    const countryList = [];
    data.forEach((nationality) => {
      nationality.countries.forEach((country) => {
        countryList.push(country);
      });
    });
    return countryList;
  }

  getDashboardList() {
    const investmentStatus = this.userProfileInfo.investementDetails
      && this.userProfileInfo.investementDetails.account
      && this.userProfileInfo.investementDetails.account.accountStatus ?
      this.userProfileInfo.investementDetails.account.accountStatus : null;
    switch (investmentStatus) {
      case 'PORTFOLIO_PURCHASED': {
        this.showPortffolioPurchased = true;
        break;
      }
      case 'INVESTMENT_ACCOUNT_DETAILS_SAVED': {
        this.showInvestmentDetailsSaved = true;
        break;
      }
      case 'NO_INVESTMENT_ACCOUNT': {
        this.showNoInvestmentAccount = true;
        break;
      }
      case 'ADD_POERFOLIO': {
        this.showAddportfolio = true;
        break;
      }
      case 'PENDING_ACCOUNT_OPENING': {
        this.showPendingAccountOpening = true;
        break;
      }
      case 'UNSUCCESSFUL_ACCOUNT': {
        this.showUnsuccessfulAccount = true;
        break;
      }
      case 'SETUP_ACCOUNT': {
        this.showSetupAccount = true;
        break;
      }
      case 'SUSPENDED_ACCOUNT': {
        this.showSuspendedAccount = true;
        break;
      }
      case 'COMPLIANCE_REJECETD': {
        this.showComplianceRejected = true;
        break;
      }
      default: {
        this.showNotPurchasedPortfolio = true;
        break;
      }
    }
  }
}
