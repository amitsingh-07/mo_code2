import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
@Component({
  selector: 'app-education-preference',
  templateUrl: './education-preference.component.html',
  styleUrls: ['./education-preference.component.scss']
})
export class EducationPreferenceComponent implements OnInit {

  pageTitle: string;
  EducationPreferenceForm: FormGroup;
  educationPreferenceArray: any;
  educationPreferencePlan: any = [];
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('DEPENDANT_EDUCATION.TITLE');

      this.setPageTitle(this.pageTitle);
    });

    this.educationPreferenceArray = [{
      name: 'Nathan Ng',
      age: '2',
      location: '',
      course_of_study: '',
      nationality: ''

    },
    {
      name: 'Marie Ng',
      age: '2',
      location: '',
      course_of_study: '',
      nationality: ''

    }];
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.buildEducationPreferenceForm(this.educationPreferenceArray);
  }
  buildEducationPreferenceForm(educationPreferenceList) {
    const preferenceArray = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < educationPreferenceList.length; i++) {
      preferenceArray.push(this.buildPreferenceDetailsForm(educationPreferenceList[i]));
    }
    this.EducationPreferenceForm = this.formBuilder.group({
      preference: this.formBuilder.array(preferenceArray),

    });

  }
  buildPreferenceDetailsForm(value): FormGroup {

    return this.formBuilder.group({
      name: [value.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      age: [value.age, [Validators.required]],
      location: ['', [Validators.required]],
      course_of_study: ['', [Validators.required]]

    });

  }
  goToNext(form) {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST]);
  }
}
