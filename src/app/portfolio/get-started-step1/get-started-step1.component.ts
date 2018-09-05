import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-get-started-step1',
  templateUrl: './get-started-step1.component.html',
  styleUrls: ['./get-started-step1.component.scss']
})
export class GetStartedStep1Component implements OnInit {

  pageTitle: string;
  title = this.translate.instant('INSURANCE_RESULTS.TITLE');
  description = this.translate.instant('GETSTARTED_STEP1.CAPTION');
  img = 'assets/images/checklist-icon.svg';
  description2 =  this.translate.instant('GETSTARTED_STEP1.DESCRIPTION');
  tab = '1';

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    public headerService: HeaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.title = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.description = this.translate.instant('GETSTARTED_STEP1.CAPTION');
      this.description2 = this.translate.instant('GETSTARTED_STEP1.DESCRIPTION');
    });
  }

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);

    this.authService.authenticate().subscribe((token) => {
     console.log(token);
    });
  }

  goNext() {
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.PERSONAL_INFO]);
  }
}
