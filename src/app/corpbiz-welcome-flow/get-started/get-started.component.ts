import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ComprehensiveApiService } from '../../comprehensive/comprehensive-api.service';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { CORPBIZ_ROUTES_PATHS } from '../corpbiz-welcome-flow.routes.constants';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedComponent implements OnInit {
  subscription: Subscription;

  constructor(
    private footerService: FooterService,
    private navbarService: NavbarService,
    private router: Router,
    private readonly translate: TranslateService,
    private comprehensiveApiService: ComprehensiveApiService,
    private authService: AuthenticationService
  ) {
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(106);
    this.footerService.setFooterVisibility(false);
    this.subscription = this.navbarService.preventBackButton().subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goNext() {
    this.comprehensiveApiService.getComprehensiveSummaryDashboard().subscribe((resp: any) => {
      if (resp && resp.objectList[0]) {
        this.router.navigate([CORPBIZ_ROUTES_PATHS.TELL_ABOUT_YOU]);
      } else {
        const promoCode = {
          sessionId: this.authService.getSessionId()
        };
        this.comprehensiveApiService.generateComprehensiveEnquiry(promoCode).subscribe((data: any) => {
          this.router.navigate([CORPBIZ_ROUTES_PATHS.TELL_ABOUT_YOU]);
        });
      }
    })
  }
}
