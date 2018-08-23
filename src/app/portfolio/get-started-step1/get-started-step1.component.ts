import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { HeaderService } from '../../shared/header/header.service';

@Component({
  selector: 'app-get-started-step1',
  templateUrl: './get-started-step1.component.html',
  styleUrls: ['./get-started-step1.component.scss']
})
export class GetStartedStep1Component implements OnInit {

  //title = "Step 1";
  pageTitle: string;
  title = this.translate.instant('INSURANCE_RESULTS.TITLE');
  description = "Get Started";
  img = "assets/images/checklist-icon.svg";
  description2 = "In the next step,we are going to assess your ability to take risk";
  tab = "1";

  constructor(public readonly translate: TranslateService, private router: Router,
    public headerService: HeaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.title = this.translate.instant('GETSTARTED_STEP1.TITLE');
    });
  }

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
  }

  goNext() { 
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.PERSONAL_INFO]);
  }
}
