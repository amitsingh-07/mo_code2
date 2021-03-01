import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from './../../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../../../investment/investment-common/investment-common.constants';
@Component({
  selector: 'app-wise-income-payout-type',
  templateUrl: './wise-income-payout-type.component.html',
  styleUrls: ['./wise-income-payout-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WiseIncomePayoutTypeComponent implements OnInit {

  @Input('payoutType') payoutType;
  payoutConst : any;

  constructor(private router: Router) { 
    this.payoutConst = INVESTMENT_COMMON_CONSTANTS.WISE_INCOME_PAYOUT;
  }

  ngOnInit(): void {
  }
  
  goReviewInputs() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WISE_INCOME_PAYOUT]);
  }

}
