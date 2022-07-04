import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NouisliderComponent } from 'ng2-nouislider';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { COMPREHENSIVE_CONST } from '../../comprehensive/comprehensive-config.constants';
import { CORPBIZ_ROUTES_PATHS } from '../corpbiz-welcome-flow.routes.constants';
import { ComprehensiveApiService } from '../../comprehensive/comprehensive-api.service';
import { AboutAge } from '../../shared/utils/about-age.util';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ComprehensiveService } from '../../comprehensive/comprehensive.service';

const DEFAULT_RETIRE_AGE = 55;
@Component({
  selector: 'app-tell-about-you',
  templateUrl: './tell-about-you.component.html',
  styleUrls: ['./tell-about-you.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TellAboutYouComponent implements OnInit {
  formObject: FormGroup;
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
                private aboutAge: AboutAge,
                private router: Router,
                private fb: FormBuilder,
                private comprehensiveApiService: ComprehensiveApiService,
                private authService: AuthenticationService,
                private comprehensiveService: ComprehensiveService) {

                  this.translate.use('en');
                 }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(106);
    this.footerService.setFooterVisibility(false);
    this.buildForm();
    this.getUserDob();
  }
  
  getUserDob() {
    this.comprehensiveApiService.getUserDob().subscribe(res=> {
      if (res && res['objectList'][0].dateOfBirth) {
        this.userAge = this.aboutAge.calculateAgeByYear(
          res['objectList'][0].dateOfBirth,
          new Date()
        )
        const sliderValue = this.userAge > DEFAULT_RETIRE_AGE ? this.userAge: DEFAULT_RETIRE_AGE;
        this.ciMultiplierSlider.writeValue(sliderValue);
        this.sliderValue = sliderValue;
        this.formObject.get('retirementAge').patchValue(sliderValue);
      }
    })
  }

  buildForm() {
    this.formObject = this.fb.group({
      retirementAge: [0, [Validators.required]],
      cashInBank: [0, [Validators.required]],
      sessionId: this.authService.getSessionId()
    })
  }

  goBack(){
    this.router.navigate([CORPBIZ_ROUTES_PATHS.GET_STARTED])
  }

  onSliderChange(value): void {
    this.sliderValid = { minAge: true, userAge: true };
    this.sliderValue = value;
    if (this.sliderValue >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE && this.sliderValue < this.userAge) {
      this.sliderValid.userAge = false;
    } else if (this.sliderValue >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE
      && this.sliderValue <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE && this.sliderValue >= this.userAge) {
      this.sliderValue = this.sliderValue;
      this.ciMultiplierSlider.writeValue(this.sliderValue);
      this.formObject.get('retirementAge').patchValue(this.sliderValue);
    }
  }

  changeSlide($event) {
    this.sliderValid = { minAge: true, userAge: true };
    if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE) {
      $event.target.value = COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE;
    } else if ($event.target.value === '' || $event.target.value < COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE) {
      this.sliderValid.minAge = false;
    }
    if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE && $event.target.value < this.userAge) {
      this.sliderValid.userAge = false;
    } else if ($event.target.value >= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MIN_AGE
      && $event.target.value <= COMPREHENSIVE_CONST.RETIREMENT_PLAN.MAX_AGE && $event.target.value >= this.userAge) {
      this.ciMultiplierSlider.writeValue($event.target.value);
      this.sliderValue = $event.target.value;
      this.formObject.get('retirementAge').patchValue(this.sliderValue);
    }
  }

  generateReport() {
  if (this.sliderValid.minAge && this.sliderValid.userAge) {
      let payload = this.formObject.value;
      payload.retirementAge = payload.retirementAge.toString();
      payload.cashInBank = parseFloat((payload.cashInBank).toFixed(2));
      this.comprehensiveApiService.generateReport(payload).subscribe(res => {
        if (res.responseMessage && res.responseMessage.responseCode == 6000) {
          this.comprehensiveService.cpfPayoutAmount = res.objectList.monthlyPayout;
          this.comprehensiveService.welcomeFlowRetirementAge = payload.retirementAge;
          this.comprehensiveService.welcomeFlowMyInfoData = res.objectList;
          this.authService.clearWelcomeFlowFlag();
          this.router.navigate([CORPBIZ_ROUTES_PATHS.LIFE_PAYOUT]);
        }
      })
    }
  }

}
