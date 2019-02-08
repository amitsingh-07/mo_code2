import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ImyProfile } from '../comprehensive-types';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveService } from './../comprehensive.service';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
})
export class MyProfileComponent implements OnInit {
  registeredUser = true;
  pageTitle: string;
  userDetails: ImyProfile;
  myProfileForm: FormGroup;
  nationality = '';
  nationalityList: string;
  submitted: boolean;

  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
              private configDate: NgbDatepickerConfig, private comprehensiveService: ComprehensiveService,
              private parserFormatter: NgbDateParserFormatter) {

    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');
      this.nationalityList = this.translate.instant('NATIONALITY');
      this.setPageTitle(this.pageTitle);
    });
    const today: Date = new Date();
    configDate.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.outsideDays = 'collapsed';

    this.userDetails = {
      name: 'kelvin NG',
      gender: 'male',
      dob: {day: 4 , month: 5, year: 1995},
      nationality: 'Singaporean',
      registeredUser: false

    };
    this.registeredUser = this.userDetails.registeredUser;
    this.nationality = this.userDetails.nationality;
    this.userDetails.gender = this.userDetails.gender ? this.userDetails.gender : 'male';

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {

    this.buildMyProfileForm(this.userDetails);
  }
  get myProfile() { return this.myProfileForm.controls; }

  buildMyProfileForm(userDetails) {
    this.myProfileForm = this.formBuilder.group({
      name: [userDetails.name],
      gender: [userDetails.gender, [Validators.required]],
      nationality: [userDetails.nationality, [Validators.required]],
      dob: [userDetails.dob, [Validators.required]],

    });
  }
  goToNext(form) {
    if (this.validateProfileForm(form)) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION]);
    }

  }
  selectNationality(nationality) {
    nationality = nationality ? nationality : { text: '', value: '' };
    this.nationality = nationality.text;
    this.myProfileForm.controls['nationality'].setValue(nationality.value);
    this.myProfileForm.markAsDirty();
  }

  validateProfileForm(form: any) {

    form.value.customDob = this.parserFormatter.format(form.value.dob);
    const today: Date = new Date();

    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, 'myProfileForm');
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false, 'My Profile');
      return false;
    } else if ((today.getFullYear() - form.value.dob.year) > 55) {
       return false;
    }
    return true;
  }
}
