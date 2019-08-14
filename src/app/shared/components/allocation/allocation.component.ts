import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
    FundDetailsComponent
} from '../../../investment/engagement-journey/fund-details/fund-details.component';
import { EngagementJourneyService } from '../../../investment/engagement-journey/engagement-journey.service';

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
    private engagementJourneyService: EngagementJourneyService,
    private router: Router,
    public modal: NgbModal
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    this.assets.forEach((allocation) => {
      const groupedAllocation = this.groupByProperty(allocation.groupedAllocationDetails);
      this.engagementJourneyService.sortByProperty(groupedAllocation, 'name', 'asc');
      allocation.groupedAllocationDetails = groupedAllocation;
    });
  }

  groupByProperty(targetObj) {
    const assetKeys = Object.keys(targetObj);
    const groupObjects = [];
    for (const prop of assetKeys) {
      this.engagementJourneyService.sortByProperty(targetObj[prop], 'percentage', 'desc');
      const classObj = {
        name: prop,
        value: targetObj[prop]
      };
      groupObjects.push(classObj);
    }
    return groupObjects;
  }

  showFundDetails() {
    this.engagementJourneyService.setFundDetails(this.funds);
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
