import { Component, HostListener, OnDestroy, OnInit, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ComprehensiveService } from '../comprehensive.service';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { IMySummaryModal } from '../comprehensive-types';

@Component({
  selector: 'app-dependant-education-selection',
  templateUrl: './dependant-education-selection.component.html',
  styleUrls: ['./dependant-education-selection.component.scss']
})
export class DependantEducationSelectionComponent implements OnInit, OnDestroy {

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
              private configService: ConfigService, private comprehensiveService: ComprehensiveService) {
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
    this.dependantsArray = [];
    const dependantDetails = this.comprehensiveService.getMyDependant();
    dependantDetails.forEach((details: any) => {
      if (details.relationship === 'Child') {
        this.dependantsArray.push(details);
      }
    });
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.checkDependant();
  }

  checkDependant() {

    this.dependantEducationSelectionForm.valueChanges.subscribe((form: any) => {
      let educationPreferenceAlert = true;
      form.hasEndowments === '0' ? this.education_plan_selection = true : this.education_plan_selection = false;
      form.endowmentDetailsList.forEach((dependant: any, index) => {
        if (dependant.dependantSelection) {
          educationPreferenceAlert = !dependant.dependantSelection;
        }
      });
      this.educationPreference = educationPreferenceAlert;
    });
  }

  buildEducationSelectionForm() {
    const dependantListArray = [];
    this.dependantsArray.forEach((dependant: any) => {
      dependantListArray.push(this.buildEducationlist(dependant));
    });
    this.dependantEducationSelectionForm = this.formBuilder.group({
      hasEndowments: ['', Validators.required],
      endowmentDetailsList: this.formBuilder.array(dependantListArray)
    });

  }

  buildEducationlist(value) {
    return this.formBuilder.group({
      id: [value.id],
      name: [value.name],
      dateOfBirth:[value.dateOfBirth],
      dependantSelection: [value.dependantSelection],
      gender: [value.gender]
    });
  }
  goToNext(form) {
    const dependantArray = [];   
    if(form.value.hasEndowments == 0){
      let childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');      
      this.summaryModalDetails = { setTemplateModal: 1, dependantModelSel: false, contentObj: childrenEducationNonDependantModal, nonDependantDetails: { livingCost: 2000, livingPercent: 3, livingEstimatedCost: 2788, medicalBill: 5000, medicalYear: 20, medicalCost: 300000 }, nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS)+'/2' };
      this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
    } else {
      form.value.endowmentDetailsList.forEach((dependantDetail: any) => {
      if (dependantDetail.dependantSelection) { 
        dependantArray.push({
            id: 0, dependentId: dependantDetail.id,
            enquiryId: '', location: '', educationCourse: '', endowmentMaturityAmount: '',
            endowmentMaturityYears: '', name: dependantDetail.name,dateOfBirth:dependantDetail.dateOfBirth,gender:dependantDetail.gender
          });
        }
      });
      form.value.endowmentDetailsList = dependantArray;
      this.comprehensiveService.setChildEndowment(form.value);
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE]);
    }    
  }
}
