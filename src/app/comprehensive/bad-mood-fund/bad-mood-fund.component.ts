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
  SliderValue = 0;
  bucketImage: string;
  @ViewChild('ciMultiplierSlider') ciMultiplierSlider: NouisliderComponent;
  pageTitle: any;
  pageId: string;
  menuClickSubscription: Subscription;
  pageSubTitle: string;
  totalAnnualIncomeBucket = 0;
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
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  onSliderChange(value): void {
    this.SliderValue = value;
    this.totalAnnualIncomeBucket = this.SliderValue * 12;
  }
  ngOnInit() {
    this.downOnLuck = this.comprehensiveService.getDownOnLuck();

    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    this.hospitalPlanForm = new FormGroup({
      hospitalPlanId: new FormControl(this.downOnLuck.hospitalPlanId + '', Validators.required),
      badMoodMonthlyAmount: new FormControl(this.downOnLuck ?
        this.downOnLuck.badMoodMonthlyAmount : 0, Validators.required)
    });
    this.SliderValue = this.hospitalPlanForm.value.badMoodMonthlyAmount ? this.hospitalPlanForm.value.badMoodMonthlyAmount : 0;
    if (this.downOnLuck.hospitalPlanId) {
      this.isFormValid = true;
    }

    this.hospitalPlanList = this.comprehensiveService.getHospitalPlan();

    if (this.hospitalPlanList.length === 0) {
      this.apiService.getHospitalPlanList().subscribe((hospitalPlanData: any) => {
        this.hospitalPlanList = hospitalPlanData.objectList;
        this.comprehensiveService.setHospitalPlan(hospitalPlanData.objectList);
      });
    }
    this.comprehensiveService.hasBadMoodFund();
    this.maxBadMoodFund = Math.floor((this.comprehensiveService.getMyEarnings().totalAnnualIncomeBucket
      - this.comprehensiveService.getMySpendings().totalAnnualExpenses) / 12);
    if (this.maxBadMoodFund > 0) {
      this.hasBadMoodFund = true;
      this.totalAnnualIncomeBucket = this.downOnLuck.badMoodMonthlyAmount * 12;

    }

  }

  ngAfterViewInit() {
    if (this.hasBadMoodFund) {
      this.ciMultiplierSlider.writeValue(this.downOnLuck.badMoodMonthlyAmount);
    }
  }
  validateForm(hospitalPlan) {
    this.downOnLuck = {
      hospitalClass: hospitalPlan.hospitalClass,
      hospitalClassDescription: hospitalPlan.hospitalClassDescription,
      hospitalPlanId: hospitalPlan.id
    } as HospitalPlan;
    this.isFormValid = true;
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }
  goToNext(form) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS]);
    } else {
      if (this.isFormValid) {
        form.value.badMoodMonthlyAmount = this.SliderValue;
        form.value.hospitalClass = this.downOnLuck.hospitalClass;
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
