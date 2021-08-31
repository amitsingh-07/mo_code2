import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';

@Component({
  selector: 'app-select-portfolio-type',
  templateUrl: './select-portfolio-type.component.html',
  styleUrls: ['./select-portfolio-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectPortfolioTypeComponent implements OnInit {

  isPersonalAccount: boolean;
  portfolioType: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log("account type", this.portfolioType);
  }

  goToNext() {
    this.portfolioType === 1 ? this.isPersonalAccount = true : this.isPersonalAccount = false;
    this.isPersonalAccount ? this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.ADD_SECONDARY_HOLDER_DETAILS]) : this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
  }
}
