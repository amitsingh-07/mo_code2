import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IEducationPlan } from '../comprehensive-types';
import { IMySummaryModal } from '../comprehensive-types';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { AboutAge } from './../../shared/utils/about-age.util';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependant-education-list',
  templateUrl: './dependant-education-list.component.html',
  styleUrls: ['./dependant-education-list.component.scss']
})
export class DependantEducationListComponent implements OnInit {
  pageTitle: string;
  pageId: string;
  endowmentListForm: FormGroup;
  menuClickSubscription: Subscription;
  endowmentDetail: IEducationPlan;
  endowmentArrayPlan: any;
  endowmentPlan: any = [];
  endowmentSkipEnable = true;
  summaryModalDetails: IMySummaryModal;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder,
              private configService: ConfigService, private comprehensiveService: ComprehensiveService, private aboutAge: AboutAge ) {
  this.configService.getConfig().subscribe((config: any) => {
    this.translate.setDefaultLang(config.language);
    this.translate.use(config.language);
    this.translate.get(config.common).subscribe((result: string) => {
      // meta tag and title

      this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
      this.setPageTitle(this.pageTitle);
    });
  });

}
setPageTitle(title: string) {
  this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
}
ngOnInit() {
  this.navbarService.setNavbarComprehensive(true);
  this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
    if (this.pageId === pageId) {

    }
  });
  this.endowmentDetail = this.comprehensiveService.getChildEndowment();
  this.endowmentArrayPlan = this.endowmentDetail.endowmentDetailsList;
  this.buildEndowmentListForm();
  let endowmentSkipEnableFlag = true;
  this.endowmentArrayPlan.forEach((dependant: any) => {
    if (dependant.endowmentMaturityAmount !== '') {
      endowmentSkipEnableFlag = false;
    }
  });
  this.endowmentSkipEnable = endowmentSkipEnableFlag;

}
buildEndowmentListForm() {
  const endowmentArray = [];
  this.endowmentArrayPlan.forEach((endowmentPlan: any) => {
    endowmentArray.push(this.buildEndowmentDetailsForm(endowmentPlan));
  });
  this.endowmentListForm = this.formBuilder.group({
    endowmentPlan: this.formBuilder.array(endowmentArray),

  });

}
buildEndowmentDetailsForm(value): FormGroup {

  return this.formBuilder.group({
    name: [value.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    age: [this.aboutAge.calculateAge(value.dateOfBirth, new Date()), [Validators.required]],
    endowmentMaturityAmount: [value.endowmentMaturityAmount, [Validators.required]],
    endowmentMaturityYear: [value.endowmentMaturityYear, [Validators.required, Validators.pattern('^(19|20)\d{2}$')]],
    endowmentplanShow: [(value.endowmentMaturityAmount === '') || (value.endowmentMaturityYear == null)
      ? false : true, [Validators.required]],
    gender: [value.gender, [Validators.required]]
  });

}
goToNext(form) {
  const dependantArray = [];
  if (this.endowmentSkipEnable) {
    const childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
    this.summaryModalDetails = { setTemplateModal: 1, dependantModelSel: false,
      contentObj: childrenEducationNonDependantModal, nonDependantDetails: { livingCost: 2000,
         livingPercent: 3, livingEstimatedCost: 2788, medicalBill: 5000, medicalYear: 20,
          medicalCost: 300000 }, nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2' };
    this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
  } else {
    form.value.endowmentPlan.forEach((preferenceDetails: any, index) => {
      this.endowmentArrayPlan[index].endowmentMaturityAmount = preferenceDetails.endowmentMaturityAmount;
      this.endowmentArrayPlan[index].endowmentMaturityYear = preferenceDetails.endowmentMaturityYear;
      if (preferenceDetails.endowmentplanShow === true) {
        const aboutAgeCal = this.aboutAge.getAboutAge(preferenceDetails.age,
          (preferenceDetails.gender === 'Male') ?
           this.translate.instant('CMP.ENDOWMENT_PLAN.MALE_ABOUT_YEAR') : this.translate.instant('CMP.ENDOWMENT_PLAN.FEMALE_ABOUT_YEAR'));
        dependantArray.push({
          userName: preferenceDetails.name, userAge: aboutAgeCal, userEstimatedCost: preferenceDetails.endowmentMaturityAmount
        });
      }

    });
    this.comprehensiveService.setChildEndowment(this.endowmentDetail);
    const childrenEducationDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.DEPENDANTS');
    this.summaryModalDetails = { setTemplateModal: 1, dependantModelSel: true,
      contentObj: childrenEducationDependantModal, dependantDetails: dependantArray,
      nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2' };
    this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
  }
}
showToolTipModal() {
  const toolTipParams = {
    TITLE: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_TITLE'),
    DESCRIPTION: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_MESSAGE')
  };
  this.comprehensiveService.openTooltipModal(toolTipParams);

}

@HostListener('input', ['$event'])
onChange() {
  this.checkDependant();
}

checkDependant() {
  this.endowmentListForm.valueChanges.subscribe((form: any) => {
    let endowmentSkipEnableFlag = true;
    form.endowmentPlan.forEach((dependant: any, index) => {
      if (dependant.endowmentplanShow) {
        endowmentSkipEnableFlag = false;
      }
    });
    this.endowmentSkipEnable = endowmentSkipEnableFlag;
  });
}
}
