import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToolTipModalComponent } from '../../shared/modal/tooltip-modal/tooltip-modal.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { DirectService } from './../../direct/direct.service';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-check-eligibility',
  templateUrl: './check-eligibility.component.html',
  styleUrls: ['./check-eligibility.component.scss']
})
export class CheckEligibilityComponent implements OnInit {
  formValues: any;
  eligibilityForm: FormGroup;
  religion = '';
  isAssets = false;
  isMuslim = false;
  religionList;
  constructor(private formBuilder: FormBuilder, private willWritingService: WillWritingService,
              private router: Router, private modal: NgbModal, private directService: DirectService,
              private translate: TranslateService) {
                this.translate.use('en');
                this.translate.get('COMMON').subscribe((result: string) => {
                  this.religionList = this.translate.instant('WILL_WRITING.ELIGIBILITY.RELIGION_LIST');
                });
  }

  ngOnInit() {
    this.formValues = this.willWritingService.getEligibilityDetails();

    this.eligibilityForm = this.formBuilder.group({
      singaporean: [this.formValues.singaporean, Validators.required],
      assets: [this.formValues.assets, Validators.required],
      religion : [this.formValues.religion, Validators.required]
    });
    if (this.formValues.religion !== undefined) {
      this.selectReligion(this.formValues.religion);
    }

  }

  selectReligion(selectedReligion) {
    this.religion = selectedReligion;
    this.eligibilityForm.controls['religion'].setValue(this.religion);
  }

  changeState(event) {
    console.log(event['target'].value);
  }

  save(form: any) {
    if (!form.valid) {
      return false;
    }
    this.willWritingService.setEligibilityDetails(form.value);
    return true;
  }

  openModal() {
    const ref = this.modal.open(ToolTipModalComponent, { centered: true });
    ref.componentInstance.tooltipTitle = 'Assets to be Distributed';
    ref.componentInstance.tooltipMessage = `

    Do note that only the following assets can be distributed via your will.

    - Bank Accounts (Non-joint)
    - Investments (Non-joint)
    - Insurance (Without nominations nor trusts)
    - Property (Tenancy-In-Common)

    To distribute your CPF, you should make a separate CPF nomination.`;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.TELL_US_ABOUT_YOURSELF]);
    }
  }

}
