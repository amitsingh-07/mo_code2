import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IResultItem } from '../insurance-result/insurance-result';
import { IExistingCoverage } from './existing-coverage.interface';

@Component({
  selector: 'app-existing-coverage-modal',
  templateUrl: './existing-coverage-modal.component.html',
  styleUrls: ['./existing-coverage-modal.component.scss']
})
export class ExistingCoverageModalComponent implements OnInit {

  @Input() data: any;
  @Output() dataOutput: EventEmitter<any> = new EventEmitter();
  model = {} as IExistingCoverage;
  ADD_EXISTING_COVERAGES = {
    TITLE: 'Add Existing Coverages',
    LIFE_PROTECTION: 'life protection',
    CRITICAL_ILLNESS: 'Critical Illness',
    OCCUPATION_DISABILITY: 'Occupational Disability',
    LONG_TERM_CARE: 'Long-TermCare',
    HOSPITAL_PLAN: 'Hospital Plan'
  };

  isLifeProtection = false;
  isCriticalIllness = false;
  isOccupationalDisability = false;
  isLongTermCare = false;
  isHospitalPlan = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.data.forEach((protectionNeed: IResultItem) => {
      switch (protectionNeed.id) {
        case 1:
          this.isLifeProtection = true;
          this.model.lifeProtection = protectionNeed.existingCoverage.value;
          break;
        case 2:
          this.isCriticalIllness = true;
          this.model.criticalIllness = protectionNeed.existingCoverage.value;
          break;
        case 3:
          this.isOccupationalDisability = true;
          this.model.occupationalDisability = protectionNeed.existingCoverage.value;
          break;
        case 4:
          this.isHospitalPlan = true;
          this.model.hospitalPlan = protectionNeed.existingCoverage.value;
          break;
        case 5:
          this.isLongTermCare = true;
          this.model.longTermCare = protectionNeed.existingCoverage.value;
          break;
      }
    });
  }
  save() {
    //this.model.addedExistingCoverage = true;
    this.dataOutput.emit(this.model);
    this.activeModal.close();
  }

}
