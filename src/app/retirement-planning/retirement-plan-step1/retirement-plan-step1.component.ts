import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateCustomParserFormatter } from 'src/app/shared/utils/ngb-date-custom-parser-formatter';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { RetirementPlanningService } from '../retirement-planning.service';

import { RETIREMENT_PLANNING_ROUTE_PATHS } from '../retirement-planning-routes.constants';

@Component({
  selector: 'app-retirement-plan-step1',
  templateUrl: './retirement-plan-step1.component.html',
  styleUrls: ['./retirement-plan-step1.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  encapsulation: ViewEncapsulation.None
})
export class RetirementPlanStep1Component implements OnInit {
  pageTitle: string;
  retirementAgeFlag: boolean;
  submitted: boolean = false;

  retirementNeedsForm: FormGroup;
  formValues: any;

  constructor(
    public navbarService: NavbarService,
    private translate: TranslateService,
    private parserFormatter: NgbDateParserFormatter,
    private config: NgbDatepickerConfig,
    private formBuilder: FormBuilder,
    private router: Router,
    public retirementPlanningService: RetirementPlanningService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RETIREMENT_PLANNING.STEP_1.TITLE');
      this.navbarService.setPageTitle(
        this.pageTitle,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarShadowVisibility(false);
    this.formValues = this.retirementPlanningService.getRetirementNeeds();
    this.buildFormData();
  }

  buildFormData() {
    this.retirementNeedsForm = this.formBuilder.group({
      retirementAge: [this.formValues.retirementNeeds && this.formValues.retirementNeeds.retirementAge, [Validators.required]],
      monthlyRetirementIncome: [this.formValues.retirementNeeds && this.formValues.retirementNeeds.monthlyRetirementIncome, [Validators.required]],
      dateOfBirth: [this.formValues.retirementNeeds && this.formValues.retirementNeeds.dateOfBirth, [Validators.required]],
      lumpSumAmount: [this.formValues.retirementAmountAvailable && this.formValues.retirementAmountAvailable.lumpSumAmount],
      monthlyAmount: [this.formValues.retirementAmountAvailable && this.formValues.retirementAmountAvailable.monthlyAmount]
    }, { validator: this.checkAge() });
  }


  checkAge() {
    return (group: FormGroup) => {
      const dateOfBirth = group.controls['dateOfBirth'];
      const retirementAge = group.controls['retirementAge'];

      if (dateOfBirth.value) {
        const dob = dateOfBirth.value;
        const today = new Date();
        const birthDate = new Date(dob['year'] + '/' + dob['month'] + '/' + dob['day']);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age && retirementAge.value < age) {
          dateOfBirth.setErrors({ invalidAge: true });
        } else if (age && retirementAge.value > age) {
          dateOfBirth.setErrors(null);
        }
      }
    };
  }

  save(form) {
    this.submitted = true;
    if (form.valid) {
      const retirementNeedsGroup = {
        retirementNeeds: {
          retirementAge: form.value.retirementAge,
          monthlyRetirementIncome: form.value.monthlyRetirementIncome,
          dateOfBirth: form.value.dateOfBirth
        },
        retirementAmountAvailable: {
          lumpSumAmount: form.value.lumpSumAmount,
          monthlyAmount: form.value.monthlyAmount
        }
      };
      this.retirementPlanningService.setRetirementNeeds(retirementNeedsGroup);
      this.router.navigate([RETIREMENT_PLANNING_ROUTE_PATHS.STEP_2]);
    }
  }
}
