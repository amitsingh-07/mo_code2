import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-portfolio-info',
  templateUrl: './portfolio-info.component.html',
  styleUrls: ['./portfolio-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioInfoComponent implements OnInit {

  @Input('portfolioName') portfolioName;
  @Input('projectedReturns') projectedReturns;
  @Input('investmentDetail') investmentDetail;

  portfolioProjectionSubText;

  constructor() { }

  ngOnInit() {

    this.portfolioProjectionSubText = {
      best: this.projectedReturns[0],
      median: this.projectedReturns[1],
      worst: this.projectedReturns[2]
    };
  }

}
