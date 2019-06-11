import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMySummaryModal, IRetirementPlan } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { AboutAge } from './../../shared/utils/about-age.util';
import { COMPREHENSIVE_CONST } from './../comprehensive-config.constants';

@Component({
  selector: 'app-retirement-plan',
  templateUrl: './retirement-plan.component.html',
  styleUrls: ['./retirement-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RetirementPlanComponent implements OnInit, AfterViewInit, OnDestroy {
  sliderValue = 45;
  pageTitle: any;
  pageId: string;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  summaryModalDetails: IMySummaryModal;
  retirementPlanForm: FormGroup;
  retireModal: any;
  summaryRouterFlag: boolean;
  routerEnabled = false;
  retirementDetails: IRetirementPlan;
  retirementValueChanges = false;
  viewMode: boolean;
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
    pips: {
      mode: 'values',
      values: [45, 50, 55, 60, 65],
      density: 4
    }
  };
  userAge: number;
  constructor(private navbarService: NavbarService, private progressService: ProgressTrackerService,
    private translate: TranslateService, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private router: Router, private route: ActivatedRoute, private aboutAge: AboutAge,
    private eleRef: ElementRef, private renderer: Renderer2) {
    this.routerEnabled = this.summaryRouterFlag = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.ROUTER_CONFIG.STEP4;
    this.pageId = this.route.routeConfig.component.name;
    this.viewMode = this.comprehensiveService.getViewableMode();
    this.userAge = this.aboutAge.calculateAge(this.comprehensiveService.getMyProfile().dateOfBirth, new Date());
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

    this.sliderValue = this.comprehensiveService.getRetirementPlan() ?
      parseInt(this.comprehensiveService.getRetirementPlan().retirementAge) : 45;
    this.buildRetirementPlanForm();
  }
  ngAfterViewInit() {
    const containerRef = this.eleRef.nativeElement.querySelector('.noUi-value:last-child');
    this.renderer.setProperty(containerRef, 'innerHTML', '62 or later');
    this.renderer.addClass(containerRef, 'lastSliderPips');
    /*if (this.sliderValue > 61) {
      this.sliderValue = 62;
      this.ciMultiplierSlider.writeValue(65);
    } else */
    if (this.sliderValue >= 45 && this.sliderValue < this.userAge) {
      const sliderValue = Math.ceil(this.userAge / 5) * 5;
      this.ciMultiplierSlider.writeValue(sliderValue);
    } else {
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    }
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.subscription.unsubscribe();
  }
  buildRetirementPlanForm() {
    this.retirementPlanForm = new FormGroup({
      retirementAge: new FormControl(this.sliderValue),
    });
  }
  onSliderChange(value): void {
    this.sliderValue = value;
    this.retirementValueChanges = true;
    /*if (this.sliderValue > 61) {
      this.sliderValue = 62;
      this.ciMultiplierSlider.writeValue(65);
    } else */
    if (this.sliderValue >= 45 && this.sliderValue < this.userAge) {
      this.sliderValue = Math.ceil(this.userAge / 5) * 5;
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    }
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  goToNext(form: FormGroup) {
    if (this.viewMode) {
      this.showSummaryModal();
    } else {
      const cmpSummary = this.comprehensiveService.getComprehensiveSummary();
      if (this.retirementValueChanges || cmpSummary.comprehensiveRetirementPlanning === null) {
        const retirementData = {
          enquiryId: this.comprehensiveService.getEnquiryId(),
          retirementAge: this.sliderValue.toString()
        };
        this.comprehensiveApiService.saveRetirementPlanning(retirementData).subscribe((data: any) => {
          this.comprehensiveService.setRetirementPlan(retirementData);
          this.showSummaryModal();
        });
      } else {
        this.showSummaryModal();
      }
    }
  }
  showSummaryModal() {
    if (this.routerEnabled) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN + '/summary']);
    } else {
      this.summaryModalDetails = {
        setTemplateModal: 4,
        contentObj: this.retireModal,
        nextPageURL: (this.viewMode) ? (COMPREHENSIVE_ROUTE_PATHS.DASHBOARD) : (COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT),
        routerEnabled: this.summaryRouterFlag
      };
      this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
    }
  }
}
