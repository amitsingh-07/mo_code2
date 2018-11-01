import { Component, ElementRef , OnInit , ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
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
    private translate: TranslateService) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.buildForgotPasswordForm();
    this.getEditProfileData();
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
      this.personalData = data.objectList[0].personalInformation;
      console.log(this.personalData);
      this.setFullName(this.personalData.firstName , this.personalData.lastName);
      this.setTwoLetterProfileName(this.personalData.firstName , this.personalData.lastName);
      this.setNric(this.personalData.nricNumber);
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
}
