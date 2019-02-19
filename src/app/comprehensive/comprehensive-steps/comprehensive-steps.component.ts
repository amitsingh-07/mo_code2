import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-comprehensive-steps',
  templateUrl: './comprehensive-steps.component.html',
  styleUrls: ['./comprehensive-steps.component.scss']
})
export class ComprehensiveStepsComponent implements OnInit {
  pageTitle: string;
  step: number;
  url: string;
  pageId: string;
  constructor(private route: ActivatedRoute, private router: Router, private navbarService: NavbarService,
              private translate: TranslateService, private configService: ConfigService) {
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
              this.pageId = this.route.routeConfig.component.name;

  }
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, {id: this.pageId, iconClass: 'navbar__menuItem--journey-map'});
  }

  goToNext(step) {
    switch (step) {
      case 1:
      this.url = COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION;
      break;
      case 2:
      break;

    }
    this.router.navigate([this.url]);
  }
}
