import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ImyProfile } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { ComprehensiveApiService} from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
})
export class MyProfileComponent implements OnInit {
  nationDisabled: boolean;
  DobDisabled: boolean;
  DobBoolean: any;
  registeredUser = true;
  pageTitle: string;
  userDetails: any;
  myProfileForm: FormGroup;
  nationality = '';
  nationalityList: string;
  submitted: boolean;
  nationalityAlert = false;
  genderDisabled = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
              private configDate: NgbDatepickerConfig, private comprehensiveService: ComprehensiveService,
              private parserFormatter: NgbDateParserFormatter, private comprehensiveApiService: ComprehensiveApiService) {
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

  //  This array should be deleted after the Integration with API

    this.userDetails = {
      id: 'abc',
      firstName: 'kelvin ',
      lastName: 'NG',
      dateOfBirth: '04-05-1995',
      nation: 'Singaporean',
      gender: 'male',

    };
    this.DobDisabled = this.userDetails.dateOfBirth ? true : false;
    this.nationDisabled = this.userDetails.nation ? true : false;
    this.genderDisabled = this.userDetails.gender ? true : false;
    this.nationality = this.userDetails.nation;
    const dob = this.userDetails.dateOfBirth ? this.userDetails.dateOfBirth.split('-') : '';
    this.userDetails.gender = this.userDetails.gender ? this.userDetails.gender : '';
    // tslint:disable-next-line:radix
    this.userDetails.dateOfBirth = { year: parseInt (dob[2]), month: parseInt (dob[1]), day: parseInt (dob[0]) };

    //this.comprehensiveApiService.getPersonalDetails();
  }

  ngOnInit() {
    this.buildMyProfileForm(this.userDetails);
  }

  get myProfileControls() { return this.myProfileForm.controls; }

  buildMyProfileForm(userDetails) {
    this.myProfileForm = this.formBuilder.group({
      firstName: [userDetails.firstName ? userDetails.firstName : ''  ],
      lastName: [userDetails.lastName ? userDetails.lastName : ''],
      gender: [{ value: userDetails.gender ? userDetails.gender : '', disabled: this.genderDisabled}, [Validators.required]],
      nation: [{ value: userDetails.nation ? userDetails.nation : '' } , [Validators.required]],
      dateOfBirth: [{value : userDetails.dateOfBirth ? userDetails.dateOfBirth : '', disabled:  this.DobDisabled}, [Validators.required]],

    });
  }

  goToNext(form: FormGroup) {
    if (this.validateProfileForm(form)) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1']);
    }

  }
  selectNationality(nationality: any) {
    this.nationalityAlert = true;
    nationality = nationality ? nationality : { text: '', value: '' };
    this.nationality = nationality.text;
    this.myProfileForm.controls['nation'].setValue(nationality.value);
    this.myProfileForm.markAsDirty();
  }

  validateProfileForm(form: FormGroup) {

    form.value.dateOfBirth = this.parserFormatter.format(form.value.dateOfBirth);

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
