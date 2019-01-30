import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from './../../config/config.service';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';

import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-comprehensive',
  templateUrl: './comprehensive.component.html',
  styleUrls: ['./comprehensive.component.scss']
})
export class ComprehensiveComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, public translate: TranslateService,
              public navbarService: NavbarService, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {

    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
  }
  start() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.STEPS]);
  }
}
