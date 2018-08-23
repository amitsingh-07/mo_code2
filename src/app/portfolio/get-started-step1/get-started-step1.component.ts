import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';

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

  constructor(public readonly translate: TranslateService, private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.title = this.translate.instant('GETSTARTED_STEP1.TITLE');
    });
  }

  ngOnInit() {
  }

  goNext() { 
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.PERSONAL_INFO]);
  }
}
