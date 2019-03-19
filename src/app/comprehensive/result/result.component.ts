import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTES } from '../../sign-up/sign-up.routes.constants';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  pageId: string;
  pageTitle: string;
  menuClickSubscription: Subscription;
  constructor(private activatedRoute: ActivatedRoute, public navbarService: NavbarService,
              private translate: TranslateService,
              private configService: ConfigService, private router: Router) {
    this.pageId = this.activatedRoute.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_5_TITLE_NAV');
        this.setPageTitle(this.pageTitle);
      });
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  goToNext() {
    this.router.navigate([SIGN_UP_ROUTES.DASHBOARD]);
  }
}
