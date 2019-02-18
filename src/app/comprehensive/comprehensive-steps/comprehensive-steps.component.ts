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
  constructor(private route: ActivatedRoute, private router: Router, private navbarService: NavbarService,
              private translate: TranslateService, private configService: ConfigService) {
              this.configService.getConfig().subscribe((config: any) => {
              this.translate.setDefaultLang(config.language);
              this.translate.use(config.language);
              this.translate.get(config.common).subscribe((result: string) => {
              // meta tag and title
              this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');
              });
              });

              // tslint:disable-next-line:radix
              this.step = parseInt(this.route.snapshot.paramMap.get('stepNo'));

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
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
