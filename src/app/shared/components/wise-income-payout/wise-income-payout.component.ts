import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from './../../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';

@Component({
  selector: 'app-wise-income-payout',
  templateUrl: './wise-income-payout.component.html',
  styleUrls: ['./wise-income-payout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WiseIncomePayoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  goReviewInputs() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
  }

}
