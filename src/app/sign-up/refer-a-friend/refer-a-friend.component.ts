import { Component, Renderer2, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin as observableForkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from './../../../environments/environment';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { RefereeComponent } from '../../shared/modal/referee/referee.component';

import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpService } from '../sign-up.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { InvestmentCommonService } from '../../investment/investment-common/investment-common.service';
import { ConfigService } from '../../config/config.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment/investment-account/investment-account-routes.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment/investment-common/investment-common-routes.constants';
@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.component.html',
  styleUrls: ['./refer-a-friend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferAFriendComponent implements OnInit {
  isCollapsed: boolean = false;
  pageTitle: string;
  facebookShareLink: any;
  whatsappShareLink: any;
  telegramShareLink: any;
  mailToLink: any;
  referrerLink: any;
  showFixedToastMessage: boolean;
  toastMsg: any;
  referralCode = '';
  referrerName: any;
  refereeTotalList = [];
  refereeList = [];
  totalRefereeListCount: number;
  isHidden: boolean = true;
  pageLimit = 5;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('toggleIcon') toggleIcon: ElementRef;
  investmentsSummary: any;
  isInvestmentEnabled: boolean;
  isInvestmentConfigEnabled = false;
  showStartInvesting: boolean;
  iFastMaintenance: boolean;
  constructor(
    private router: Router,
    public navbarService: NavbarService,
    public modal: NgbModal,
    private translate: TranslateService,
    private signUpService: SignUpService,
    private renderer: Renderer2,
    private investmentAccountService: InvestmentAccountService,
    private investmentCommonService: InvestmentCommonService,
    private configService: ConfigService,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    this.pageTitle = "Refer a friend";
    this.setPageTitle(this.pageTitle);
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleButton.nativeElement && e.target !== this.toggleIcon.nativeElement) {
        this.isHidden = true;
      }
    });
  }

  ngOnInit(): void {
    this.signUpService.getEditProfileInfo().subscribe((data) => {
      const responseMessage = data.responseMessage;
      if (responseMessage.responseCode === 6000) {
        if (data.objectList && data.objectList.personalInformation) {
          const personalData = data.objectList.personalInformation;
          this.referrerName = personalData.fullName ?
            personalData.fullName : personalData.firstName + ' ' + personalData.lastName;
          this.referralCode = 'KELV-TA23';
          this.createReferrerLink();
        }
      }
    });
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.refereeTotalList = [
      { name: 'Edwin Toh', rewards: 20 },
      { name: 'Harry Tan', rewards: 20 },
      { name: 'Teng Wei Hao', rewards: 20 },
      { name: 'Natalie Ho', rewards: 40 },
      { name: 'Bruno Mars', rewards: 20 },
      { name: 'Edwin Toh1', rewards: 20 },
      { name: 'Harry Tan2', rewards: 20 },
      { name: 'Teng Wei Hao3', rewards: 20 },
      { name: 'Natalie Ho4', rewards: 40 },
      { name: 'Bruno Mars5', rewards: 20 },
      { name: 'Edwin Toh11', rewards: 20 },
      { name: 'Harry Tan12', rewards: 20 },
      { name: 'Teng Wei Hao13', rewards: 20 },
      { name: 'Natalie Ho14', rewards: 40 },
      { name: 'Bruno Mars15', rewards: 20 }
    ];
    this.refereeList = this.refereeTotalList.slice(0, this.pageLimit);
    this.totalRefereeListCount = this.refereeTotalList.length;
  }


  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }


  goToRewards() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  // create Referrer Link
  createReferrerLink() {
    const socialMessage = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MESSAGE');
    const socialMail1 = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL_BODY1');
    const socialMail2 = this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL_BODY2');
    const socialMailSubject = encodeURIComponent(this.translate.instant('SOCIAL_LINK_MESSAGE.SOCIAL_MAIL_SUBJECT'));
    this.referrerLink = environment.apiBaseUrl + SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.SIGN_UP_URL + this.referralCode;
    const socialMessageEncoded = encodeURIComponent(socialMessage + this.referrerLink);
    const fbMessage = socialMessageEncoded + '&u=' + encodeURIComponent(this.referrerLink);
    this.facebookShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.FACEBOOK + fbMessage;
    this.whatsappShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.WHATSAPP + socialMessageEncoded;
    this.telegramShareLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.TELEGRAM + socialMessageEncoded;
    const socialMailEncoded = encodeURIComponent(socialMail1 + this.referrerLink + socialMail2 + this.referrerName);
    this.mailToLink = SIGN_UP_CONFIG.SOCIAL_REFERRER_LINK.MAILTO + socialMailEncoded + '&subject=' + socialMailSubject;
  }

  openRefereeModal() {
    const ref = this.modal.open(RefereeComponent, { centered: true });
    ref.componentInstance.errorTitle = "referee";
    ref.componentInstance.errorMessage = 'Welcome to the referee.';
    ref.componentInstance.comprehensiveAction.subscribe(() => {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
    ref.componentInstance.investmentAction.subscribe(() => {
    this.getInvestmentsSummary();

    });
    ref.componentInstance.insuranceAction.subscribe(() => {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
  }

  notify(event) {
    const toasterMsg = {
      desc: this.translate.instant('SOCIAL_LINK_MESSAGE.COPIED')
    };
    this.toastMsg = toasterMsg;
    this.showFixedToastMessage = true;
    this.hideToastMessage();
  }

  hideToastMessage() {
    setTimeout(() => {
      this.showFixedToastMessage = false;
      this.toastMsg = null;
    }, 3000);
  }

  toggleinfo(event) {
    this.isCollapsed = !this.isCollapsed;
  }
  getReferralLink() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = "Get referral link";
    ref.componentInstance.errorMessage = 'We want you to try us out before your friends do! <br></br>Get started with any of our services (from your Dashboard), and come back here again. Your referral link will show after processing completes within 2 to 4 weeks.';
    ref.componentInstance.primaryActionLabel = 'Go to Dashboard';
    ref.componentInstance.primaryAction.subscribe(() => {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    });
  }

  openSocialMedia(event) {
    this.isHidden = !this.isHidden;
  }

  getRefereeList() {
    if (this.totalRefereeListCount > this.refereeList.length) {
      this.refereeList = this.refereeTotalList.slice(0, (this.pageLimit + this.refereeList.length));
    }
  }
  //  INVESTMENT RE DIRECTION  FLOW 
  getInvestmentsSummary() {
    this.investmentAccountService.getInvestmentsSummary().subscribe((data) => {
      if (data && data.responseMessage && data.responseMessage.responseCode === 6000) {
        this.investmentsSummary = data.objectList;
        this.setInvestmentsSummary(this.investmentsSummary);
        this.getInvestmentStatus();
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  setInvestmentsSummary(investmentsSummary) {
    this.investmentCommonService.setInvestmentsSummary(investmentsSummary);
  }
  getInvestmentStatus() {
    const investmentStatus = this.investmentCommonService.getInvestmentStatus();
    this.showInvestmentsSummary(investmentStatus);

  }
  enableInvestment() {
    this.isInvestmentEnabled = true;
    // Check if iFast is in maintenance
    this.configService.getConfig().subscribe((config) => {
      if (config.iFastMaintenance && this.configService.checkIFastStatus(config.maintenanceStartTime, config.maintenanceEndTime)) {
        this.iFastMaintenance = true;
        this.isInvestmentEnabled = false;
      }
    });
  }
  showInvestmentsSummary(investmentStatus) {
    switch (investmentStatus) {
      case SIGN_UP_CONFIG.INVESTMENT.PROPOSED:
      case SIGN_UP_CONFIG.INVESTMENT.RECOMMENDED:
      case SIGN_UP_CONFIG.INVESTMENT.ACCEPTED_NATIONALITY: {
        this.enableInvestment();
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ROOT]);       
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.BLOCKED_NATIONALITY:
      case SIGN_UP_CONFIG.INVESTMENT.CDD_CHECK_PENDING:
      case SIGN_UP_CONFIG.INVESTMENT.EDD_CHECK_CLEARED:
      case SIGN_UP_CONFIG.INVESTMENT.EDD_CHECK_PENDING:
      case SIGN_UP_CONFIG.INVESTMENT.EDD_CHECK_FAILED:
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_SUSPENDED: {
        this.enableInvestment();
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);       
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.INVESTMENT_ACCOUNT_DETAILS_SAVED:
      case SIGN_UP_CONFIG.INVESTMENT.DOCUMENTS_UPLOADED:
      case SIGN_UP_CONFIG.INVESTMENT.PORTFOLIO_CONFIRMED: {
        this.enableInvestment();
        this.goToDocUpload();        
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.CDD_CHECK_FAILED:
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATION_FAILED: {
        this.enableInvestment();
        this.verifyCustomerDetails();        
        break;
      }
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATED:
      case SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_FUNDED:
      case SIGN_UP_CONFIG.INVESTMENT.PORTFOLIO_PURCHASED: {
        this.enableInvestment();
        if (this.investmentsSummary.portfolioSummary && this.investmentsSummary.portfolioSummary.numberOfPortfolios > 0) {
          this.navbarService.setMenuItemInvestUser(true);
        }
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
        break;
      }
    }
  }

  goToDocUpload() {
    observableForkJoin(
      this.signUpService.getDetailedCustomerInfo(),
      this.investmentAccountService.getNationalityCountryList()
    ).subscribe((response) => {
      const customerData = response[0];
      const nationalityData = response[1];
      const nationalityList = nationalityData.objectList;
      const countryList = this.investmentAccountService.getCountryList(nationalityData.objectList);
      this.investmentAccountService.setNationalitiesCountries(nationalityList, countryList);
      this.investmentAccountService.setInvestmentAccountFormData(customerData.objectList);
      const beneficialOwner = customerData.objectList.additionalDetails
        && customerData.objectList.additionalDetails.beneficialOwner ? customerData.objectList.additionalDetails.beneficialOwner : false;
      const myInfoVerified = customerData.objectList.isMyInfoVerified ?
        customerData.objectList.isMyInfoVerified : false;
      this.investmentAccountService.setMyInfoStatus(customerData.objectList.isMyInfoVerified);
      if (myInfoVerified) {
        if (beneficialOwner) {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS_BO]);
        } else {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ACKNOWLEDGEMENT]);
        }
      } else {
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS]);
      }
    });
  }

  //
  verifyCustomerDetails() {
    observableForkJoin(
      this.signUpService.getDetailedCustomerInfo(),
      this.investmentAccountService.getNationalityCountryList()
    ).subscribe((response) => {
      const customerData = response[0];
      const nationalityData = response[1];
      const nationalityList = nationalityData.objectList;
      const countryList = this.investmentAccountService.getCountryList(nationalityData.objectList);
      this.investmentAccountService.setNationalitiesCountries(nationalityList, countryList);
      this.investmentAccountService.setInvestmentAccountFormData(customerData.objectList);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
    });
  }

}
