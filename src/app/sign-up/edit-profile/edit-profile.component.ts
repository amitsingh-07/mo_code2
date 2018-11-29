import { Component, ElementRef , OnInit , ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../../investment-account/investment-account.constant';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  resetPasswordForm: FormGroup;
  formValues: any;
  personalData: any;
  fullName: string;
  compinedName: string;
  compinednricNum: string;
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
  isEmployeAddresSame: boolean;
  isSingaporeResident: boolean;
  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService,
    public investmentAccountService: InvestmentAccountService,
    private translate: TranslateService) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
    });
    this.getNationalityCountryList();
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.buildForgotPasswordForm();
    this.getEditProfileData();
    this.isMailingAddressSame = true;
    this.isEmployeAddresSame = true;
  }
  showHidePassword(el) {
    if (el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
  }
  // showHide() {
  //   if ( this.anim.nativeElement.style.display === '' || this.anim.nativeElement.style.display === 'block') {
  //     this.anim.nativeElement.style.display = 'none';
  //   } else {
  //     this.anim.nativeElement.style.display = 'block';
  //   }
  // }
  showHide(el) {
    if ( el.style.display === '' || el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  buildForgotPasswordForm() {
    this.formValues = this.signUpService.getForgotPasswordInfo();
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: [this.formValues.oldPassword, [Validators.required,  Validators.pattern(RegexConstants.Password.Full)]],
      newPassword: [this.formValues.oldPassword, [Validators.required,  Validators.pattern(RegexConstants.Password.Full)]],
      confirmPassword: [this.formValues.oldPassword, [Validators.required,  Validators.pattern(RegexConstants.Password.Full)]]
    });
  }
  getEditProfileData() {
    this.signUpService.getEditProfileInfo().subscribe((data) => {
      // tslint:disable-next-line:triple-equals
      console.log(data);
      this.entireUserData = data.objectList[0];
      this.personalData = data.objectList[0].personalInformation;
      if ( data.objectList[0].contactDetails) {
      this.residentialAddress = data.objectList[0].contactDetails.homeAddress;
      }
      this.empolymentDetails = data.objectList[0].employmentDetails;
      this.bankDetails = data.objectList[0].bankDetails;
      if ( data.objectList[0].contactDetails.mailingAddress) {
      this.mailingAddress = data.objectList[0].contactDetails.mailingAddress;
      this.isMailingAddressSame = false;
      }
      this.contactDetails = data.objectList[0].contactDetails;
      console.log(this.personalData);
      this.setFullName(this.personalData.firstName , this.personalData.lastName);
      this.setTwoLetterProfileName(this.personalData.firstName , this.personalData.lastName);
      this.setNric(this.personalData.nricNumber);
      if ( this.personalData) {
        this.isSingaporeResident = this.personalData.isSingaporeResident;
        }
      if ( this.empolymentDetails.employerDetails.employerAddress) {
        this.isEmployeAddresSame = false;
        this.employerAddress = this.empolymentDetails.employerDetails.employerAddress ;
      // tslint:disable-next-line:max-line-length
        this.setEmployerAddress(this.empolymentDetails.employerDetails.employerAddress.addressLine1 , this.empolymentDetails.employerDetails.employerAddress.addressLine2);
      // tslint:disable-next-line:max-line-length
      // this.setMailingAddres(this.empolymentDetails.employerDetails.employerAddress.addressLine1 , this.empolymentDetails.employerDetails.employerAddress.addressLine2);
      }
    });
  }
  setFullName(firstName, LastName) {
this.fullName = firstName + ' ' + LastName ;
  }
  setTwoLetterProfileName(firstName, LastName) {
    const first = firstName.charAt(0);
    const second = LastName.charAt(0);
    this.compinedName = first.toUpperCase() + second.toUpperCase() ;
  }
  setNric(nric) {
this.compinednricNum = 'NRIC Number:' + nric;
  }
  setAddres(address1 , address2) {
this.compinedAddress = address1 + ' ' + address2;
  }
  setMailingAddres(address1 , address2) {
    this.compinedMailingAddress = address1 + ' ' + address2;
      }
  setEmployerAddress(address1 , address2) {
this.compinedEmployerAddress = address1 + ' ' + address2;
  }
  editEmployeDetails() {
    // tslint:disable-next-line:max-line-length
    this.investmentAccountService.setEditProfileEmployeInfo(this.entireUserData , this.nationalityList, this.countryList, this.isEmployeAddresSame , this.isSingaporeResident );
    // tslint:disable-next-line:max-line-length
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS], {queryParams: {enableEditProfile: true}, fragment: 'loading'});
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
            this.countryList = this.getCountryList(data.objectList);
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
  editContactDetails() {
    // tslint:disable-next-line:max-line-length
    this.investmentAccountService.setEditProfileContactInfo(this.entireUserData, this.nationalityList, this.countryList , this.isMailingAddressSame , this.isSingaporeResident);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_RESIDENTIAL]);
  }
  editBankDetails() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_BANK], {queryParams: {addBank: false}, fragment: 'bank'});
  }
  addBankDetails() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.UPDATE_BANK], {queryParams: {addBank: true}, fragment: 'bank'});
  }
}
