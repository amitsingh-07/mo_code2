import { Component, OnDestroy, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { InvestmentCommonService } from './../../investment/investment-common/investment-common.service';

import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment/investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SrsSuccessModalComponent } from '../add-update-srs/srs-success-modal/srs-success-modal.component';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { environment } from './../../../environments/environment';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { FooterService } from './../../shared/footer/footer.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  resetPasswordForm: FormGroup;
  formValues: any;
  personalData: any;
  fullName: string;
  compinedName: string;
  compinednricNum: string;
  compinedPassport: string;
  residentialAddress: any;
  compinedAddress: string;
  compinedMailingAddress: string;
  empolymentDetails: any;
  compinedEmployerAddress: any;
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
  showAddbank = false;
  dobFormat: any;
  private subscription: Subscription;
  srsDetails;
  formatedAccountNumber;
  fundTypeId: number;
  is2faAuthorized: boolean;

  disableBankSrsEdit = false;

  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private footerService: FooterService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private investmentCommonService: InvestmentCommonService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    public readonly translate: TranslateService,
    private loaderService: LoaderService,
    private configService: ConfigService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('EDIT_PROFILE.MY_PROFILE');
      this.setPageTitle(this.pageTitle);
      this.showSRSSuccessModel();
    });
    this.getNationalityCountryList();
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
    this.buildForgotPasswordForm();
    this.isMailingAddressSame = true;
    this.investmentStatus = this.investmentCommonService.getInvestmentStatus();
    // Check if iFast is in maintenance
    this.configService.getConfig().subscribe((config) => {
      if (config.iFastMaintenance && this.configService.checkIFastStatus(config.maintenanceStartTime, config.maintenanceEndTime)) {
        this.disableBankSrsEdit = true;
      }
    });

    this.authService.get2faAuthEvent.subscribe((token) => {
      // console.log('2fa event triggered:', token);
      if (token) {
        this.is2faAuthorized = true;
      } else {
        this.is2faAuthorized = false;
      }
      this.getEditProfileData();
      this.showAddBankDetails(this.investmentStatus);
      this.getSrsDetails();
      // console.log('is2faAuthorized', this.is2faAuthorized);
    });
  }

  ngAfterViewInit() {

  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  showAddBankDetails(investmentStatus) {
    if (SIGN_UP_CONFIG.SHOW_BANK_DETAILS.indexOf(investmentStatus) >= 0) {
      this.showAddbank = true;
    }
  }

  showHidePassword(el) {
    if (el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
  }

  showHide(el) {
    if (el.style.display === '' || el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }

  buildForgotPasswordForm() {
    this.formValues = this.signUpService.getForgotPasswordInfo();
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: [this.formValues.oldPassword, [Validators.required, Validators.pattern(RegexConstants.Password.Full)]],
      newPassword: [this.formValues.oldPassword, [Validators.required, Validators.pattern(RegexConstants.Password.Full)]],
      confirmPassword: [this.formValues.oldPassword, [Validators.required, Validators.pattern(RegexConstants.Password.Full)]]
    });
  }

  // tslint:disable-next-line:cognitive-complexity
  getEditProfileData() {
    this.signUpService.getEditProfileInfo().subscribe((data) => {
      console.log('editprofileInfoCall',data);
      this.entireUserData = data.objectList;
      if (data.objectList) {
        if (data.objectList.personalInformation) {
          this.personalData = data.objectList.personalInformation;
        }
        if (data.objectList && data.objectList.contactDetails && data.objectList.contactDetails.homeAddress) {
          this.residentialAddress = data.objectList.contactDetails.homeAddress;
        }
        // Hidden the Employment details
        // this.empolymentDetails = data.objectList.employmentDetails;
        this.empolymentDetails = null;
        if (data.objectList.customerBankDetail) {
          this.bankDetails = data.objectList.customerBankDetail[0];
        }
        if ((data.objectList.contactDetails && data.objectList.contactDetails.mailingAddress)) {
          this.mailingAddress = data.objectList.contactDetails.mailingAddress;
          this.isMailingAddressSame = false;
        }
        if (data.objectList.contactDetails) {
          this.contactDetails = data.objectList.contactDetails;
        }
        if (this.personalData) {
          this.fullName = this.personalData.fullName ?
          this.personalData.fullName : this.personalData.firstName + ' ' + this.personalData.lastName;
          this.compinedName = this.setTwoLetterProfileName(this.personalData.firstName, this.personalData.lastName);
          this.compinednricNum = this.setNric(this.personalData.nricNumber);
          if (this.personalData.passportNumber) {
            this.compinedPassport = 'Passport: ' + this.personalData.passportNumber;
          }
          if (this.personalData && this.personalData.isSingaporeResident) {
            this.isSingaporeResident = this.personalData.isSingaporeResident;
          }
          this.constructDate(this.personalData.dateOfBirth);
        }
      }
      // tslint:disable-next-line:max-line-length
      if (this.empolymentDetails && this.empolymentDetails.employerDetails && this.empolymentDetails.employerDetails.detailedemployerAddress) {
        this.employerAddress = this.empolymentDetails.employerDetails.detailedemployerAddress;
      }
      if (this.residentialAddress && this.residentialAddress.country && this.residentialAddress.country.nationalityCode) {
        this.resNationality = this.residentialAddress.country.nationalityCode;
      }
      if (this.mailingAddress && this.mailingAddress.country && this.mailingAddress.country.nationalityCode) {
        this.mailNationality = this.mailingAddress.country.nationalityCode;
      }
      // tslint:disable-next-line:max-line-length
      if (this.empolymentDetails && this.empolymentDetails.employerDetails && this.empolymentDetails.employerDetails.detailedemployerAddress && this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress && this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress.country && this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress.country.nationalityCode) {
        this.employerNationality = this.empolymentDetails.employerDetails.detailedemployerAddress.employerAddress.country.nationalityCode;
      }
    });
  }

  createMaskString(val) {
    let i;
    let maskedStr = '';
    for (i = 0; i < val; i++) {
      maskedStr = maskedStr + '*';
    }
    return maskedStr;
  }

  setAddres(address1, address2) {
    this.compinedAddress = address1 + ' ' + address2;
  }

  setMailingAddres(address1, address2) {
    this.compinedMailingAddress = address1 + ' ' + address2;
  }

  setEmployerAddress(address1, address2) {
    this.compinedEmployerAddress = address1 + ' ' + address2;
  }

  editEmployeDetails() {
    // tslint:disable-next-line:max-line-length
    this.investmentAccountService.setEditProfileEmployeInfo(this.entireUserData, this.nationalityList, this.countryList, this.isSingaporeResident);
    // tslint:disable-next-line:max-line-length
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS], { queryParams: { enableEditProfile: true }, fragment: 'loading' });
  }

  editUserDetails() {
    this.signUpService.setOldContactDetails(this.personalData.countryCode, this.personalData.mobileNumber, this.personalData.email);
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
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_BANK], { queryParams: { addBank: false }, fragment: 'bank' });
  }

  addBankDetails() {
    let AccountHolderName;
    if (this.bankDetails && this.bankDetails.accountName) {
      AccountHolderName = this.bankDetails.accountName;
    } else {
      AccountHolderName = this.fullName;
    }
    this.investmentAccountService.setEditProfileBankDetail(AccountHolderName, null, null, null, true);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_BANK], { queryParams: { addBank: true }, fragment: 'bank' });
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
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
    this.signUpService.setEditProfileSrsDetails(srsAccountNumber, srsBankOperator, customerId, this.fundTypeId);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_SRS], { queryParams: { srsBank: srsBankFlag }, fragment: 'bank' });
  }

  getSrsDetails() {
    this.manageInvestmentsService.getSrsAccountDetails().subscribe((data) => {
      if (data) {
        this.srsDetails = data;
        this.getInvestmentOverview();
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  getInvestmentOverview() {
    this.translate.get('COMMON').subscribe((result: string) => {
      this.loaderService.showLoader({
        title: this.translate.instant('COMMON.LOADING_TITLE'),
        desc: this.translate.instant('COMMON.LOADING_DESC'),
        autoHide: false
      });
    });
    this.manageInvestmentsService.getInvestmentOverview().subscribe((data) => {
      this.loaderService.hideLoaderForced();
      if (data.responseMessage.responseCode >= 6000 && data && data.objectList) {
        this.manageInvestmentsService.setUserPortfolioList(data.objectList.portfolios);
        this.fundTypeId = this.getFundTypeId(data.objectList.portfolios)
      }
    },
      (err) => {
        this.loaderService.hideLoaderForced();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  getFundTypeId(protfolios) {
    for (const obj of protfolios) {
      if (obj['fundingTypeValue'] === 'SRS') {
        return obj['fundingTypeId'];
      }
    }
  }

  showSRSSuccessModel() {
    if (this.manageInvestmentsService.getSrsSuccessFlag()) {
      const ref = this.modal.open(SrsSuccessModalComponent, { centered: true });
      ref.componentInstance.topUp.subscribe(() => {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.TOPUP]);
      });
      this.manageInvestmentsService.setSrsSuccessFlag(false)
    }
  }

  setTwoLetterProfileName(firstName, LastName) {
    const first = firstName.charAt(0);
    const second = LastName.charAt(0);
    return first.toUpperCase() + second.toUpperCase();
  }

  setNric(nric) {
    return 'NRIC Number: ' + nric;
  }
}
