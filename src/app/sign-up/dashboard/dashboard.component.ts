import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../../app.service';
import { ConfigService, IConfig } from '../../config/config.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { ApiService } from '../../shared/http/api.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { Formatter } from '../../shared/utils/formatter.util';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { IEnquiryUpdate } from '../signup-types';

// Will Writing
import { WillWritingApiService } from 'src/app/will-writing/will-writing.api.service';
import { WillWritingService } from 'src/app/will-writing/will-writing.service';
import { WILL_WRITING_ROUTE_PATHS } from '../../will-writing/will-writing-routes.constants';

// Insurance
import { GuideMeApiService } from 'src/app/guide-me/guide-me.api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  userProfileInfo: any;
  insuranceEnquiry: any;
  showPortfolioPurchased = false;
  showStartInvesting = false;
  showInvestmentDetailsSaved = false;
  showNoInvestmentAccount = false;
  showAddPortfolio = false;
  showCddCheckOngoing = false;
  showSuspendedAccount = false;
  showBlockedNationalityStatus = false;
  showSetupAccount = false;
  showCddCheckFail = false;
  showEddCheckFailStatus = false;
  isInvestmentEnabled = false;
  isInvestmentConfigEnabled = false;
  totalValue: any;
  totalReturns: any;
  availableBalance: any;

  // Will Writing
  showWillWritingSection = false;
  wills: any = {};

  // Insurance
  showInsuranceSection = false;
  insurance: any = {};

  constructor(
    private router: Router,
    private configService: ConfigService,
    private signUpApiService: SignUpApiService,
    private investmentAccountService: InvestmentAccountService,
    public readonly translate: TranslateService,
    private appService: AppService,
    private signUpService: SignUpService,
    private apiService: ApiService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private selectedPlansService: SelectedPlansService,
    private willWritingApiService: WillWritingApiService,
    private willWritingService: WillWritingService,
    private guideMeApiService: GuideMeApiService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isInvestmentConfigEnabled = config.investmentEnabled;
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(100);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.loadOptionListCollection();
    this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
      this.signUpService.setUserProfileInfo(userInfo.objectList);
      this.userProfileInfo = this.signUpService.getUserProfileInfo();
      this.getDashboardList();
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
    });

    // Will Writing
    this.willWritingApiService.getWill().subscribe((data) => {
      this.showWillWritingSection = true;
      if (data.responseMessage && data.responseMessage.responseCode === 6000) {
        this.wills.hasWills = true;
        this.wills.completedWill = data.objectList[0].willProfile.hasWills === 'Y';
        this.wills.lastUpdated = data.objectList[0].willProfile.profileLastUpdatedDate;
        if (!this.willWritingService.getIsWillCreated()) {
          this.willWritingService.convertWillFormData(data.objectList[0]);
          this.willWritingService.setIsWillCreated(true);
        }
      } else if (data.responseMessage && data.responseMessage.responseCode === 6004) {
        this.wills.hasWills = false;
      }
    });

    // Insurance
    this.guideMeApiService.getCustomerInsuranceDetails().subscribe(data => {
      this.showInsuranceSection = true;
      if (data.responseMessage && data.responseMessage.responseCode === 6000) {
        this.insurance.hasInsurance = data.objectList[0].hasDoneInsuranceJourney;
        this.insurance.lastTransactionDate = data.objectList[0].lastTransactionDate;
      }
    })
  }

  loadOptionListCollection() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.investmentAccountService.setOptionList(data.objectList);
    });
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

  // tslint:disable-next-line:cognitive-complexity
  goToDocUpload() {
    this.signUpService.getDetailedCustomerInfo().subscribe((customerData) => {
      this.investmentAccountService.getNationalityCountryList().subscribe((nationalityData) => {
        const nationalityList = nationalityData.objectList;
        const countryList = this.investmentAccountService.getCountryList(nationalityData.objectList);
        this.investmentAccountService.setNationalitiesCountries(nationalityList, countryList);
        this.investmentAccountService.setInvestmentAccountFormData(customerData.objectList);
        const beneficialOwner = this.userProfileInfo.investementDetails
          && this.userProfileInfo.investementDetails.beneficialOwner ? this.userProfileInfo.investementDetails.beneficialOwner : false;
        const pep = this.userProfileInfo.investementDetails && this.userProfileInfo.investementDetails.isPoliticallyExposed ?
          this.userProfileInfo.investementDetails.isPoliticallyExposed : false;
        const myInfoVerified = this.userProfileInfo.investementDetails && this.userProfileInfo.investementDetails.myInfoVerified ?
          this.userProfileInfo.investementDetails.myInfoVerified : false;
        this.investmentAccountService.setDataForDocUpload(this.userProfileInfo.nationality, beneficialOwner, pep, myInfoVerified);
        if (myInfoVerified) {
          if (beneficialOwner) {
            this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS_BO]);
          } else {
            this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ACKNOWLEDGEMENT]);
          }
        } else {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS]);
        }
      });
    });
  }

  goToInvestmentAccount() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ROOT]);
  }

  getDashboardList() {
    const investmentStatus = this.signUpService.getInvestmentStatus();
    if (investmentStatus === SIGN_UP_CONFIG.INVESTMENT.PORTFOLIO_PURCHASED.toUpperCase() ||
      investmentStatus === SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_FUNDED.toUpperCase() ||
      investmentStatus === SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATED.toUpperCase()) {
      this.totalValue = this.userProfileInfo.investementDetails.totalValue ? this.userProfileInfo.investementDetails.totalValue : 0;
      this.totalReturns = this.userProfileInfo.investementDetails.totalReturns ?
        this.userProfileInfo.investementDetails.totalReturns * 100 : 0;
      this.availableBalance = this.userProfileInfo.investementDetails.account &&
        this.userProfileInfo.investementDetails.account.cashAccountBalance ?
        this.userProfileInfo.investementDetails.account.cashAccountBalance : 0;
    }
    this.setInvestmentDashboardStatus(investmentStatus);
  }

  setInvestmentDashboardStatus(investmentStatus) {
    switch (investmentStatus) {
      case SIGN_UP_CONFIG.INVESTMENT.RECOMMENDED:
      case SIGN_UP_CONFIG.INVESTMENT.ACCEPTED_NATIONALITY: {
        this.showSetupAccount = true;
        this.enableInvestment();
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.BLOCKED_NATIONALITY: {
        this.showBlockedNationalityStatus = true;
        this.enableInvestment();
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.INVESTMENT_ACCOUNT_DETAILS_SAVED:
      case SIGN_UP_CONFIG.INVESTMENT.DOCUMENTS_UPLOADED: {
        this.showInvestmentDetailsSaved = true;
        this.enableInvestment();
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.CDD_CHECK_PENDING:
      case SIGN_UP_CONFIG.INVESTMENT.EDD_CHECK_CLEARED:
      case SIGN_UP_CONFIG.INVESTMENT.EDD_CHECK_PENDING: {
        this.showCddCheckOngoing = true;
        this.enableInvestment();
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.EDD_CHECK_FAILED: {
        this.showEddCheckFailStatus = true;
        this.enableInvestment();
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.CDD_CHECK_FAILED:
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATION_FAILED: {
        this.showCddCheckFail = true;
        this.enableInvestment();
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATED:
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_FUNDED:
      case SIGN_UP_CONFIG.INVESTMENT.PORTFOLIO_PURCHASED: {
        this.showPortfolioPurchased = true;
        this.enableInvestment();
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_SUSPENDED: {
        this.showSuspendedAccount = true;
        this.enableInvestment();
        break;
      }
      default: {
        if (this.isInvestmentConfigEnabled) {
          this.showStartInvesting = true;
          this.enableInvestment();
        } else {
          this.showStartInvesting = false;
        }
        break;
      }
    }
  }

  verifyCustomerDetails() {
    this.signUpService.getDetailedCustomerInfo().subscribe((customerData) => {
      this.investmentAccountService.getNationalityCountryList().subscribe((nationalityData) => {
        const nationalityList = nationalityData.objectList;
        const countryList = this.investmentAccountService.getCountryList(nationalityData.objectList);
        this.investmentAccountService.setNationalitiesCountries(nationalityList, countryList);
        this.investmentAccountService.setInvestmentAccountFormData(customerData.objectList);
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
      });
    });
  }

  formatReturns(value) {
    return this.investmentAccountService.formatReturns(value);
  }

  enableInvestment() {
    this.isInvestmentEnabled = true;
  }

  // Will-writing
  redirectTo(page: string) {
    if (page === 'edit') {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.CONFIRMATION]);
    } else {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.INTRODUCTION]);
    }
  }
  downloadWill() {
    this.willWritingApiService.downloadWill().subscribe((data: any) => {
      this.saveAs(data);
    }, (error) => console.log(error));
  }

  saveAs(data) {
    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const otherBrowsers = /Android|Windows/.test(navigator.userAgent);

    const blob = new Blob([data], { type: 'application/pdf' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'MoneyOwl Will writing.pdf');
    } else {
      this.downloadFile(data);
    }
  }

  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = 'MoneyOwl Will Writing.pdf';
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);
  }

}
