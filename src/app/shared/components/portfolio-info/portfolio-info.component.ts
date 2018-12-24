import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-portfolio-info',
  templateUrl: './portfolio-info.component.html',
  styleUrls: ['./portfolio-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioInfoComponent implements OnInit {
  portfolioProjectionSubText;

  constructor() { }

  ngOnInit() {

    this.portfolioProjectionSubText = {
      best: 1286079,
      median: 1265342,
      worst: 299200
    };
  }

}
