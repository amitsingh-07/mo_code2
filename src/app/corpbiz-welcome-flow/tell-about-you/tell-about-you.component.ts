import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NouisliderComponent } from 'ng2-nouislider';
import { FormGroup, FormArray, FormBuilder, Validators, } from '@angular/forms';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { COMPREHENSIVE_CONST } from '../../comprehensive/comprehensive-config.constants';
import { CORPBIZ_ROUTES_PATHS } from '../corpbiz-welcome-flow.routes.constants';
import { ComprehensiveApiService } from '../../comprehensive/comprehensive-api.service';
import { TellAboutYouService } from '../tell-about-you.service';

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
  userAge: number = 50;
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
                private tellAboutYouService: TellAboutYouService,
                private router: Router,
                private fb: FormBuilder,
                private comprehensiveApiService: ComprehensiveApiService) {

                  this.translate.use('en');
                 }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.buildForm();
    this.getUserDob()
  }
  
  getUserDob(){
    this.comprehensiveApiService.getDob().subscribe(res=>{

    })
  }

  buildForm() {
    this.formObject = this.fb.group({
      retirementAge: [this.userAge > DEFAULT_RETIRE_AGE ? this.userAge: DEFAULT_RETIRE_AGE, [Validators.required]],
      cashInBank: [0, [Validators.required]]
    })
  }

  goBack(){
    this.router.navigate([CORPBIZ_ROUTES_PATHS.GET_STARTED])
  }
  changeSlide($event) {
    this.sliderValid = { minAge: true, userAge: true };
    this.retirementAgeValidaitions($event.target.value);
  }

  retirementAgeValidaitions(value) {
    if (value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE) {
      value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE;
    } else if (value === '' || value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) { 
      }
    if (value < this.userAge) {    // 51 < 58 = 51(with error)
      this.sliderValid.userAge = false;
      this.formObject.get('retirementAge').patchValue(value);
    } else if (value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE
      && value <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE ) {
        this.sliderValid.userAge = true;
      this.sliderValue = value;
      this.formObject.get('retirementAge').patchValue(value);
    }
  }

  onSliderChange(value): void {

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
