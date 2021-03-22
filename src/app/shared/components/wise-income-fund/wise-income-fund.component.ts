import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from './../../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';
import { InvestmentAccountService } from '../../../investment/investment-account/investment-account-service';
import { InvestmentCommonService } from '../../../investment/investment-common/investment-common.service';

@Component({
  selector: 'app-wise-income-fund',
  templateUrl: './wise-income-fund.component.html',
  styleUrls: ['./wise-income-fund.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WiseIncomeFundComponent implements OnInit {

  @Input('portfolio') portfolio;
  @Input('investmentInput') investmentInput;
  

  constructor(private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private investmentCommonService: InvestmentCommonService) { }

  ngOnInit(): void {
  }

  goReviewInputs() {
    this.investmentAccountService.activateReassess();
    this.investmentCommonService.saveUpdateSessionData(this.portfolio);
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
  }

}
