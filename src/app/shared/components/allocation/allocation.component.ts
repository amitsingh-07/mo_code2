import { FundDetailsComponent } from 'src/app/portfolio/fund-details/fund-details.component';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';

import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllocationComponent implements OnInit, OnChanges {
  @Input('assets') assets;
  @Input('funds') funds;
  @Input('colors') colors;

  event1 = true;
  event2 = true;

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    public modal: NgbModal) { }

  ngOnInit() {
  }

  ngOnChanges() {
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


  showFundDetails() {
    this.portfolioService.setFundDetails(this.funds);
    const ref = this.modal.open(FundDetailsComponent, { centered: true, windowClass: 'full-height' });
    return false;
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
