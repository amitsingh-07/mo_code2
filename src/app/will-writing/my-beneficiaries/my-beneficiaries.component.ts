import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { IBeneficiary } from './../will-writing-types';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-my-beneficiaries',
  templateUrl: './my-beneficiaries.component.html',
  styleUrls: ['./my-beneficiaries.component.scss']
})
export class MyBeneficiariesComponent implements OnInit {
  private pageTitle: string;
  private step: string;
  private minErrorMsg: string;

  addBeneficiaryForm: FormGroup;
  beneficiaryList: IBeneficiary[] = [];
  relationshipList;
  relationship = '';
  submitted = false;
  isFormOpen = false;
  maxBeneficiary = WILL_WRITING_CONFIG.MAX_BENEFICIARY;

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private willWritingService: WillWritingService,
    private router: Router
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_2');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_BENEFICIARY.TITLE');
      this.relationshipList = this.translate.instant('WILL_WRITING.COMMON.RELATIONSHIP_LIST');
      this.minErrorMsg = this.translate.instant('WILL_WRITING.MY_BENEFICIARY.MIN_BENEFICIARY');
    });
  }

  ngOnInit() {
    if (this.willWritingService.getBeneficiaryInfo().length > 0) {
      this.beneficiaryList = this.willWritingService.getBeneficiaryInfo();
    } else {
      if (this.willWritingService.getSpouseInfo().length > 0) {
        const spouse: any = Object.assign({}, this.willWritingService.getSpouseInfo()[0]);
        spouse.selected = true;
        spouse.distPercentage = 0;
        this.beneficiaryList.push(spouse);
      }
      if (this.willWritingService.getChildrenInfo().length > 0) {
        const children: any = Object.assign({}, this.willWritingService.getChildrenInfo()[0]);
        children.selected = true;
        children.distPercentage = 0;
        this.beneficiaryList.push(children);
      }
    }
    this.buildBeneficiaryForm();
  }

  buildBeneficiaryForm() {
    this.addBeneficiaryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      nricNumber: ['', [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      relationship: ['', [Validators.required]]
    });
  }

  selectRelationship(relationship) {
    relationship = relationship ? relationship : { text: '', value: '' };
    this.relationship = relationship.text;
    this.addBeneficiaryForm.controls['relationship'].setValue(relationship.value);
  }

  addBeneficiary(form) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'addBeneficiaryForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, false);
    } else {
      form.value.selected = true;
      form.value.distPercentage = 0;
      this.beneficiaryList.push(form.value);
      this.resetForm();
    }
  }

  get addBen() { return this.addBeneficiaryForm.controls; }

  resetForm() {
    this.addBeneficiaryForm.reset();
    this.submitted = false;
    this.relationship = '';
    this.isFormOpen = false;
  }

  validateForm(index: number) {
    this.beneficiaryList[index].selected = !this.beneficiaryList[index].selected;
  }

  getSelectedBeneLength(): number {
    return this.beneficiaryList.filter((checked) => checked.selected === true).length;
  }

  save() {
    if (this.getSelectedBeneLength() <  WILL_WRITING_CONFIG.MIN_BENEFICIARY) {
      this.willWritingService.openToolTipModal(this.minErrorMsg, '');
      return false;
    } else {
      this.willWritingService.setBeneficiaryInfo(this.beneficiaryList);
      this.willWritingService.isBeneficiaryAdded = true;
      return true;
    }
  }

  goToNext() {
    if (this.save()) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_ESTATE_DISTRIBUTION]);
    }
  }

}
