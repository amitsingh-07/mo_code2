import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { RetirementPlanningService } from '../retirement-planning.service';
import { RETIREMENT_PLANNING_ROUTE_PATHS } from '../retirement-planning-routes.constants';

@Component({
  selector: 'app-personalize-your-retirement',
  templateUrl: './personalize-your-retirement.component.html',
  styleUrls: ['./personalize-your-retirement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalizeYourRetirementComponent implements OnInit {
  pageTitle: string;
  personalizeYourRetireForm: FormGroup;

  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    private translate: TranslateService,
    public retirementPlanningService: RetirementPlanningService,
    private router: Router
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RETIREMENT_PLANNING.STEP_2.TITLE');
      this.navbarService.setPageTitle(this.pageTitle, undefined, undefined, undefined, undefined, undefined);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(8);
    this.navbarService.setNavbarShadowVisibility(false);
    this.buildForm();
  }

  buildForm() {
    this.personalizeYourRetireForm = this.formBuilder.group({
      stableIncomeStream: [false],
      flexibleIncomeStream: [false],
      longerPeriodOfIncome: [false],
    }, { validator: this.requireCheckboxesToBeCheckedValidator(2) });
  }

  // checkbox Validator 
  requireCheckboxesToBeCheckedValidator(minRequired): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          checked++;
        }
      });

      if (checked < minRequired || checked > minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }

      return null;
    };
  }

  save() {
    this.submitted = true;
    if (this.personalizeYourRetireForm.valid) {
      const scheme = Object.keys(this.personalizeYourRetireForm.value).filter(e => {
        return this.personalizeYourRetireForm.value[e] === true;
      });
      this.retirementPlanningService.createRetirementPlan(scheme).subscribe((response) => {
        if (response.responseMessage.responseCode === 6000) {
          this.retirementPlanningService.clearData();
          this.router.navigate([RETIREMENT_PLANNING_ROUTE_PATHS.ENQUIRY_SUCCESS]);
        }
      });
    }
  }

}
