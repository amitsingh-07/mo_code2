import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { FooterService } from '../../shared/footer/footer.service';
@Component({
  selector: 'app-get-started-step2',
  templateUrl: './get-started-step2.component.html',
  styleUrls: ['./get-started-step2.component.scss']
})
export class GetStartedStep2Component implements OnInit {
  title = this.translate.instant('GETSTARTED_STEP2.TITLE');
  description = this.translate.instant('GETSTARTED_STEP2.CAPTION');
  img = 'assets/images/step-2-icon.svg';
  description2 = this.translate.instant('GETSTARTED_STEP2.DESCRIPTION');
  tab = '2';

  constructor(
    public readonly translate: TranslateService,
    public navbarService: NavbarService,
    private router: Router,
    public headerService: HeaderService,
    public footerService: FooterService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.title = this.translate.instant('GETSTARTED_STEP2.TITLE');
      this.description = this.translate.instant('GETSTARTED_STEP2.CAPTION');
      this.description2 = this.translate.instant('GETSTARTED_STEP2.DESCRIPTION');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
    this.footerService.setFooterVisibility(false);
  }

  goNext() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.RISK_ASSESSMENT]);
  }

}
