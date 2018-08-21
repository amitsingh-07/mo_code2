import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-existing-coverage-modal',
  templateUrl: './existing-coverage-modal.component.html',
  styleUrls: ['./existing-coverage-modal.component.scss']
})
export class ExistingCoverageModalComponent implements OnInit {

  @Input() data: any;
  @Output() dataOutput: EventEmitter<any> = new EventEmitter();
  model = {
    //addedExistingCoverage : false
  };

  constructor(public activeModal: NgbActiveModal) { }
  ADD_EXISTING_COVERAGES = {
    "TITLE": "Add Existing Coverages",
    "LIFEPROTECTION": "life protection",
    "CRITICAL_ILLNESS": "Critical Illness",
    "OCCUPATION_DISABILITY": "Occupationa Disability",
    "LONG_TERMCARE": "Long-TermCare",
    "HOSPITAL_PLAN": "Hospital Plan"
  };
  ngOnInit() {

  }
  save() {
    //this.model.addedExistingCoverage = true;
    this.dataOutput.emit(this.model);
    this.activeModal.close();
  }

}
