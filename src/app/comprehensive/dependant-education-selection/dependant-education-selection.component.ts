import { Component, HostListener, OnDestroy, OnInit, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import {  IChildEndowment, IComprehensiveEnquiry, IMySummaryModal } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { AboutAge } from './../../shared/utils/about-age.util';

@Component({
  selector: 'app-dependant-education-selection',
  templateUrl: './dependant-education-selection.component.html',
  styleUrls: ['./dependant-education-selection.component.scss']
})
export class DependantEducationSelectionComponent implements OnInit, OnDestroy {

  hasEndowments: string;
  endowmentDetail: IChildEndowment[];
  dependantDetails: any;
  education_plan_selection = false;
  pageId: string;
  pageTitle: string;
  dependantEducationSelectionForm: FormGroup;
  dependantsArray: any;
  educationPreference = true;
  menuClickSubscription: Subscription;
  summaryModalDetails: IMySummaryModal;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder,
              private configService: ConfigService, private comprehensiveService: ComprehensiveService, private aboutAge: AboutAge) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);

      });
    });
    this.dependantSelection();
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
    this.buildEducationSelectionForm();
  }

  dependantSelection() {

    this.hasEndowments = this.comprehensiveService.hasEndowment();
    this.endowmentDetail = this.comprehensiveService.getChildEndowment();
    if ( this.endowmentDetail.length > 0) {
      this.dependantsArray = this.endowmentDetail;
    } else {
      this.dependantsArray = [];
      const dependantDetails = this.comprehensiveService.getMyDependant();
      dependantDetails.forEach((dependant: any) => {
        if (dependant.relationship.toLowerCase() === 'child' || dependant.relationship.toLowerCase() === 'sibling') {
          this.dependantsArray.push(dependant);
        }
      });
    }
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.checkDependant();
  }

  checkDependant() {

    this.dependantEducationSelectionForm.valueChanges.subscribe((form: any) => {
      form.hasEndowments === '0' ? this.education_plan_selection = true : this.education_plan_selection = false;
      this.educationSelection(form.endowmentDetailsList);
    });
  }

  buildEducationSelectionForm() {
    const dependantListArray = [];
    this.dependantsArray.forEach((dependant: any) => {
      dependantListArray.push(this.buildEducationList(dependant));
    });
    this.dependantEducationSelectionForm = this.formBuilder.group({
      hasEndowments: [this.hasEndowments , Validators.required],
      endowmentDetailsList: this.formBuilder.array(dependantListArray)
    });
    this.educationSelection(this.dependantEducationSelectionForm.value.endowmentDetailsList);
  }
  educationSelection(form) {
    let educationPreferenceAlert = true;
    form.forEach((dependant: any, index) => {
      if (dependant.dependantSelection) {
        educationPreferenceAlert = !dependant.dependantSelection;
      }
    });
    this.educationPreference = educationPreferenceAlert;
  }

  buildEducationList(value) {
    const ageFind = this.aboutAge.calculateAge(value.dateOfBirth, new Date());
    const aboutAgeCal = this.aboutAge.getAboutAge(ageFind,
      (value.gender === 'Male') ?
       this.translate.instant('CMP.ENDOWMENT_PLAN.MALE_ABOUT_YEAR') : this.translate.instant('CMP.ENDOWMENT_PLAN.FEMALE_ABOUT_YEAR'));
    return this.formBuilder.group({
      id: [value.id],
      name: [value.name],
      dateOfBirth: [value.dateOfBirth],
      dependantSelection: [value.preferenceSelection],
      gender: [value.gender],
      age: aboutAgeCal
    });
  }
  goToNext(form) {
    const dependantArray = [];
    if (form.value.hasEndowments === '0') {
      const childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
      this.summaryModalDetails = {
        setTemplateModal: 1, dependantModelSel: false, contentObj: childrenEducationNonDependantModal,
        nonDependantDetails: this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS.NO_DEPENDANT'),
        nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2'
      };
      this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
    } else {
      form.value.endowmentDetailsList.forEach((dependantDetail: any) => {
          dependantArray.push({
            id: 0, dependentId: dependantDetail.id, location: '', educationCourse: '', endowmentMaturityAmount: '',
            endowmentMaturityYears: '', name: dependantDetail.name, dateOfBirth: dependantDetail.dateOfBirth,
             gender: dependantDetail.gender, age: dependantDetail.age, preferenceSelection : dependantDetail.dependantSelection
          });

      });
      form.value.endowmentDetailsList = dependantArray;
      if (!form.pristine) {
        this.comprehensiveService.setEndowment(form.value.hasEndowments );
        this.comprehensiveService.setChildEndowment(form.value.endowmentDetailsList);
      }
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE]);
    }
  }
}
