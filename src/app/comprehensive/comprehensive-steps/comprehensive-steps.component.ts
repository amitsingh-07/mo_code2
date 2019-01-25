import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-comprehensive-steps',
  templateUrl: './comprehensive-steps.component.html',
  styleUrls: ['./comprehensive-steps.component.scss']
})
export class ComprehensiveStepsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private navbarService: NavbarService,
              private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {

    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
  }
  proceed() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION]);
  }
}
