import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { IMyDependant, IMySummaryModal } from './../comprehensive-types';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependants-details',
  templateUrl: './dependants-details.component.html',
  styleUrls: ['./dependants-details.component.scss']
})
export class DependantsDetailsComponent implements OnInit, OnDestroy {
  genderList: any;
  myDependantForm: FormGroup;
  formName: string[] = [];
  pageTitle: string;
  dependant: any = [];
  relationShipList: any;
  nationalityList: any;
  dependantDetails: IMyDependant[];
  relationship: string;
  submitted = false;
  pageId: string;
  summaryModalDetails: IMySummaryModal;
  menuClickSubscription: Subscription;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private loaderService: LoaderService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private parserFormatter: NgbDateParserFormatter, private configDate: NgbDatepickerConfig) {
    const today: Date = new Date();
    configDate.minDate = { year: (today.getFullYear() - 55), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    configDate.outsideDays = 'collapsed';
    this.pageId = this.route.routeConfig.component.name;
    this.dependantDetails = [];
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.relationShipList = this.translate.instant('CMP.DEPENDANT_DETAILS.RELATIONSHIP_LIST');
        this.nationalityList = this.translate.instant('CMP.NATIONALITY');
        this.genderList = this.translate.instant('CMP.GENDER');
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });
    this.dependantDetails = this.comprehensiveService.getMyDependant();
    if (this.dependantDetails.length === 0) {
      this.loaderService.showLoader({ title: 'Fetching Data' });
      this.comprehensiveApiService.getDependents().subscribe((data) => {
        this.dependantDetails = data.objectList;
        this.loaderService.hideLoader();
        this.buildDependantForm();
      });
    }

  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildDependantForm();
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  buildDependantForm() {
    const dependantFormArray = [];
    if (this.dependantDetails.length > 0) {
      this.dependantDetails.forEach((dependant) => {
        dependantFormArray.push(this.buildDependantDetailsForm(dependant));
      });
    } else {
      dependantFormArray.push(this.buildEmptyForm());
    }
    this.myDependantForm = this.formBuilder.group({
      dependentMappingList: this.formBuilder.array(dependantFormArray),
    });
  }

  getCurrentFormsCount() {
    return this.myDependantForm.controls['dependentMappingList']['controls'].length;
  }

  selectRelationship(status, i) {
    const relationship = status ? status : '';
    this.myDependantForm.controls['dependentMappingList']['controls'][i].controls.relationship.setValue(relationship);

  }
  selectGender(status, i) {
    const gender = status ? status : '';
    this.myDependantForm.controls['dependentMappingList']['controls'][i].controls.gender.setValue(gender);
  }
  selectNationality(status, i) {
    const nationality = status ? status : '';
    this.myDependantForm.controls['dependentMappingList']['controls'][i].controls.nation.setValue(nationality);
  }

  buildDependantDetailsForm(thisDependant) {
    return this.formBuilder.group({
      id: [thisDependant.id],
      name: [thisDependant.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)
        , Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: [thisDependant.relationship, [Validators.required]],
      gender: [thisDependant.gender, [Validators.required]],
      dateOfBirth: [this.parserFormatter.parse(thisDependant.dateOfBirth), [Validators.required]],
      nation: [thisDependant.nation, [Validators.required]]
    });
  }

  buildEmptyForm() {
    return this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)
        , Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      nation: ['', [Validators.required]]
    });
  }

  addDependant() {
    const dependantdetails = this.myDependantForm.get('dependentMappingList') as FormArray;
    dependantdetails.push(this.buildEmptyForm());
  }
  removeDependant(i) {
    const dependantdetails = this.myDependantForm.get('dependentMappingList') as FormArray;
    dependantdetails.removeAt(i);
  }
  validateDependantform(form: FormGroup) {

    this.submitted = true;
    if (!form.valid) {
      const error = this.comprehensiveService.getMultipleFormError(form, COMPREHENSIVE_FORM_CONSTANTS.dependantForm,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.DEPENDANT_DETAIL'));
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, true,
      );
      return false;
    }
    return true;
  }
  goToNext(form: FormGroup) {

    if (this.validateDependantform(form)) {
      form.value.dependentMappingList.forEach((dependant: any, index) => {
        form.value.dependentMappingList[index].dateOfBirth = this.parserFormatter.format(dependant.dateOfBirth);
        form.value.dependentMappingList[index].enquiryId = 4850;
      });
      this.comprehensiveService.setMyDependant(form.value.dependentMappingList);
      const dependantDetails = [];
      this.comprehensiveService.getMyDependant().forEach((dependant: any) => {
        if (dependant.relationship === 'Child' || dependant.relationship === 'Sibling') {
          dependantDetails.push(dependant);
        }
      });
      if (dependantDetails.length > 0) {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION]);
      } else {
        const childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
        this.summaryModalDetails = {
          setTemplateModal: 1, dependantModelSel: false, contentObj: childrenEducationNonDependantModal,
          nonDependantDetails: this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS.NO_DEPENDANT'),
          nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2'
        };
        this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
      }
    }
  }
}
