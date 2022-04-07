import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../../investment-common/investment-common.constants';
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

  goToNext(methodId) {
    if (methodId >= 0 && methodId <= 3) {
      // to QNA screen
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CKA_METHOD_BASED_QNA + '/' + INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[methodId]]);
    } else if (methodId == 4) {
      // to Upload screen
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_UPLOAD_DOCUMENT]);
    } else if (methodId == 5) {
      // to NA screen
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.NONE_OF_THE_ABOVE]);
    }
  }
}
