import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IChildEndowment } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { ConfigService } from './../../config/config.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';

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
  subscription: Subscription;
  educationPreferencePlan: any = [];
  viewMode: boolean;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService) {
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
      this.viewMode = this.comprehensiveService.getViewableMode();
    });

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }

  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });

    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        const previousUrl = this.comprehensiveService.getPreviousUrl(this.router.url);
        if (previousUrl !== null) {
          this.router.navigate([previousUrl]);
        } else {
          this.navbarService.goBack();
        }
      }
    });
    this.endowmentDetail = this.comprehensiveService.getChildEndowment();
    this.buildEducationPreferenceForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
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
    const selectionDetails = [];
    if (value.preferenceSelection) {
      selectionDetails.push(Validators.required);
    }

    return this.formBuilder.group({
      name: [value.name],
      age: [value.age],
      location: [value.location, selectionDetails],
      educationCourse: [value.educationCourse, selectionDetails],
      educationPreference: [value.preferenceSelection],
      nation: [value.nation]
    });
  }
  selectLocation(status, i) {
    const relationship = status ? status : '';
    this.EducationPreferenceForm.controls['preference']['controls'][i].controls.location.setValue(relationship);
    this.EducationPreferenceForm.controls['preference']['controls'][i].markAsDirty();

  }
  selectCourse(status, i) {
    const gender = status ? status : '';
    this.EducationPreferenceForm.controls['preference']['controls'][i].controls.educationCourse.setValue(gender);
    this.EducationPreferenceForm.controls['preference']['controls'][i].markAsDirty();
  }

  goToNext(form) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST]);
    } else {
      if (this.validateEducationPreference(form)) {
        form.value.preference.forEach((preferenceDetails: any, index) => {
          this.endowmentDetail[index].location = preferenceDetails.location;
          this.endowmentDetail[index].educationCourse = preferenceDetails.educationCourse;
        });
        if (!form.pristine) {
          this.comprehensiveApiService.saveChildEndowment({
            hasEndowments: this.comprehensiveService.hasEndowment(),
            endowmentDetailsList: this.endowmentDetail
          }).subscribe((data) => {
            this.comprehensiveService.setChildEndowment(this.endowmentDetail);
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST]);
          });
        } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST]);
        }
      }
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
