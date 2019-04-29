import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subscription } from 'rxjs';

import { LoaderService } from '../../shared/components/loader/loader.service';
import { ApiService } from '../../shared/http/api.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { HospitalPlan, IHospitalPlanList } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-bad-mood-fund',
  templateUrl: './bad-mood-fund.component.html',
  styleUrls: ['./bad-mood-fund.component.scss']
})
export class BadMoodFundComponent implements OnInit, OnDestroy, AfterViewInit {
  sliderValue = 0;
  bucketImage: string;
  @ViewChild('ciMultiplierSlider') ciMultiplierSlider: NouisliderComponent;
  pageTitle: any;
  pageId: string;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  pageSubTitle: string;
  totalAnnualIncomeBucket: number;
  hospitalPlanForm: FormGroup;
  downOnLuck: HospitalPlan;
  maxBadMoodFund: number;
  hasBadMoodFund: boolean;
  hospitalPlanList: IHospitalPlanList[];
  isFormValid = false;
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
    }
  };
  viewMode: boolean;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private loaderService: LoaderService, private apiService: ApiService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService
  ) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
        this.bucketImage = this.translate.instant('CMP.YOUR_FINANCES.BAD_MOOD_FUND_BUCKET');
        this.setPageTitle(this.pageTitle);
      });
    });
    this.viewMode = this.comprehensiveService.getViewableMode();
    this.maxBadMoodFund = this.comprehensiveService.computeBadMoodFund();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  onSliderChange(value): void {
    this.sliderValue = value;
    this.totalAnnualIncomeBucket = this.sliderValue * 12;
  }
  ngOnInit() {
    this.updateProgressTracker();
    this.buildDownOnLuckForm();
  }
  updateProgressTracker() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        const previousUrl = this.comprehensiveService.getPreviousUrl(this.router.url);
        if (previousUrl !== null) {
          this.router.navigate([previousUrl]);
        } else {
          this.navbarService.goBack();
        }
      }
    });
  }
  buildDownOnLuckForm() {
    this.downOnLuck = this.comprehensiveService.getDownOnLuck();
    this.hospitalPlanForm = new FormGroup({
      hospitalPlanId: new FormControl(this.downOnLuck.hospitalPlanId + '', Validators.required),
      badMoodMonthlyAmount: new FormControl(this.downOnLuck ?
        this.downOnLuck.badMoodMonthlyAmount : 0, Validators.required)
    });
    this.sliderValue = this.hospitalPlanForm.value.badMoodMonthlyAmount ? this.hospitalPlanForm.value.badMoodMonthlyAmount : 0;
    if (this.downOnLuck.hospitalPlanId) {
      this.isFormValid = true;
    }

    this.hospitalPlanList = this.comprehensiveService.getHospitalPlan();

    if (this.hospitalPlanList.length === 0) {
      this.apiService.getHospitalPlanList('journeyType=comprehensive').subscribe((hospitalPlanData: any) => {
        this.hospitalPlanList = hospitalPlanData.objectList;
        this.comprehensiveService.setHospitalPlan(hospitalPlanData.objectList);
      });
    }
    if (this.maxBadMoodFund > 0) {
      this.hasBadMoodFund = true;
      this.totalAnnualIncomeBucket = this.downOnLuck.badMoodMonthlyAmount ? this.downOnLuck.badMoodMonthlyAmount * 12 : 0;

    }

  }
  ngAfterViewInit() {
    if (this.hasBadMoodFund) {
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    } else {
      this.ciMultiplierSlider.writeValue(0);
    }
  }
  validateForm(hospitalPlan) {
    this.downOnLuck = {
      hospitalPlanName: hospitalPlan.hospitalClass,
      hospitalClassDescription: hospitalPlan.hospitalClassDescription,
      hospitalPlanId: hospitalPlan.id
    } as HospitalPlan;
    this.isFormValid = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
  }

  goToNext(form) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS]);
    } else {
      if (this.isFormValid) {
        form.value.badMoodMonthlyAmount = this.sliderValue;
        form.value.hospitalPlanName = this.downOnLuck.hospitalPlanName;
        form.value.enquiryId = this.comprehensiveService.getComprehensiveSummary().comprehensiveEnquiry.enquiryId;
        this.comprehensiveService.setDownOnLuck(form.value);
        this.comprehensiveApiService.saveDownOnLuck(form.value).subscribe((data:
          any) => {
        });
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS]);
      } else {
        const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.DOWN_ON_LUCK);
        this.comprehensiveService.openErrorModal(
          error.title,
          error.errorMessages,
          false,
          ''
        );
      }
    }
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.YOUR_FINANCES.TOOLTIP.' + toolTipTitle),
      DESCRIPTION: this.translate.instant('CMP.YOUR_FINANCES.TOOLTIP.' + toolTipMessage)
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
}
