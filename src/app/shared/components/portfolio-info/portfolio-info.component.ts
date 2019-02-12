import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-portfolio-info',
  templateUrl: './portfolio-info.component.html',
  styleUrls: ['./portfolio-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioInfoComponent implements OnInit, OnChanges {

  @Input('portfolio') portfolio;

  portfolioProjectionSubText;

  constructor(private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.updateProjectionSubText();
  }

  ngOnChanges() {
    this.updateProjectionSubText();
  }

  updateProjectionSubText() {
    this.portfolioProjectionSubText = {
      best: this.currencyPipe.transform(this.portfolio.projectedReturnsHighEnd, 'USD', 'symbol-narrow', '1.2-2'),
      median: this.currencyPipe.transform(this.portfolio.projectedReturnsMedian, 'USD', 'symbol-narrow', '1.2-2'),
      worst: this.currencyPipe.transform(this.portfolio.projectedReturnsLowEnd, 'USD', 'symbol-narrow', '1.2-2'),
    };
  }
}
