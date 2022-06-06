import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { NouisliderComponent } from 'ng2-nouislider';
import { TranslateService } from '@ngx-translate/core';
import { COMPREHENSIVE_CONST } from '../../comprehensive/comprehensive-config.constants';
import { FormGroup, FormArray, FormBuilder, } from '@angular/forms';

@Component({
  selector: 'app-welcome-step-one',
  templateUrl: './welcome-step-one.component.html',
  styleUrls: ['./welcome-step-one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeStepOneComponent implements OnInit {
  viewMode: boolean;
  retirementValueChanges = false;
  retirementPlanForm: FormGroup;
  sliderValue = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE;
  sliderValid = { minAge: true, userAge: true };
  userAge: number;
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

  constructor(  public footerService: FooterService,
                public navbarService: NavbarService,
                private translate: TranslateService) {

                  this.translate.use('en');
                 }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }
  changeSlide($event) {
    debugger
    this.sliderValid = { minAge: true, userAge: true };
    if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE) {
      $event.target.value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE;
    } else if ($event.target.value === '' || $event.target.value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) {
      this.sliderValid.minAge = false;
    }
    if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE ) {
    // if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE && $event.target.value < this.userAge) {
      this.sliderValid.userAge = false;
    } else if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE
      && $event.target.value <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE ) {
      // && $event.target.value <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE && $event.target.value >= this.userAge) {
      this.ciMultiplierSlider.writeValue($event.target.value);
      this.sliderValue = $event.target.value;
    }
  }

  onSliderChange(value): void {
    this.sliderValid = { minAge: true, userAge: true };
    this.sliderValue = value;
    this.retirementValueChanges = true;
    if (this.sliderValue >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE && this.sliderValue < this.userAge) {
      //this.sliderValue = Math.ceil(this.userAge / 5) * 5;
      this.sliderValue = this.userAge;
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    }
  }
}
