import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NouisliderComponent } from 'ng2-nouislider';
import { FormGroup, FormArray, FormBuilder, } from '@angular/forms';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { CORPBIZ_ROUTES_PATHS } from '../corpbiz-welcome-flow.routes.constants'
import { COMPREHENSIVE_CONST } from '../../comprehensive/comprehensive-config.constants';
import { TellAboutYouService } from '../tell-about-you.service';

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

  constructor(  private footerService: FooterService,
                private navbarService: NavbarService,
                private translate: TranslateService,
                private tellAboutYouService: TellAboutYouService,
                private router: Router) {

                  this.translate.use('en');
                 }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.tellAboutYouService.getDob()
  }
  goBack(){
    this.router.navigate([CORPBIZ_ROUTES_PATHS.GET_STARTED])
  }
  changeSlide($event) {
    this.sliderValid = { minAge: true, userAge: true };
    if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE) {
      $event.target.value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE;
    } else if ($event.target.value === '' || $event.target.value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) {
      this.sliderValid.minAge = false;
    }
    if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE ) {
      this.sliderValid.userAge = false;
    } else if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE
      && $event.target.value <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE ) {
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

