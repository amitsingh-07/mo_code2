import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GuideMeService } from './../../guide-me.service';

@Component({
  selector: 'app-insurance-result-modal',
  templateUrl: './insurance-result-modal.component.html',
  styleUrls: ['./insurance-result-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceResultModalComponent implements OnInit {
  isMonthEnabled: boolean;
  @Input() data: string;
  isExistingCoverage: boolean;
  constructor(public activeModal: NgbActiveModal , public guideMeService: GuideMeService ) { }
  ngOnInit() {
    this.isExistingCoverage = this.guideMeService.isExistingCoverAdded;
    // Is Month Enabled
    if (this.data['title'] === 'Occupational Disability' || this.data['title'] === 'Long-Term Care') {
      this.isMonthEnabled = true;
    } else {
      this.isMonthEnabled = false;
    }
  }
}
