import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { FormGroup, FormArray, FormBuilder, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { COMPREHENSIVE_CONST } from '../../comprehensive/comprehensive-config.constants';
import { CORPBIZ_ROUTES_PATHS } from '../corpbiz-welcome-flow.routes.constants';
import { ComprehensiveApiService } from '../../comprehensive/comprehensive-api.service';

const DEFAULT_RETIRE_AGE = 55;
@Component({
  selector: 'app-tell-about-you',
  templateUrl: './tell-about-you.component.html',
  styleUrls: ['./tell-about-you.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TellAboutYouComponent implements OnInit {
  viewMode: boolean;
  retirementValueChanges = false;
  retirementPlanForm: FormGroup;
  sliderValue = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE;
  sliderValid = { minAge: true, userAge: true };
  userAge: number = 58;
  @ViewChild('ciMultiplierSlider') ciMultiplierSlider: NouisliderComponent;
  ciSliderConfig: any = {
    behaviour: 'snap',
    start: 0,
    connect: [true, false],
    format: {
      to: (value) => {
        return Math.round(value);
      },
      from: (value) => {
        return Math.round(value);
      }
    },
    range: {
      min: COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE,
      max: COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE
    },
    step: COMPREHENSIVE_CONST.RETIREMENT_PLAN.STEP
  };
  formObject: FormGroup;

  constructor(  private footerService: FooterService,
                private navbarService: NavbarService,
                private translate: TranslateService,
                private router: Router,
                private fb: FormBuilder,
                private comprehensiveApiService: ComprehensiveApiService) {

                  this.translate.use('en');
                 }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.buildForm();
  }

  buildForm() {
    this.formObject = this.fb.group({
      retirementAge: [this.userAge > DEFAULT_RETIRE_AGE ? this.userAge: DEFAULT_RETIRE_AGE, [Validators.required]],
      cashInBank: [0, [Validators.required]]
    })
  }

  changeSlide($event) {
    this.sliderValid = { minAge: true, userAge: true };
    this.retirementAgeValidaitions($event.target.value);
    /*
    if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE) {
      $event.target.value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE;
    // } else if ($event.target.value === '' || $event.target.value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) {
    } else if ($event.target.value === '' || $event.target.value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) {
        // // this.sliderValid.minAge = false;
        // $event.target.value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE;  - focusout func need to be written
      }
    // else if ($event.target.value === '' || $event.target.value < this.userAge) {   // 50 < 58
    //   this.sliderValid.minAge = false;
    // }
    // if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE ) {
    if ($event.target.value < this.userAge) {
      this.sliderValid.userAge = false;
      this.formObject.get('retirementAge').patchValue($event.target.value);
    } else if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE
      && $event.target.value <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE ) {
      this.ciMultiplierSlider.writeValue($event.target.value);
      this.sliderValue = $event.target.value;
      this.formObject.get('retirementAge').patchValue($event.target.value);
    }
    */
  }

  retirementAgeValidaitions(value) {
    if (value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE) {  // 75 > 71 = 71
      value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE;
    // } else if (value === '' || value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) {
    } else if (value === '' || value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) {   //40 < 45 - error
        // // this.sliderValid.minAge = false;
        // value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE;  - focusout func need to be written
      }
    // else if (value === '' || value < this.userAge) {   // 50 < 58
    //   this.sliderValid.minAge = false;
    // }
    // if (value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE ) {
    if (value < this.userAge) {    // 51 < 58 = 51(with error)
      this.sliderValid.userAge = false;
      this.formObject.get('retirementAge').patchValue(value);
      // this.ciMultiplierSlider.writeValue(value);
    } else if (value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE
      && value <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE ) {
        this.sliderValid.userAge = true;
      // this.ciMultiplierSlider.writeValue(value);
      this.sliderValue = value;
      this.formObject.get('retirementAge').patchValue(value);
    }
  }

  onSliderChange(value): void {
    /*
    this.formObject.get('retirementAge').patchValue(value);
    this.sliderValid = { minAge: true, userAge: true };
    this.sliderValue = value;
    this.retirementValueChanges = true;
    if (this.sliderValue >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE && this.sliderValue < this.userAge) {
      //this.sliderValue = Math.ceil(this.userAge / 5) * 5;
      // this.sliderValue = this.userAge;
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    }
    */
   this.retirementAgeValidaitions(value);
  }

  goToNext() {
    this.comprehensiveApiService.generateReport(this.formObject.value).subscribe(res => {
      if (res && res.objectList[0]) {
        this.router.navigate([CORPBIZ_ROUTES_PATHS.LIFE_PAYOUT]);
      }
    })
  }
}

