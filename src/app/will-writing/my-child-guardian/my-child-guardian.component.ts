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
  private isEdit: boolean;
  private selectedIndex: number;

  addGuardianForm: FormGroup;
  guardianList: IGuardian[] = [];
  relationship = '';
  relationshipList;
  submitted: boolean;

  hasSpouse: boolean;
  maxGuardian: number;

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
    this.hasSpouse = this.willWritingService.getAboutMeInfo().maritalStatus === 'married';
    if (this.willWritingService.getGuardianInfo().length > 0) {
      this.guardianList = this.willWritingService.getGuardianInfo();
    } else {
      if (this.hasSpouse) {
        const spouse: any = Object.assign({}, this.willWritingService.getSpouseInfo()[0]);
        spouse.isAlt = false;
        this.guardianList.push(spouse);
      }
    }
    this.maxGuardian = this.hasSpouse ? 2 : 1;
    this.buildAddGuardianForm();
  }

  get addGud() { return this.addGuardianForm.controls; }

  /**
   * build about me form.
   */
  buildAddGuardianForm() {
    this.addGuardianForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: ['', [Validators.required]],
      uin: ['', [Validators.required, Validators.pattern(RegexConstants.UIN)]]
    });
  }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectRelationship(relationship) {
    relationship = relationship ? relationship : { text: '', value: '' };
    this.relationship = relationship.text;
    this.addGuardianForm.controls['relationship'].setValue(relationship.value);
  }

  editGuardian(relation: string, index: number) {
    if (relation === 'spouse') {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_FAMILY]);
    } else {
      this.selectedIndex = index;
      this.isEdit = true;
      const guardian = this.guardianList[index];
      this.addGuardianForm.controls['name'].setValue(guardian.name);
      this.addGuardianForm.controls['uin'].setValue(guardian.uin);
      const beneRelationship = this.relationshipList.filter((relationship) => relationship.value === guardian.relationship);
      this.selectRelationship(beneRelationship[0]);
    }
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  save(form: any): boolean {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'guardBeneForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, false);
      return false;
    } else {
      if (!this.isEdit) {
        form.value.isAlt = this.hasSpouse ? true : false;
        this.guardianList.push(form.value);
      } else {
        this.guardianList[this.selectedIndex].name = form.value.name;
        this.guardianList[this.selectedIndex].relationship = form.value.relationship;
        this.guardianList[this.selectedIndex].uin = form.value.uin;
      }
      this.willWritingService.setGuardianInfo(this.guardianList);
      return true;
    }
  }

  resetForm() {
    this.addGuardianForm.reset();
    this.submitted = false;
    this.relationship = '';
    this.isEdit = false;
  }

  openToolTipModal() {
    const title = this.tooltip['title'];
    const message = this.tooltip['message'];
    this.willWritingService.openToolTipModal(title, message);
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if ((this.isEdit && this.save(form)) || (!this.isEdit && (this.guardianList.length === this.maxGuardian || this.save(form)))) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE]);
    }
  }
}
