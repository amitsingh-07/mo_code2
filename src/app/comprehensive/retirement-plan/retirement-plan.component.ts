import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { ComprehensiveService } from '../comprehensive.service';
import { IMySummaryModal } from '../comprehensive-types';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';

@Component({
  selector: 'app-retirement-plan',
  templateUrl: './retirement-plan.component.html',
  styleUrls: ['./retirement-plan.component.scss']
})
export class RetirementPlanComponent implements OnInit , AfterViewInit {
  SliderValue = 45;
  pageTitle: any;
  pageId: string;
  menuClickSubscription: Subscription;
  summaryModalDetails: IMySummaryModal;
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
  constructor(private navbarService: NavbarService,  private progressService: ProgressTrackerService,
              private translate: TranslateService,
              private formBuilder: FormBuilder, private configService: ConfigService,
              private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService, ) {

    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_4_TITLE_NAV');
        this.setPageTitle(this.pageTitle);
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
  }
  ngAfterViewInit() {
    this.ciMultiplierSlider.writeValue(45);
    this.SliderValue = 45;
  }
  onSliderChange(value): void {
    this.SliderValue = value;
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  goToNext(SliderValue) {
    const retireModal = this.translate.instant('CMP.MODAL.RETIREMENT_MODAL');
    this.summaryModalDetails = {
            setTemplateModal: 4,
            contentObj: retireModal,
            nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.RESULT)
        };
    this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
  }
}
