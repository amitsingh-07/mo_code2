import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ImyProfile } from '../comprehensive-types';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
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

  constructor(private route: ActivatedRoute, private router: Router,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
              private configDate: NgbDatepickerConfig, private comprehensiveService: ComprehensiveService,
              private parserFormatter: NgbDateParserFormatter) {
    const today: Date = new Date();
    configDate.minDate = { year: (today.getFullYear() - 55), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.outsideDays = 'collapsed';
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');
        this.nationalityList = this.translate.instant('NATIONALITY');
      });
    });

    // This array should be deleted after the Integration with API
    this.userDetails = {
      name: 'kelvin NG',
      gender: 'male',
      dob: '',
      nationality: '',
      registeredUser: false

    };
    this.registeredUser = this.userDetails.registeredUser;
    this.nationality = this.userDetails.nationality;
    this.userDetails.gender = this.userDetails.gender ? this.userDetails.gender : 'male';

  }

  ngOnInit() {
    this.buildMyProfileForm(this.userDetails);
  }

  get myProfileControls() { return this.myProfileForm.controls; }

  buildMyProfileForm(userDetails) {
    this.myProfileForm = this.formBuilder.group({
      name: [userDetails.name],
      gender: [userDetails.gender, [Validators.required]],
      nationality: [userDetails.nationality, [Validators.required]],
      dob: [userDetails.dob, [Validators.required]],

    });
  }

  goToNext(form: FormGroup) {
    if (this.validateProfileForm(form)) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION]);
    }

  }
  selectNationality(nationality: any) {
    nationality = nationality ? nationality : { text: '', value: '' };
    this.nationality = nationality.text;
    this.myProfileForm.controls['nationality'].setValue(nationality.value);
    this.myProfileForm.markAsDirty();
  }

  validateProfileForm(form: FormGroup) {

    form.value.customDob = this.parserFormatter.format(form.value.dob);

    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_PROFILE);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('ERROR_MODAL_TITLE.MY_PROFILE'));
      return false;
    }
    return true;
  }
}
