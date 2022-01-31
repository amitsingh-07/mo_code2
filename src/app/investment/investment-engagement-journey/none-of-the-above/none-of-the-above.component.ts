import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES, INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { SIGN_UP_ROUTES, SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';

@Component({
  selector: 'app-none-of-the-above',
  templateUrl: './none-of-the-above.component.html',
  styleUrls: ['./none-of-the-above.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoneOfTheAboveComponent implements OnInit {
  pageTitle: string;
  constructor(
    public readonly translate: TranslateService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    public investmentCommonService: InvestmentCommonService,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('NONE_OF_THE_ABOVE.PAGE_TITLE');
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

  backToProfile(){
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
  }

  uploadCertificate(){
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_UPLOAD_DOCUMENT]);
  }
  changeRedirectLocationBtn() {
    const redirectURL = this.investmentCommonService.getCKARedirectFromLocation();
    const index = redirectURL ? redirectURL.indexOf(SIGN_UP_ROUTES.EDIT_PROFILE) : -1;
    if(index >= 0) {
      return true
    }
    return false;
  }
}
