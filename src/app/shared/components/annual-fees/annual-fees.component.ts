import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfigService, IConfig } from './../../../config/config.service';
import { INVESTMENT_COMMON_CONSTANTS } from '../../../investment/investment-common/investment-common.constants';

@Component({
  selector: 'app-annual-fees',
  templateUrl: './annual-fees.component.html',
  styleUrls: ['./annual-fees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnualFeesComponent implements OnInit {
  @Input('feeDetails') feeDetails;
  @Input('portfolioType') portfolioType;
  isInvestmentEnabled = false;
  portfolioTypeFlag: boolean;

  constructor(private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isInvestmentEnabled = config.investmentEnabled;
    });
  }

  ngOnInit() {
    this.portfolioTypeFlag = (this.portfolioType.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.WISESAVER_ASSET_ALLOCATION.TYPE);
  }

}
