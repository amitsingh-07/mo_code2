import { Component, Input, OnInit, ViewEncapsulation, OnChanges } from '@angular/core';
import { ConfigService, IConfig } from './../../../config/config.service';
import { INVESTMENT_COMMON_CONSTANTS } from '../../../investment/investment-common/investment-common.constants';
import { PercentageInputDirective } from './../../../../../../../DEV2/bfa-frontend/src/app/shared/directives/percentage-input.directive';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-annual-fees',
  templateUrl: './annual-fees.component.html',
  styleUrls: ['./annual-fees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnualFeesComponent implements OnInit, OnChanges {
  @Input('feeDetails') feeDetails;
  @Input('portfolioType') portfolioType;
  isInvestmentEnabled = false;
  portfolioTypeFlag: boolean;
  feeDetailsValues;
  fundExpensiveTranslater;

  constructor(private configService: ConfigService,
    public readonly translate: TranslateService,) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isInvestmentEnabled = config.investmentEnabled;
    });
  }

  ngOnInit() {
    this.portfolioTypeFlag = (this.portfolioType.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.WISESAVER_ASSET_ALLOCATION.TYPE);
  }
  ngOnChanges() {
    this.feeDetailsValues = [];
    this.feeDetails.forEach(fee => {
      if (fee.feeName !== this.translate.instant('PORTFOLIO_RECOMMENDATION.FUND_EXPENSIVE_RATIO')
            && fee.feeName !== this.translate.instant('PORTFOLIO_RECOMMENDATION.TOTAL_FEE')) {
        this.feeDetailsValues.push(fee);
        return this.feeDetailsValues;
      } else if (fee.feeName === this.translate.instant('PORTFOLIO_RECOMMENDATION.FUND_EXPENSIVE_RATIO')) {
        this.fundExpensiveTranslater = {
          expensiveRatio: fee.percentage
        };
        return this.fundExpensiveTranslater;
      }
    });
  }
}
