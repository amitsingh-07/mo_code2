import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FundDetailsComponent } from '../../../investment/investment-common/fund-details/fund-details.component';
import { InvestmentEngagementJourneyService } from '../../../investment/investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_COMMON_CONSTANTS } from '../../../investment/investment-common/investment-common.constants';

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
  @Input('portfolioType') portfolioType;

  event1 = true;
  event2 = true;
  allocationDetails: boolean;

  constructor(
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private router: Router,
    public modal: NgbModal
  ) {}

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.portfolioType === INVESTMENT_COMMON_CONSTANTS.WISESAVER_ASSET_ALLOCATION.TYPE) {
      this.assets = INVESTMENT_COMMON_CONSTANTS.WISESAVER_ASSET_ALLOCATION.ASSETS;
      this.allocationDetails = false;
    } else if (this.assets) {
      this.assets.forEach((allocation) => {
        allocation.groupedAllocationDetails = this.groupByProperty(allocation.groupedAllocationDetails);
      });
      this.allocationDetails = true;
    }
  }

  groupByProperty(targetObj) {
    const assetKeys = Object.keys(targetObj);
    const groupObjects = [];
    for (const prop of assetKeys) {
      this.investmentEngagementJourneyService.sortByProperty(targetObj[prop], 'percentage', 'desc');
      const classObj = {
        name: prop,
        value: targetObj[prop]
      };
      groupObjects.push(classObj);
    }
    return groupObjects;
  }

  showFundDetails() {
    this.investmentEngagementJourneyService.setFundDetails(this.funds);
    const ref = this.modal.open(FundDetailsComponent, {
      centered: true,
      windowClass: 'custom-full-height'
    });
    return false;
  }

  showHidePanel(accordionEle, panelId, panelHeadEle) {
    accordionEle.toggle(panelId);
    if (panelHeadEle.currentTarget.classList.contains('active')) {
      // Opened State
      panelHeadEle.currentTarget.classList.remove('active');
    } else {
      // Closed State
      panelHeadEle.currentTarget.classList.add('active');
    }
  }
}
