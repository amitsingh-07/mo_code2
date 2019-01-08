import { PortfolioService } from 'src/app/portfolio/portfolio.service';

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../../../topup-and-withdraw/topup-and-withdraw-routes.constants';

import { PORTFOLIO_ROUTE_PATHS } from '../../../portfolio/portfolio-routes.constants';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllocationComponent implements OnInit {
  @Input('assets') assets;
  @Input('funds') funds;
  @Input('colors') colors;

  event1 = true;
  event2 = true;

  constructor(
    private portfolioService: PortfolioService,
    private router: Router) { }

  ngOnInit() {
    this.assets.forEach((allocation) => {
      const groupedAllocation = this.groupByProperty(allocation.groupedAllocationDetails);
      allocation.groupedAllocationDetails = groupedAllocation;
    });
  }

  groupByProperty(targetObj) {
    const assetKeys = Object.keys(targetObj);
    const groupObjects = [];
    for (const prop of assetKeys) {
      const classObj = {
        name: prop,
        value: targetObj[prop]
      };
      groupObjects.push(classObj);
    }
    return groupObjects;
  }

  viewFundDetails() {
    this.portfolioService.setFundDetails(this.funds);
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.FUND_DETAILS]);
  }

  // accordian
  test(event) {
    event === 'event1' ? this.event1 = !this.event1 : '';
    event === 'event2' ? this.event2 = !this.event2 : '';
  }

  showHidePanel(accordionEle, panelId, panelHeadEle) {
    accordionEle.toggle(panelId);
    if(panelHeadEle.currentTarget.classList.contains('active') ) { // Opened State
      panelHeadEle.currentTarget.classList.remove('active');
    } else { // Closed State
      panelHeadEle.currentTarget.classList.add('active');
    }

  }
}
