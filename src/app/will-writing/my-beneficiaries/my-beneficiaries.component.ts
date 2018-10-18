import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IBeneficiary, IMyFamily } from './../will-writing-types';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-my-beneficiaries',
  templateUrl: './my-beneficiaries.component.html',
  styleUrls: ['./my-beneficiaries.component.scss']
})
export class MyBeneficiariesComponent implements OnInit {
  private pageTitle: string;
  private step: string;

  addBeneficiaryForm: FormGroup;
  relationshipList;
  relationship = '';
  submitted = false;
  myFamily: IMyFamily;
  isFormOpen = false;
  beneficiaryList: IBeneficiary[] = [];
  isButtonEnabled = true;

  constructor(private translate: TranslateService, private formBuilder: FormBuilder,
              private navbarService: NavbarService, private willWritingService: WillWritingService,
              private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_2');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_BENEFICIARY.TITLE');
      this.relationshipList = this.translate.instant('WILL_WRITING.COMMON.RELATIONSHIP_LIST');
    });
   }

  ngOnInit() {
    if (this.willWritingService.getBeneficiaryInfo().length > 0) {
      this.beneficiaryList = this.willWritingService.getBeneficiaryInfo();
    } else {
      if (this.willWritingService.getSpouseInfo().length > 0) {
        const spouse: any = Object.assign({}, this.willWritingService.getSpouseInfo()[0]);
        spouse.selected = true;
        this.beneficiaryList.push(spouse);
      }
      if (this.willWritingService.getChildrenInfo().length > 0) {
        const children: any = Object.assign({}, this.willWritingService.getChildrenInfo()[0]);
        children.selected = true;
        this.beneficiaryList.push(children);
      }
    }
    this.addBeneficiaryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      nricNumber: ['', [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      relationship: ['', [Validators.required]]
    });
  }

  selectRelationship(relationship) {
    relationship = relationship ? relationship : {text: '', value: ''};
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
      this.beneficiaryList.push(form.value);
      this.resetForm();
    }
  }

  get addGud() { return this.addBeneficiaryForm.controls; }

  cancelForm(form) {
    this.resetForm();
  }

  resetForm() {
    this.addBeneficiaryForm.reset();
    this.submitted = false;
    this.relationship = '';
    this.isFormOpen = false;
  }

  validateForm(index: number) {
    if (this.beneficiaryList[index].selected === true) {
      this.beneficiaryList[index].selected = false;
    } else {
      this.beneficiaryList[index].selected = true;
    }
  }

  getBeneficiaryLength(): number {
    return this.beneficiaryList.filter((checked) => checked.selected === true).length;
  }

  save() {
    const beneficiaryLength = this.getBeneficiaryLength();
    if ( beneficiaryLength === 0 || beneficiaryLength > 7) {
      return false;
    } else {
      this.willWritingService.setBeneficiaryInfo(this.beneficiaryList);
      return true;
    }
  }

  goToNext() {
    if (this.save()) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_ESTATE_DISTRIBUTION]);
    }
  }

}
