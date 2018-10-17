import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IGuardian } from '../will-writing-types';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-child-guardian',
  templateUrl: './my-child-guardian.component.html',
  styleUrls: ['./my-child-guardian.component.scss']
})
export class MyChildGuardianComponent implements OnInit {
  private pageTitle: string;
  private step: string;
  private tooltip = {};

  addGuardianForm: FormGroup;
  formValues: IGuardian;
  relationship = '';
  relationshipList;
  submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private router: Router,
    private translate: TranslateService,
    private willWritingService: WillWritingService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_1');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.TITLE');
      this.relationshipList = this.translate.instant('WILL_WRITING.COMMON.RELATIONSHIP_LIST');
      this.tooltip['title'] = this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.TOOLTIP_TITLE');
      this.tooltip['message'] = this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.TOOLTIP_MESSAGE');
    });
  }

  ngOnInit() {
    this.buildAddGuardianForm();
  }

  /**
   * build about me form.
   */
  buildAddGuardianForm() {
    this.formValues = this.willWritingService.getGuardianInfo();
    this.addGuardianForm = this.formBuilder.group({
      name: [this.formValues.name, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      nricNumber: [this.formValues.nricNumber, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      relationship: [this.formValues.relationship, [Validators.required]]
    });
    setTimeout(() => {
      if (this.formValues.relationship !== undefined) {
        const index = this.relationshipList.findIndex((status) => status.value === this.formValues.relationship);
        this.selectRelationship(this.relationshipList[index]);
      }
    }, 100);
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  save(form: any) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'addGuardianForm');
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.willWritingService.setGuardianInfo(form.value);
      return true;
    }
  }

  get addGud() { return this.addGuardianForm.controls; }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectRelationship(relationship) {
    relationship = relationship ? relationship : {text: '', value: ''};
    this.relationship = relationship.text;
    this.addGuardianForm.controls['relationship'].setValue(relationship.value);
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE]);
    }
  }
}
