import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { AboutAge } from '../../shared/utils/about-age.util';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMySummaryModal, IRetirementPlan } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { COMPREHENSIVE_CONST } from './../comprehensive-config.constants';

@Component({
  selector: 'app-retirement-plan',
  templateUrl: './retirement-plan.component.html',
  styleUrls: ['./retirement-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RetirementPlanComponent implements OnInit, AfterViewInit {
  sliderValue = 45;
  pageTitle: any;
  pageId: string;
  menuClickSubscription: Subscription;
  summaryModalDetails: IMySummaryModal;
  retirementPlanForm: FormGroup;
  retireModal: any;
  summaryRouterFlag: boolean;
  routerEnabled = false;
  myAge: number;
  retirementDetails: IRetirementPlan;
  retirementValueChanges = false;
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
    }
  };
  constructor(private navbarService: NavbarService, private progressService: ProgressTrackerService,
              private translate: TranslateService,
              private formBuilder: FormBuilder, private configService: ConfigService,
              private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
              private router: Router, private route: ActivatedRoute, private age: AboutAge) {
    this.routerEnabled = this.summaryRouterFlag = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.ROUTER_CONFIG.STEP4;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_4_TITLE_NAV');
        this.setPageTitle(this.pageTitle);
        this.retireModal = this.translate.instant('CMP.MODAL.RETIREMENT_MODAL');
        if (this.route.snapshot.paramMap.get('summary') === 'summary' && this.summaryRouterFlag === true) {
          this.routerEnabled = !this.summaryRouterFlag;
          this.showSummaryModal();
        }
      });
    });
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    this.myAge = this.age.calculateAge(this.comprehensiveService.getMyProfile().dateOfBirth, new Date());
    this.sliderValue = this.comprehensiveService.getRetirementPlan() ? this.comprehensiveService.getRetirementPlan().retirementAge : 45;
    this.buildRetirementPlanForm();
  }
  ngAfterViewInit() {
    this.ciMultiplierSlider.writeValue(this.sliderValue);
  }
  buildRetirementPlanForm() {
    this.retirementPlanForm = new FormGroup({
      retirementAge: new FormControl(this.sliderValue),
    });
  }
  onSliderChange(value): void {
    this.sliderValue = value;
    this.retirementValueChanges = true;
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  goToNext(form: FormGroup) {
    form.value.enquiryId = this.comprehensiveService.getEnquiryId();
    form.value.retirementAge = this.sliderValue;
    this.comprehensiveService.setRetirementPlan(form.value);
    // if (this.retirementValueChanges) {
    //   this.comprehensiveApiService.saveRetirementPlanning( form.value).subscribe((data: any) => {

    //   });
    // }
    this.showSummaryModal();
  }
  showSummaryModal() {
    if (this.routerEnabled) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN + '/summary']);
    } else {
      this.summaryModalDetails = {
        setTemplateModal: 4,
        contentObj: this.retireModal,
        nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.RESULT),
        routerEnabled: this.summaryRouterFlag
      };
      this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
    }
  }
}
