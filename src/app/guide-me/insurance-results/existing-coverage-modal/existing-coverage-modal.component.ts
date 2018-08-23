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
  selectedHospitalPlan = 'Private Hospital';
  hospitalPlanList = ['Private Hospital', 'Government Hospital Ward A', 'Government Hospital Ward B1'
                  , 'Government Hospital Ward B2/C', 'Global Healthcare Coverage'];
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
          this.model.lifeProtectionCoverage = protectionNeed.existingCoverage.value;
          break;
        case 2:
          this.isCriticalIllness = true;
          this.model.criticalIllnessCoverage = protectionNeed.existingCoverage.value;
          break;
        case 3:
          this.isOccupationalDisability = true;
          this.model.occupationalDisabilityCoveragePerMonth = protectionNeed.existingCoverage.value;
          break;
        case 4:
          this.isHospitalPlan = true;
          // this.model.hospitalPlanCoverage = protectionNeed.existingCoverage.value;
          // Drop-down will be displayed for Hospitalization
          break;
        case 5:
          this.isLongTermCare = true;
          this.model.longTermCareCoveragePerMonth = protectionNeed.existingCoverage.value;
          break;
      }
    });
  }
  save() {
    this.dataOutput.emit(this.model);
    this.activeModal.close();
  }
  selectHospitalPlan(currentPlan) {
    this.selectedHospitalPlan = currentPlan;
  }

}
