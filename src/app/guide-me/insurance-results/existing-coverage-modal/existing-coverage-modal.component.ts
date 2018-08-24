import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IResultItem } from '../insurance-result/insurance-result';

import { GuideMeService } from './../../guide-me.service';
import { IExistingCoverage } from './existing-coverage.interface';

@Component({
  selector: 'app-existing-coverage-modal',
  templateUrl: './existing-coverage-modal.component.html',
  styleUrls: ['./existing-coverage-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExistingCoverageModalComponent implements OnInit {

  existingCoverageValues: IExistingCoverage;
  @Input() data: any;
  @Output() dataOutput: EventEmitter<any> = new EventEmitter();
  existingCoverageForm: FormGroup;
  ADD_EXISTING_COVERAGES = {
    TITLE: 'Add Existing Coverages',
    LIFE_PROTECTION: 'Life protection',
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

  constructor(public activeModal: NgbActiveModal, private guideMeService: GuideMeService) { }

  ngOnInit() {
    this.existingCoverageValues = this.guideMeService.getExistingCoverageValues();
    this.selectedHospitalPlan = this.existingCoverageValues.selectedHospitalPlan;
    this.existingCoverageForm = new FormGroup({
      lifeProtectionCoverage: new FormControl(this.existingCoverageValues.lifeProtectionCoverage),
      criticalIllnessCoverage: new FormControl(this.existingCoverageValues.criticalIllnessCoverage),
      occupationalDisabilityCoveragePerMonth: new FormControl(this.existingCoverageValues.occupationalDisabilityCoveragePerMonth),
      longTermCareCoveragePerMonth: new FormControl(this.existingCoverageValues.longTermCareCoveragePerMonth),
      selectedHospitalPlan: new FormControl(this.existingCoverageValues.selectedHospitalPlan)
    });
    this.data.forEach((protectionNeed: IResultItem) => {
      switch (protectionNeed.id) {
        case 1:
          this.isLifeProtection = true;
          this.existingCoverageValues.lifeProtectionCoverage = protectionNeed.existingCoverage.value;
          break;
        case 2:
          this.isCriticalIllness = true;
          this.existingCoverageValues.criticalIllnessCoverage = protectionNeed.existingCoverage.value;
          break;
        case 3:
          this.isOccupationalDisability = true;
          this.existingCoverageValues.occupationalDisabilityCoveragePerMonth = protectionNeed.existingCoverage.value;
          break;
        case 4:
          this.isHospitalPlan = true;
          // this.model.hospitalPlanCoverage = protectionNeed.existingCoverage.value;
          // Drop-down will be displayed for Hospitalization
          break;
        case 5:
          this.isLongTermCare = true;
          this.existingCoverageValues.longTermCareCoveragePerMonth = protectionNeed.existingCoverage.value;
          break;
      }
    });
  }

  save() {
    this.guideMeService.isExistingCoverAdded = true;
    this.existingCoverageForm.controls.selectedHospitalPlan.setValue(this.selectedHospitalPlan);
    this.guideMeService.setExistingCoverageValues(this.existingCoverageForm.value);
    this.dataOutput.emit(this.existingCoverageForm.value);
    this.activeModal.close();
  }
  selectHospitalPlan(currentPlan) {
    this.selectedHospitalPlan = currentPlan;
  }

}
