import { Component, OnInit,HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { IMyLiabilities, IMySummaryModal } from '../comprehensive-types';

@Component({
  selector: 'app-my-liabilities',
  templateUrl: './my-liabilities.component.html',
  styleUrls: ['./my-liabilities.component.scss']
})
export class MyLiabilitiesComponent implements OnInit {
  pageTitle: string;
  myLiabilitiesForm: FormGroup;
  submitted: boolean;
  propertyLoan = true;
  liabilitiesDetails: IMyLiabilities;
  summaryModalDetails:IMySummaryModal;
  totalOutstanding = 0;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService, 
              private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('CMP.MY_LIABILITIES.TITLE');

      this.setPageTitle(this.pageTitle);
    });

    this.liabilitiesDetails = this.comprehensiveService.getMyLiabilities();   

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  addPropertyLoan() {
     const otherPropertyControl = this.myLiabilitiesForm.controls['otherPropertyLoan'];
    if(this.propertyLoan){     
      otherPropertyControl.setValidators([Validators.required]);
      otherPropertyControl.updateValueAndValidity();
    } else {
      otherPropertyControl.setValue('');
      otherPropertyControl.setValidators([]);
      otherPropertyControl.updateValueAndValidity();
    }
    this.onTotalOutstanding();
    this.propertyLoan = !this.propertyLoan;
  }
  buildmyLiabilitiesForm() {
    this.myLiabilitiesForm = this.formBuilder.group({
      homeLoanOutstanding: [this.liabilitiesDetails ? this.liabilitiesDetails.homeLoanOutstanding : '', [Validators.required]],
      otherPropertyLoan: [this.liabilitiesDetails ? this.liabilitiesDetails.otherPropertyLoan : ''],
      otherLoanAmountOustanding: [this.liabilitiesDetails ? this.liabilitiesDetails.otherLoanAmountOustanding : '', [Validators.required]],
      carLoan: [this.liabilitiesDetails ? this.liabilitiesDetails.carLoan : '', [Validators.required]],

    });
  }
  ngOnInit() {
    this.buildmyLiabilitiesForm();
  }

   goToNext(form: FormGroup) {
    if (this.validateLiabilities(form)) {
      console.log('Got it');
      let financeModal = this.translate.instant('CMP.MY_LIABILITIES.FINANCES_MODAL');      
      let retireModal = this.translate.instant('CMP.MY_LIABILITIES.RETIREMENT_MODAL');      
      let insurancePlanningDependantModal = this.translate.instant('CMP.MY_LIABILITIES.INSURANCE_PLANNING_MODAL.DEPENDANTS'); 
      let insurancePlanningNonDependantModal = this.translate.instant('CMP.MY_LIABILITIES.INSURANCE_PLANNING_MODAL.NO_DEPENDANTS');
      let childrenEducationDependantModal = this.translate.instant('CMP.MY_LIABILITIES.CHILDREN_EDUCATION_MODAL.DEPENDANTS'); 
      let childrenEducationNonDependantModal = this.translate.instant('CMP.MY_LIABILITIES.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
      
      this.comprehensiveService.openSummaryModal(financeModal, retireModal, insurancePlanningDependantModal, insurancePlanningNonDependantModal, childrenEducationDependantModal, childrenEducationNonDependantModal, this.summaryModalDetails);
    }

  }

  validateLiabilities(form: FormGroup) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_LIABILITIES);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_LIABILITIES'));
      return false;
    }
    return true;
  }

 @HostListener('input', ['$event'])
  onChange() {
    this.onTotalOutstanding();
  }

  onTotalOutstanding(){
    this.totalOutstanding = this.comprehensiveService.additionOfCurrency(this.myLiabilitiesForm.value);   
  }
}
