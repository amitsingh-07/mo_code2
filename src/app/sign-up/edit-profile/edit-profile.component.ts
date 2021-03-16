import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InvestmentCommonService } from './../../investment/investment-common/investment-common.service';

import { CustomErrorHandlerService } from './../../shared/http/custom-error-handler.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment/investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SrsSuccessModalComponent } from '../add-update-srs/srs-success-modal/srs-success-modal.component';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { environment } from './../../../environments/environment';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { FooterService } from './../../shared/footer/footer.service';
import { SessionsService } from './../../shared/Services/sessions/sessions.service';

import { ActivateSingpassModalComponent } from './activate-singpass-modal/activate-singpass-modal.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditProfileComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  formValues: any;
  personalData: any;
  fullName: string;
  compinedName: string;
  residentialAddress: any;
  empolymentDetails: any;
  bankDetails: any;
  mailingAddress: any;
  contactDetails: any;
  employerAddress: any;
  entireUserData: any;
  nationalityList: any;
  countryList: any;
  isMailingAddressSame: boolean;
  isSingaporeResident: boolean;
  hiddenAccountNum: any;
  resNationality: any;
  mailNationality: any;
  employerNationality: any;
  pageTitle: any;
  investmentStatus: string;
  showBankInfo = false;
  dobFormat: any;
  private subscription: Subscription;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  srsDetails;
  formatedAccountNumber;
  is2faAuthorized: boolean;
  disableBankSrsEdit = false;
  linkCatagories;

  constructor(
    private modal: NgbModal,
    private footerService: FooterService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private investmentCommonService: InvestmentCommonService,
    private signUpService: SignUpService,
    private router: Router,
    public authService: AuthenticationService,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    public readonly translate: TranslateService,
    private loaderService: LoaderService,
    private configService: ConfigService,
    private customErrorHandler: CustomErrorHandlerService,
    private sessionsService: SessionsService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('EDIT_PROFILE.MY_PROFILE');
      this.setPageTitle(this.pageTitle);
      this.showSRSSuccessModel();
    });

    // Hidden Country list for future use
    // this.getNationalityCountryList();

    this.authService.get2faAuthEvent.subscribe((token) => {
      if (token) {
        this.is2faAuthorized = true;
      } else {
        this.is2faAuthorized = false;
      }
    });
  }

  ngOnInit() {
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(104);
    } else {
      this.navbarService.setNavbarMode(102);
    }
    this.setPageTitle(this.pageTitle);
    this.footerService.setFooterVisibility(false);
    this.headerSubscription();
    this.investmentStatus = this.investmentCommonService.getInvestmentStatus();

    this.authService.get2faUpdateEvent.subscribe(() => {
      this.getEditProfileData();
      this.getSrsDetails();
    });
    this.isMailingAddressSame = true;

    // Check if iFast is in maintenance
    this.configService.getConfig().subscribe((config) => {
      if (config.iFastMaintenance && this.configService.checkIFastStatus(config.maintenanceStartTime, config.maintenanceEndTime)) {
        this.disableBankSrsEdit = true;
      }
    });

    this.translate.get('ERROR').subscribe((results) => {
      this.authService.get2faErrorEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
          if (data) {
            this.authService.openErrorModal(
              results.SESSION_2FA_EXPIRED.TITLE,
              results.SESSION_2FA_EXPIRED.SUB_TITLE,
              results.SESSION_2FA_EXPIRED.BUTTON
            );
          }
        });
    });

    this.linkCatagories = SIGN_UP_CONFIG.SINGPASSLINKSTATUS;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.navbarService.unsubscribeBackPress();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  showHide(el) {
    if (el.style.display === '' || el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }

  // tslint:disable-next-line:cognitive-complexity
  getEditProfileData() {
    this.signUpService.getEditProfileInfo().subscribe((data) => {
      const responseMessage = data.responseMessage;
      if (responseMessage.responseCode === 6000) {
        this.entireUserData = data.objectList;
        if (data.objectList) {
          if (data.objectList.personalInformation) {
            this.personalData = data.objectList.personalInformation;
          }
          // Hidden Residential address
          // if (data.objectList && data.objectList.contactDetails && data.objectList.contactDetails.homeAddress) {
          //   this.residentialAddress = data.objectList.contactDetails.homeAddress;
          // }
          // Hidden the Employment details
          // this.empolymentDetails = data.objectList.employmentDetails;
          this.empolymentDetails = null;

          if (data.objectList.customerBankDetail) {
            this.bankDetails = data.objectList.customerBankDetail[0];
          }
          this.showBankInfo = data.objectList.cashPortfolioAvailable ? data.objectList.cashPortfolioAvailable : false;

          // Hidden the mailing address for future use
          // if ((data.objectList.contactDetails && data.objectList.contactDetails.mailingAddress)) {
          //   this.mailingAddress = data.objectList.contactDetails.mailingAddress;
          //   this.isMailingAddressSame = false;
          // }

          if (data.objectList.contactDetails) {
            this.contactDetails = data.objectList.contactDetails;
          }
          if (this.personalData) {
            this.fullName = this.personalData.fullName ?
              this.personalData.fullName : this.personalData.firstName + ' ' + this.personalData.lastName;
            this.compinedName = this.setTwoLetterProfileName(this.personalData.firstName, this.personalData.lastName);
            // Hidden passport details for future use
            // this.compinednricNum = this.setNric(this.personalData.nricNumber);
            // Hidden the passport details
            // if (this.personalData.passportNumber) {
            //   this.compinedPassport = 'Passport: ' + this.personalData.passportNumber;
            // }
            // if (this.personalData && this.personalData.isSingaporeResident) {
            //   this.isSingaporeResident = this.personalData.isSingaporeResident;
            // }
            this.constructDate(this.personalData.dateOfBirth);
          }
        }
        // Hidden employer address for future use
        // // tslint:disable-next-line:max-line-length
        // if (this.empolymentDetails && this.empolymentDetails.employerDetails && this.empolymentDetails.employerDetails.detailedemployerAddress) {
        //   this.employerAddress = this.empolymentDetails.employerDetails.detailedemployerAddress;
        // }
        // if (this.residentialAddress && this.residentialAddress.country && this.residentialAddress.country.nationalityCode) {
        //   this.resNationality = this.residentialAddress.country.nationalityCode;
        // }
        // if (this.mailingAddress && this.mailingAddress.country && this.mailingAddress.country.nationalityCode) {
        //   this.mailNationality = this.mailingAddress.country.nationalityCode;
        // }
        // // tslint:disable-next-line:max-line-length
        // if (this.empolymentDetails && this.empolymentDetails.employerDetails && this.empolymentDetails.employerDetails.detailedemployerAddress && this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress && this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress.country && this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress.country.nationalityCode) {
        //   this.employerNationality = this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress.country.nationalityCode;
        // }
      } else { // catch exceptions
        if (responseMessage.responseCode === 5015) {
          this.sessionsService.destroyInstance();
          this.authService.clearSession();
          this.sessionsService.createNewActiveInstance();
          this.navbarService.logoutUser();
          this.customErrorHandler.handleAuthError();
        }
      }
    });
  }

  editEmployeDetails() {
    // tslint:disable-next-line:max-line-length
    this.investmentAccountService.setEditProfileEmployeInfo(this.entireUserData, this.nationalityList, this.countryList, this.isSingaporeResident);
    // tslint:disable-next-line:max-line-length
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS], { queryParams: { enableEditProfile: true }, fragment: 'loading' });
  }

  editUserDetails() {
    this.signUpService.setOldContactDetails(this.personalData.countryCode, this.personalData.mobileNumber, this.personalData.email);
    this.authService.set2faVerifyAllowed(true);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_USER_ID]);
  }

  editPassword() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PASSWORD]);
  }

  getNationalityCountryList() {
    this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
      this.nationalityList = data.objectList;
      this.countryList = this.investmentAccountService.getCountryList(data.objectList);
    });
  }

  editContactDetails() {
    let uploadedDocuments = [];
    let mailingUrl;
    let ResUrl;
    if (this.entireUserData.documentDetails) {
      uploadedDocuments = this.entireUserData.documentDetails;
    }
    let i;
    for (i = 0; i < uploadedDocuments.length; i++) {
      if (uploadedDocuments[i].docType === 'MAILING_ADDRESS_PROOF') {
        mailingUrl = uploadedDocuments[i].fileName;
      }
      if (uploadedDocuments[i].docType === 'RESIDENTIAL_ADDRESS_PROOF') {
        ResUrl = uploadedDocuments[i].fileName;
      }
    }
    // tslint:disable-next-line:max-line-length
    this.investmentAccountService.setEditProfileContactInfo(this.entireUserData, this.nationalityList, this.countryList, this.isMailingAddressSame, this.isSingaporeResident, mailingUrl, ResUrl);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_RESIDENTIAL]);
  }

  isCountrySIngapore(nationalityCode) {
    return nationalityCode === 'SG';
  }

  editBankDetails() {
    let AccountHolderName;
    if (this.bankDetails && this.bankDetails.accountName) {
      AccountHolderName = this.bankDetails.accountName;
    } else {
      AccountHolderName = this.fullName;
    }
    this.signUpService.setOldContactDetails(this.personalData.countryCode, this.personalData.mobileNumber, this.personalData.email);
    // tslint:disable-next-line:max-line-length accountName
    this.investmentAccountService.setEditProfileBankDetail(AccountHolderName, this.bankDetails.bank, this.bankDetails.accountNumber, this.bankDetails.id, false);
    this.authService.set2faVerifyAllowed(true);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_BANK], { queryParams: { addBank: false }, fragment: 'bank' });
  }

  addBankDetails() {
    let AccountHolderName;
    if (this.bankDetails && this.bankDetails.accountName) {
      AccountHolderName = this.bankDetails.accountName;
    } else {
      AccountHolderName = this.fullName;
    }
    this.signUpService.setOldContactDetails(this.personalData.countryCode, this.personalData.mobileNumber, this.personalData.email);
    this.investmentAccountService.setEditProfileBankDetail(AccountHolderName, null, null, null, true);
    this.authService.set2faVerifyAllowed(true);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_BANK], { queryParams: { addBank: true }, fragment: 'bank' });
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      }
    });
  }

  constructDate(dob) {
    this.dobFormat = dob;
    if (dob) {
      const dateArr = dob.split('/');
      if (dateArr.length === 3) {
        this.dobFormat = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
      }
    }
  }

  updateSrsDetails(srsAccountNumber, srsBankOperator, customerId, srsBankFlag) {
    this.signUpService.setOldContactDetails(this.personalData.countryCode, this.personalData.mobileNumber, this.personalData.email);
    this.signUpService.setEditProfileSrsDetails(srsAccountNumber, srsBankOperator, customerId);
    this.authService.set2faVerifyAllowed(true);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_SRS], { queryParams: { srsBank: srsBankFlag }, fragment: 'bank' });
  }

  getSrsDetails() {
    this.manageInvestmentsService.getProfileSrsAccountDetails()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data) {
          this.srsDetails = data;
        }
      },
        () => {
          this.investmentAccountService.showGenericErrorModal();
        });
  }

  getInvestmentOverview() {
    this.translate.get('COMMON').subscribe(() => {
      this.loaderService.showLoader({
        title: this.translate.instant('COMMON.LOADING_TITLE'),
        desc: this.translate.instant('COMMON.LOADING_DESC'),
        autoHide: false
      });
    });
    this.manageInvestmentsService.getInvestmentOverview()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.loaderService.hideLoaderForced();
        if (data.responseMessage.responseCode >= 6000 && data && data.objectList) {
          this.manageInvestmentsService.setUserPortfolioList(data.objectList.portfolios);
          this.router.navigate([SIGN_UP_ROUTE_PATHS.TOPUP]);
        }
      }, () => {
        this.loaderService.hideLoaderForced();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  showSRSSuccessModel() {
    if (this.manageInvestmentsService.getSrsSuccessFlag()) {
      const ref = this.modal.open(SrsSuccessModalComponent, { centered: true });
      ref.componentInstance.topUp.subscribe(() => {
        this.getInvestmentOverview();
      });
      this.manageInvestmentsService.setSrsSuccessFlag(false);
    }
  }

  setTwoLetterProfileName(firstName, LastName) {
    const first = firstName.charAt(0);
    const second = LastName.charAt(0);
    return first.toUpperCase() + second.toUpperCase();
  }
  linkSingpass() {
    const ref = this.modal.open(ActivateSingpassModalComponent, { centered: true, windowClass: 'activate-singpass-modal' });
    ref.componentInstance.errorMessage = this.translate.instant(
      'ACTIVATE_SINGPASS_MODAL.MESSAGE'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'ACTIVATE_SINGPASS_MODAL.BTN_TXT'
    );
  }
}
