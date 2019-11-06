import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';
import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';

@Component({
  selector: 'app-retirement-plan-step1',
  templateUrl: './retirement-plan-step1.component.html',
  styleUrls: ['./retirement-plan-step1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RetirementPlanStep1Component implements OnInit {
  pageTitle: string;
  retirementAgeFlag: boolean;
  submitted: boolean = false;

  retirementNeedsForm: FormGroup;

  constructor(
    public navbarService: NavbarService,
    private translate: TranslateService,
    private parserFormatter: NgbDateParserFormatter,
    private config: NgbDatepickerConfig,
    private formBuilder: FormBuilder,
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

    this.buildFormData();
  }

  buildFormData() {
    this.retirementNeedsForm = this.formBuilder.group({
      retirementAge: ['', [Validators.required]],
      retirementIncome: ['', [Validators.required]],
      customerDob: ['', [Validators.required]],
      lumpsumAmount: [''],
      monthlyAmount: ['']
    }, { validator: this.checkAge() });
  }


  checkAge() {
    return (group: FormGroup) => {
      const customerDob = group.controls['customerDob'];
      const retirementAge = group.controls['retirementAge'];
      const dob = customerDob.value;
      const today = new Date();
      const birthDate = new Date(dob['year'] + '/' + dob['month'] + '/' + dob['day']);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age && retirementAge.value < age) {
        customerDob.setErrors({invalidAge: true});
        console.log(age);
      } else if(age && retirementAge.value > age) {
        customerDob.setErrors(null);
      }
    };
  }

  save(formData) {
    this.submitted = true;
    console.log(formData);
  }
}
