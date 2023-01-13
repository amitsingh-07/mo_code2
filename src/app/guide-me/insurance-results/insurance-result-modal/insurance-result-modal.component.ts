import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GUIDE_ME_CONSTANTS } from '../../guide-me.constants';
import { GuideMeService } from '../../guide-me.service';

@Component({
  selector: 'app-insurance-result-modal',
  templateUrl: './insurance-result-modal.component.html',
  styleUrls: ['./insurance-result-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceResultModalComponent implements OnInit {
  isMonthEnabled: boolean;
  finalTotal = 0;
  @Input() data: any;
  isExistingCoverage: boolean;
  constructor(public activeModal: NgbActiveModal, public guideMeService: GuideMeService) { }
  ngOnInit() {
    this.isExistingCoverage = this.guideMeService.isExistingCoverAdded;
    // Is Month Enabled
    if (this.data['title'] === GUIDE_ME_CONSTANTS.INSURANCE_PLANS.OCCUPATIONAL_DISABILITY || this.data['title'] === GUIDE_ME_CONSTANTS.INSURANCE_PLANS.LONG_TERM_CARE) {
      this.isMonthEnabled = true;
    } else {
      this.isMonthEnabled = false;
    }

    if (this.data.existingCoverage) {
      this.finalTotal = ((this.data.total.value - this.data.existingCoverage.value) > 0 ?
        (this.data.total.value - this.data.existingCoverage.value) : 0);
    } else {
      this.finalTotal = this.data.total.value > 0 ? this.data.total.value : 0;
    }
  }
}
