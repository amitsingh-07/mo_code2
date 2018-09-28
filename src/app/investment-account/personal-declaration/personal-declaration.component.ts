import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';

@Component({
  selector: 'app-personal-declaration',
  templateUrl: './personal-declaration.component.html',
  styleUrls: ['./personal-declaration.component.scss']
})
export class PersonalDeclarationComponent implements OnInit {
  sourceOfIncomeList: any;
  nationality: any;
  source: any;
  translator: any;
  pageTitle: string;
  personalDeclarationForm: FormGroup;
  personalDeclarationFormValues: any;
  constructor(
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('PERSONAL_DECLARATION.TITLE');
      this.translator = this.translate.instant('PERSONAL_DECLARATION');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }
  selectSource(sourceObj) {
this.source = sourceObj.source;
this.personalDeclarationForm.controls['sourceOfIncome'].setValue(this.source);
  }
  getSourceList() {
    this.investmentAccountService.getSourceList().subscribe((data) => {
        this.sourceOfIncomeList = data.objectList;
        console.log(this.sourceOfIncomeList);
    });
  }
  ngOnInit() {
    this.source = 'Select' ;
    this.getSourceList();
    this.personalDeclarationFormValues = this.investmentAccountService.getPersonalDeclaration();
    this.personalDeclarationForm = new FormGroup({
      radioEmploye: new FormControl (this.personalDeclarationFormValues.ExistingEmploye),
      radioBeneficial: new FormControl (this.personalDeclarationFormValues.beneficial),
      radioPEP: new FormControl (this.personalDeclarationFormValues.pep),
      sourceOfIncome: new FormControl (this.personalDeclarationFormValues.sourceOfIncome, Validators.required)
      });
  }
  yesClick() {
  }
  noClick() {
  }
  showHelpModalPep() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.PEP;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription =  this.translator.PEP_DESC;
    return false;
  }
  // tslint:disable-next-line:no-identical-functions
  showHelpModalBeneficial() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.BENEFICIAL;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.translator.BENEFICIAL_DESC ;
    return false;
  }
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      console.log(error);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.investmentAccountService.setPersonalDeclarationData(form.value);
    }
  }
  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }
  disableButton() {
    // tslint:disable-next-line:max-line-length
    if ( this.personalDeclarationForm.controls.radioEmploye.value == null || this.personalDeclarationForm.controls.radioBeneficial.value == null || this.personalDeclarationForm.controls.radioPEP.value == null ) {
return true;
    }
  }
}
