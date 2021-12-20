import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES, INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
@Component({
  selector: 'app-cka-assessment',
  templateUrl: './cka-assessment.component.html',
  styleUrls: ['./cka-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CkaAssessmentComponent implements OnInit {
  pageTitle: string;
  constructor(
    public readonly translate: TranslateService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CKA_ASSESSMENT.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
    });
   }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  noneOfTheAbove(){
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.NONE_OF_THE_ABOVE]);
  }

  uploadDoc() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_UPLOAD_DOCUMENT]);
  }
}
