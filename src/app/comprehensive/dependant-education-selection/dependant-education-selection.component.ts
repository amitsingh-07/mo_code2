import { map } from 'rxjs/operators';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { AboutAge } from './../../shared/utils/about-age.util';
import { IChildEndowment, IDependantDetail, IMySummaryModal } from './../comprehensive-types';

@Component({
  selector: 'app-dependant-education-selection',
  templateUrl: './dependant-education-selection.component.html',
  styleUrls: ['./dependant-education-selection.component.scss']
})
export class DependantEducationSelectionComponent implements OnInit, OnDestroy {

  hasEndowments: string;
  dependantDetailsArray: IDependantDetail[];
  education_plan_selection = false;
  pageId: string;
  pageTitle: string;
  dependantEducationSelectionForm: FormGroup;
  childEndowmentFormGroupArray: FormGroup[];
  childEndowmentArray: IChildEndowment[];
  educationPreference = true;
  menuClickSubscription: Subscription;
  summaryModalDetails: IMySummaryModal;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder,
    private configService: ConfigService, private comprehensiveService: ComprehensiveService,
    private aboutAge: AboutAge, private comprehensiveApiService: ComprehensiveApiService,
    private loaderService: LoaderService) {
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
  }

  dependantSelection() {

    this.childEndowmentArray = [];
    this.childEndowmentFormGroupArray = [];

    this.comprehensiveService.updateComprehensiveSummary();
    this.hasEndowments = this.comprehensiveService.hasEndowment();
    this.childEndowmentArray = this.comprehensiveService.getChildEndowment();
    this.dependantDetailsArray = this.comprehensiveService.getMyDependant();

    console.log(this.childEndowmentArray);
    if (this.childEndowmentArray.length > 0) {
      this.buildChildEndowmentFormArray();
      this.buildEducationSelectionForm();
    } else {
      this.dependantDetailsArray.forEach((dependant: IDependantDetail) => {
        if (dependant.relationship.toLowerCase() === 'child' || dependant.relationship.toLowerCase() === 'sibling') {
          const newEndowment = this.getNewEndowmentItem(dependant);
          this.childEndowmentArray.push(newEndowment);
          this.childEndowmentFormGroupArray.push(this.formBuilder.group(newEndowment));
          this.buildEducationSelectionForm();
        }
      });
    }
  }

  getNewEndowmentItem(dependant: IDependantDetail) {
    let preferenceSelected = true;
    if (this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry.hasEndowments) {
      preferenceSelected = false;
    }
    return {
      id: 0,
      dependentId: dependant.id,
      name: dependant.name,
      dateOfBirth: dependant.dateOfBirth,
      gender: dependant.gender,
      enquiryId: dependant.enquiryId,
      location: null,
      educationCourse: null,
      endowmentMaturityAmount: 0,
      endowmentMaturityYears: 0,
      age: this.aboutAge.calculateAge(dependant.dateOfBirth, new Date()),
      preferenceSelection: preferenceSelected
    } as IChildEndowment;
  }

  getExistingEndowmentItem(childEndowment: IChildEndowment, dependant: IDependantDetail) {
    return {
      id: childEndowment.id,
      dependentId: dependant.id,
      name: dependant.name,
      dateOfBirth: dependant.dateOfBirth,
      gender: dependant.gender,
      enquiryId: dependant.enquiryId,
      location: childEndowment.location,
      educationCourse: childEndowment.educationCourse,
      endowmentMaturityAmount: childEndowment.endowmentMaturityAmount,
      endowmentMaturityYears: childEndowment.endowmentMaturityYears,
      age: this.aboutAge.calculateAge(dependant.dateOfBirth, new Date()),
      preferenceSelection: true
    } as IChildEndowment;
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

  buildChildEndowmentFormArray() {
    const tempChildEndowmentArray: IChildEndowment[] = [];
    this.childEndowmentFormGroupArray = [];
    this.dependantDetailsArray.forEach((dependant: IDependantDetail) => {
      for (const childEndowment of this.childEndowmentArray) {
        if (dependant.relationship.toLowerCase() === 'child' || dependant.relationship.toLowerCase() === 'sibling') {
          if (childEndowment.dependentId === dependant.id) {
            const thisEndowment = this.getExistingEndowmentItem(childEndowment, dependant);
            // Filter the array to avoid duplicates
            if (tempChildEndowmentArray.filter((item: IChildEndowment) => item.dependentId === thisEndowment.dependentId).length === 0) {
              tempChildEndowmentArray.push(thisEndowment);
              this.childEndowmentFormGroupArray.push(this.formBuilder.group(thisEndowment));
            }
            break;
          }
        }
      }

      // Filter the array to avoid duplicates
      if (tempChildEndowmentArray.filter((item: IChildEndowment) => item.dependentId === dependant.id).length === 0) {
        const thisNewEndowment = this.getNewEndowmentItem(dependant);
        tempChildEndowmentArray.push(thisNewEndowment);
        this.childEndowmentFormGroupArray.push(this.formBuilder.group(thisNewEndowment));
      }
    });

    this.childEndowmentArray = tempChildEndowmentArray;
  }

  buildEducationSelectionForm() {
    this.dependantEducationSelectionForm = this.formBuilder.group({
      hasEndowments: [this.hasEndowments, Validators.required],
      endowmentDetailsList: this.formBuilder.array(this.childEndowmentFormGroupArray)
    });
    this.educationSelection(this.dependantEducationSelectionForm.value.endowmentDetailsList);
  }
  educationSelection(form) {
    let educationPreferenceAlert = true;
    form.forEach((dependant: IChildEndowment, index) => {
      if (dependant.preferenceSelection) {
        educationPreferenceAlert = !dependant.preferenceSelection;
      }
    });
    this.educationPreference = educationPreferenceAlert;
  }

  goToNext(form) {
    const dependantArray = [];
    if (form.value.hasEndowments === '0') {
      this.loaderService.showLoader({ title: 'Saving' });
      this.comprehensiveService.setEndowment(form.value.hasEndowments);
      this.comprehensiveService.setChildEndowment([]);
      this.comprehensiveApiService.saveChildEndowment({
        hasEndowments: form.value.hasEndowments,
        endowmentDetailsList: [{
          id: 0,
          dependentId: 0,
          enquiryId: this.comprehensiveService.getEnquiryId(),
          location: null,
          educationCourse: null,
          endowmentMaturityAmount: null,
          endowmentMaturityYears: null
        } as IChildEndowment]
      }).subscribe((data: any) => {
        this.loaderService.hideLoader();
        const childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
        this.summaryModalDetails = {
          setTemplateModal: 1, dependantModelSel: false, contentObj: childrenEducationNonDependantModal,
          nonDependantDetails: this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS.NO_DEPENDANT'),
          nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2'
        };
        this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
      });
    } else {
      if (!form.pristine) {
        const selectedChildArray = form.value.endowmentDetailsList.filter((item: IChildEndowment) => item.preferenceSelection);
        this.comprehensiveService.setEndowment(form.value.hasEndowments);
        this.comprehensiveService.setChildEndowment(selectedChildArray);
        this.loaderService.showLoader({ title: 'Saving' });

        this.comprehensiveApiService.saveChildEndowment({
          hasEndowments: form.value.hasEndowments,
          endowmentDetailsList: selectedChildArray
        }).subscribe((data: any) => {
          this.loaderService.hideLoader();
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE]);
        });
        // TODO : Remove this line after saveChildEndowment API is working
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE]);
      }
    }
  }
}
