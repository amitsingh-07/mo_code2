
import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';

import { FormatCurrencyPipe } from '../../Pipes/format-currency.pipe';
import { INVESTMENT_COMMON_CONSTANTS } from '../../../investment/investment-common/investment-common.constants';

@Component({
  selector: 'app-portfolio-info',
  templateUrl: './portfolio-info.component.html',
  styleUrls: ['./portfolio-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioInfoComponent implements OnInit, OnChanges {

  @Input('portfolio') portfolio;
  @Input('wiseSaverDetails') wiseSaverDetails;
  

  portfolioProjectionSubText;
  isWiseSaverPortfolio: boolean;


  constructor(private formatCurrencyPipe: FormatCurrencyPipe) { }

  ngOnInit() {
    this.updateProjectionSubText();
    this.isWiseSaverPortfolio = (this.portfolio.portfolioType.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY_TYPE.WISESAVER);
  }

  ngOnChanges() {
    this.updateProjectionSubText();
  }

  updateProjectionSubText() {
    this.portfolioProjectionSubText = {
      best: this.formatCurrencyPipe.transform(this.portfolio.projectedReturnsHighEnd),
      median: this.formatCurrencyPipe.transform(this.portfolio.projectedReturnsMedian),
      worst: this.formatCurrencyPipe.transform(this.portfolio.projectedReturnsLowEnd),
      investedPercentage: this.portfolio.reviewedProjectedReturnsMedian
    };
  }
}
