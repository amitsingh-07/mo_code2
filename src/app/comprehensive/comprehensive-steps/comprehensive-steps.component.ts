import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-comprehensive-steps',
  templateUrl: './comprehensive-steps.component.html',
  styleUrls: ['./comprehensive-steps.component.scss']
})
export class ComprehensiveStepsComponent implements OnInit, OnDestroy {
  pageTitle: string;
  step: number;
  url: string;
  pageId: string;
  menuClickSubscription: Subscription;
  constructor(
    private route: ActivatedRoute, private router: Router, private navbarService: NavbarService,
    private translate: TranslateService, private configService: ConfigService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.ROAD_MAP.TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });

    // tslint:disable-next-line:radix
    this.step = parseInt(this.route.snapshot.paramMap.get('stepNo'));

  }
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Road Map 1 Menu Clicked');
      }
    });
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }

  goToNext(step) {
    switch (step) {
      case 1:
        this.url = COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION;
        break;
      case 2:
        this.url = COMPREHENSIVE_ROUTE_PATHS.MY_EARNINGS;
        break;
    }
    this.router.navigate([this.url]);
  }
}
