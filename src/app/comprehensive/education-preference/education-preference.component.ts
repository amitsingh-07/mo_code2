import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IChildEndowment } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { AboutAge } from './../../shared/utils/about-age.util';
@Component({
  selector: 'app-education-preference',
  templateUrl: './education-preference.component.html',
  styleUrls: ['./education-preference.component.scss']
})
export class EducationPreferenceComponent implements OnInit, OnDestroy {

  endowmentDetail: IChildEndowment[];
  submitted = false;
  courseList: any;
  locationList: any;
  pageId: string;
  pageTitle: string;
  EducationPreferenceForm: FormGroup;
  menuClickSubscription: Subscription;
  educationPreferencePlan: any = [];
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
              private comprehensiveService: ComprehensiveService, private aboutAge: AboutAge) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.locationList = this.translate.instant('CMP.LOCATION_LIST');
        this.courseList = this.translate.instant('CMP.COURSE_LIST');
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);

      });
    });

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {

      }
    });
    this.endowmentDetail = this.comprehensiveService.getChildEndowment();
    console.log(this.endowmentDetail);
    this.buildEducationPreferenceForm();
  }

  buildEducationPreferenceForm() {
    const preferenceArray = [];
    this.endowmentDetail.forEach((educationDetailsList: any) => {
      preferenceArray.push(this.buildPreferenceDetailsForm(educationDetailsList));
    });
    this.EducationPreferenceForm = this.formBuilder.group({
      preference: this.formBuilder.array(preferenceArray),

    });

  }
  buildPreferenceDetailsForm(value): FormGroup {
    return this.formBuilder.group({
      name: [value.name],
      age: [value.age],
      location: [value.location, [Validators.required]],
      educationCourse: [value.educationCourse, [Validators.required]]

    });

  }
  selectLocation(status, i) {
    const relationship = status ? status : '';
    this.EducationPreferenceForm.controls['preference']['controls'][i].controls.location.setValue(relationship);

  }
  selectCourse(status, i) {
    const gender = status ? status : '';
    this.EducationPreferenceForm.controls['preference']['controls'][i].controls.educationCourse.setValue(gender);
  }

  goToNext(form) {
    if (this.validateEducationPreference(form)) {
      form.value.preference.forEach((preferenceDetails: any, index) => {
        this.endowmentDetail[index].location = preferenceDetails.location;
        this.endowmentDetail[index].educationCourse = preferenceDetails.educationCourse;
      });
      this.comprehensiveService.setChildEndowment(this.endowmentDetail);
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST]);

    }

  }
  validateEducationPreference(form) {
    this.submitted = true;
    if (!form.valid) {
      const error = this.comprehensiveService.getMultipleFormError(form, COMPREHENSIVE_FORM_CONSTANTS.educationPreferenceForm,
        this.endowmentDetail);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, true,
      );
      return false;
    }
    return true;
  }
}
