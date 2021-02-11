import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from './../../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';

@Component({
  selector: 'app-wise-income-fund',
  templateUrl: './wise-income-fund.component.html',
  styleUrls: ['./wise-income-fund.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WiseIncomeFundComponent implements OnInit {

  constructor(private router: Router) { }
  @Input('investmentInput') investmentInput;

  ngOnInit(): void {
    console.log(this.investmentInput);
  }

  goReviewInputs() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
  }

}
