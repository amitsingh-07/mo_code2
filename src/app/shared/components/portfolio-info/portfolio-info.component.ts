import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-portfolio-info',
  templateUrl: './portfolio-info.component.html',
  styleUrls: ['./portfolio-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioInfoComponent implements OnInit {

  @Input('portfolio') portfolio;

  portfolioProjectionSubText;

  constructor(private currencyPipe: CurrencyPipe) { }

  ngOnInit() {

    this.portfolioProjectionSubText = {
      best: this.currencyPipe.transform(this.portfolio.projectedReturnsHighEnd, 'USD', 'symbol-narrow', '1.0-2'),
      median: this.currencyPipe.transform(this.portfolio.projectedReturnsMedian, 'USD', 'symbol-narrow', '1.0-2'),
      worst: this.currencyPipe.transform(this.portfolio.projectedReturnsLowEnd, 'USD', 'symbol-narrow', '1.0-2'),
    };
  }

}
