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
import { ComprehensiveApiService } from '../../comprehensive/comprehensive-api.service';
import { ComprehensiveService } from '../../comprehensive/comprehensive.service';
import { COMPREHENSIVE_CONST } from 'src/app/comprehensive/comprehensive-config.constants';
import { AppService } from 'src/app/app.service';
import { COMPREHENSIVE_ROUTE_PATHS } from 'src/app/comprehensive/comprehensive-routes.constants';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { IMyProfile } from 'src/app/comprehensive/comprehensive-types';
import { GuideMeApiService } from 'src/app/guide-me/guide-me.api.service';
import { GuideMeService } from 'src/app/guide-me/guide-me.service';
import { SelectedPlansService } from 'src/app/shared/Services/selected-plans.service';
import { GUIDE_ME_ROUTE_PATHS } from 'src/app/guide-me/guide-me-routes.constants';
import { DIRECT_ROUTE_PATHS } from 'src/app/direct/direct-routes.constants';
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

  // comprehensive 

  userName: string;
  comprehensivePlanning: number;
  userDetails: IMyProfile;
  getComprehensiveSummary: any;
  getComprehensiveSummaryEnquiry: any;
  reportStatus: any; // new submitted ready
  advisorStatus: boolean;
  reportDate: any;
  submittedDate: any;
  currentStep: number;
  stepDetails = { hasDependents: 1, hasEndowments: 2 };
  items: any;
  isLoadComplete = false;
  islocked: boolean;
  isComprehensiveEnabled = false;
  isComprehensiveLiveEnabled = false;
  getComprehensiveDashboard: any;
  getCurrentVersionType = '';
  comprehensiveLiteEnabled: boolean;
  versionTypeEnabled: boolean;
  getComprehensiveSummaryDashboard: any;
  promoCodeValidated = false;
  enquiryId: any;
  isReportGenerated = false;
  fetchData: string;
  paymentInstructions = false;
  showInsuranceSection: boolean;
  // INSURANCE 
  insurance: any = {};
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
    private comprehensiveApiService: ComprehensiveApiService,
    private appService: AppService,
    private loaderService: LoaderService,
    private comprehensiveService: ComprehensiveService,
    private guideMeApiService :GuideMeApiService,
    private guideMeService :GuideMeService,
    private selectedPlansService: SelectedPlansService,
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
      this.getInsurance();
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
    ref.componentInstance.errorTitle = this.translate.instant('REFER_A_FRIEND.REFER_LINK_MODAL.TITLE');
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



  // COMPREHENSIVE REDIRECT 
  getComprehensive() {
    this.isLoadComplete = false;
    this.comprehensivePlanning = 4;
    this.islocked = null;
    this.reportStatus = null;
    this.advisorStatus = false;
    this.getComprehensiveSummaryDashboard = '';
    this.currentStep = -1;
    this.paymentInstructions = false;
    const action = this.appService.getAction();
    this.comprehensiveApiService.getComprehensiveSummaryDashboard().subscribe((dashboardData: any) => {
      if (dashboardData && dashboardData.objectList[0]) {
        this.getComprehensiveSummaryDashboard = this.comprehensiveService.filterDataByInput(dashboardData.objectList, 'type', this.getCurrentVersionType);
        if (this.getComprehensiveSummaryDashboard !== '') {
          this.islocked = this.getComprehensiveSummaryDashboard.isLocked;
          this.paymentInstructions = (this.getComprehensiveSummaryDashboard.paymentStatus
            && (this.getComprehensiveSummaryDashboard.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PENDING ||
              this.getComprehensiveSummaryDashboard.paymentStatus.toLowerCase() === COMPREHENSIVE_CONST.PAYMENT_STATUS.PARTIAL_PENDING)
            && this.getCurrentVersionType === this.getComprehensiveSummaryDashboard.type);
          this.promoCodeValidated = this.getComprehensiveSummaryDashboard.isValidatedPromoCode;
          this.reportStatus = this.getComprehensiveSummaryDashboard.reportStatus;
          this.enquiryId = this.getComprehensiveSummaryDashboard.enquiryId;
          if ((this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW || this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.EDIT) && (this.islocked === null || !this.islocked)) {
            this.comprehensivePlanning = 3;
          } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED && !this.islocked) {
            this.comprehensivePlanning = 5;
            if (this.getComprehensiveSummaryDashboard.reportSubmittedTimeStamp) {
              this.submittedDate = this.getComprehensiveSummaryDashboard.reportSubmittedTimeStamp;
            }
          } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
            this.comprehensivePlanning = 0;
          }
          else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY || this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.ERROR) {
            this.comprehensivePlanning = 1;
            if (this.getComprehensiveSummaryDashboard.reportSubmittedTimeStamp) {
              this.submittedDate = this.getComprehensiveSummaryDashboard.reportSubmittedTimeStamp;
              this.isReportGenerated = this.getComprehensiveSummaryDashboard.reportStatus ===
                COMPREHENSIVE_CONST.REPORT_STATUS.READY ? true : false;
            }
          }
          this.currentStep = (this.getComprehensiveSummaryDashboard.stepCompleted !== null)
            ? this.getComprehensiveSummaryDashboard.stepCompleted : 0;

        }
        this.isLoadComplete = true;
        this.redirectScreen();
      } else {
        this.redirectScreen();
        this.isLoadComplete = true;
      }

    });
  }
  // goToEditComprehensivePlan
  goToEditComprehensivePlan(viewMode: boolean) {
    if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
      if (!this.islocked) {
        this.getComprehensiveCall();
      } else if (this.getComprehensiveSummaryDashboard.dobPopUpEnable) {
        this.setComprehensiveSummary(false, '');
        const toolTipParams = {
          TITLE: '',
          DESCRIPTION: this.translate.instant('COMPREHENSIVE.DASHBOARD.WARNING_POPUP'),
          URL: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED
        };
        this.comprehensiveService.openTooltipModalWithDismiss(toolTipParams);
      } else {
        this.comprehensiveApiService.getComprehensiveSummary(this.getCurrentVersionType).subscribe((data: any) => {
          if (data && data.objectList[0]) {
            this.comprehensiveService.setComprehensiveSummary(data.objectList[0]);
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
          }
        });
      }
    } else if (this.versionTypeEnabled &&
      (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) || (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.ERROR)) {
      this.getComprehensiveCall();
    } else {
      this.comprehensiveApiService.getComprehensiveSummary(this.getCurrentVersionType).subscribe((data: any) => {
        if (data && data.objectList[0]) {
          this.comprehensiveService.setComprehensiveSummary(data.objectList[0]);
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
        }
      });
    }

  }

  // getComprehensiveCall
  getComprehensiveCall() {
    this.loaderService.showLoader({ title: this.fetchData });
    let reportStatusValue = COMPREHENSIVE_CONST.REPORT_STATUS.NEW;
    if ((!this.versionTypeEnabled && this.comprehensivePlanning === 0) || this.comprehensivePlanning === 1) {
      reportStatusValue = COMPREHENSIVE_CONST.REPORT_STATUS.EDIT;
    }
    const payload = { enquiryId: this.enquiryId, reportStatus: reportStatusValue };
    this.comprehensiveApiService.updateComprehensiveReportStatus(payload).subscribe((data: any) => {
      if (data) {
        this.comprehensiveApiService.getComprehensiveSummary(this.getCurrentVersionType).subscribe((summaryData: any) => {
          if (summaryData) {
            summaryData.objectList[0].comprehensiveEnquiry.reportStatus = COMPREHENSIVE_CONST.REPORT_STATUS.EDIT;
            this.comprehensiveService.setComprehensiveSummary(summaryData.objectList[0]);
            this.comprehensiveService.setReportStatus(COMPREHENSIVE_CONST.REPORT_STATUS.EDIT);
            this.comprehensiveService.setViewableMode(true);
            this.loaderService.hideLoader();
            this.comprehensiveService.setRiskQuestions().subscribe((riskQues) => {
              this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
            });
          }
        });
      } else {
        this.loaderService.hideLoader();
      }
    });

  }
  // setComprehensiveSummary
  setComprehensiveSummary(routerEnabled: boolean, routerUrlPath: any) {
    if (routerEnabled) {
      this.loaderService.showLoader({ title: this.fetchData });
    } else {
      this.isLoadComplete = false;
    }
    this.comprehensivePlanning = 4;
    this.comprehensiveApiService.getComprehensiveSummary(this.getCurrentVersionType).subscribe((summaryData: any) => {
      if (summaryData && summaryData.objectList[0]) {
        this.comprehensiveService.setComprehensiveSummary(summaryData.objectList[0]);
        this.userDetails = this.comprehensiveService.getMyProfile();
        this.getComprehensiveSummary = this.comprehensiveService.getComprehensiveSummary();
        this.islocked = this.getComprehensiveSummary.comprehensiveEnquiry !== null &&
          this.getComprehensiveSummary.comprehensiveEnquiry.isLocked;
        this.userName = this.userDetails.firstName;
        this.advisorStatus = false;
        this.reportStatus = (this.getComprehensiveSummary && this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus
          && this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus !== null && this.userDetails.nationalityStatus)
          ? this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus : null;
        if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.NEW && (this.islocked === null || !this.islocked)) {
          this.comprehensivePlanning = 3;
        } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED && !this.islocked) {
          this.comprehensivePlanning = 5;
          if (this.getComprehensiveSummary.comprehensiveEnquiry &&
            this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp) {
            this.submittedDate = this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp;
          }
        } else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
          this.comprehensivePlanning = 0;
        }
        else if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY ||
          this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.ERROR) {
          this.comprehensivePlanning = 1;
          if (this.getComprehensiveSummary.comprehensiveEnquiry &&
            this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp) {
            this.submittedDate = this.getComprehensiveSummary.comprehensiveEnquiry.reportSubmittedTimeStamp;
            this.isReportGenerated = this.getComprehensiveSummary.comprehensiveEnquiry.reportStatus;
          }
        }
        this.currentStep = (this.getComprehensiveSummary && this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted
          && this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted !== null)
          ? this.getComprehensiveSummary.comprehensiveEnquiry.stepCompleted : 0;
        if (this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED
          || this.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) {
          this.comprehensiveService.setViewableMode(true);
        } else {
          this.comprehensiveService.setViewableMode(false);
        }
        if (routerEnabled) {
          this.loaderService.hideLoader();
          this.comprehensiveService.setRiskQuestions().subscribe((riskQues) => {
            this.router.navigate([routerUrlPath]);
          });
        } else {
          this.isLoadComplete = true;
        }
      } else {
        if (routerEnabled) {
          this.loaderService.hideLoader();
          if (!this.versionTypeEnabled) {
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.ROOT]);
          } else {
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED]);
          }
        } else {
          this.isLoadComplete = true;
        }
      }
    });
  }

  /// goToCurrentStep
  goToCurrentStep() {
    if (this.currentStep === 0 && this.getComprehensiveSummaryDashboard.isDobUpdated) {
      this.goToEditProfile();
    } else if (this.currentStep >= 0 && this.currentStep < 4) {
      const routerURL = COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep + 1);
      this.setComprehensiveSummary(true, routerURL);
    } else if (this.currentStep === 4) {
      const routerURL = COMPREHENSIVE_ROUTE_PATHS.STEPS + '/' + (this.currentStep);
      this.setComprehensiveSummary(true, routerURL);
    }
  }

  // goToEditProfile
  goToEditProfile() {
    if (this.comprehensivePlanning === 4 && !this.versionTypeEnabled && !this.promoCodeValidated) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.ROOT]);
    } else {
      this.setComprehensiveSummary(true, COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED);
    }
  }

  // REDIRECT TO COMPREHENSIVE 
  redirectScreen() {
    if (this.comprehensivePlanning == 0) {
      this.goToEditComprehensivePlan(true);
    } else if (this.comprehensivePlanning === 5 || 
      this.comprehensivePlanning === 1 || this.comprehensivePlanning === 2) {
      this.goToEditComprehensivePlan(false);
    } else if (this.comprehensivePlanning === 5 || 
      (this.versionTypeEnabled && this.comprehensivePlanning === 1)) {
      this.goToEditComprehensivePlan(false)
    } else if (this.comprehensivePlanning === 3) {
      this.goToCurrentStep();
    } else if (this.comprehensivePlanning === 4) {
      this.goToEditProfile();
    }  else if((this.comprehensivePlanning === 1 || this.comprehensivePlanning === 2) || this.paymentInstructions){
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);     
    } else  {
      console.log("need to confirm");
       // this.setComprehensivePlan(false);
    }
  }


   // INSURANCE 
   getInsurance(){
    this.guideMeApiService.getCustomerInsuranceDetails().subscribe((data) => {
      this.showInsuranceSection = true;
      if (data.responseMessage && data.responseMessage.responseCode === 6000) {
        this.insurance.hasInsurance = true;
        this.insurance.isGuidedJourney = data.objectList[0].financialStatusMapping !== null;
		const lastTransact = new Date(data.objectList[0].lastEnquiredDate.split(' ')[0]);
		this.insurance.lastTransactionDate = lastTransact;
        if (!this.guideMeService.checkGuidedDataLoaded() && this.insurance.isGuidedJourney) {
          this.guideMeService.convertResponseToGuideMeFormData(data.objectList[0]);
          this.insuranceRedirect()
        }
      } else if (data.responseMessage && data.responseMessage.responseCode === 5003) {
        this.selectedPlansService.setInsuranceNewUser();
        this.insurance.hasInsurance = false;
      }
    });
   }

   // redirect 
   insuranceRedirect(){
     if(this.insurance.isGuidedJourney){
    this.router.navigate([GUIDE_ME_ROUTE_PATHS.ROOT]);
     }
    this.router.navigate([DIRECT_ROUTE_PATHS.COMPARE_PLANS]);
   }
   //
}
