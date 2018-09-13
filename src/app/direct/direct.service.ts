import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PercentageInputDirective } from './../shared/directives/percentage-input.directive';

import { DirectFormData } from './direct-form-data';
import { FormError } from './product-info/form-error';
import { ILongTermCare } from './product-info/long-term-care-form/long-term-care.interface';
import { IRetirementIncome } from './product-info/retirement-income-form/retirement-income.interface';

@Injectable({
  providedIn: 'root'
})

export class DirectService {
  searchStatus: boolean;

  tooltipData = {
    title: '',
    message: ''
  };

  private formError: any = new FormError();
  private directFormData:  DirectFormData = new DirectFormData();
  private modalFreeze = new BehaviorSubject(false);
  private prodCategory = new BehaviorSubject(0);
  private prodSearchInfo = new BehaviorSubject('');
  private searchBtn = new BehaviorSubject('');
  private modalToolTip = new BehaviorSubject(this.tooltipData);

  modalFreezeCheck = this.modalFreeze.asObservable();
  prodCategoryIndex = this.prodCategory.asObservable();
  prodSearchInfoData = this.prodSearchInfo.asObservable();
  searchBtnTrigger = this.searchBtn.asObservable();
  modalToolTipTrigger = this.modalToolTip.asObservable();

  constructor(private currencyPipe: CurrencyPipe) {
  }
  /* Setting Freeze for manual modal, Edit Profile */
  setModalFreeze(isFrozen: boolean) {
    this.modalFreeze.next(isFrozen);
    }
  /* Setting Initial Product Category based on selected index */
  setProdCategoryIndex(prodCategoryIndex: number) {
    this.prodCategory.next(prodCategoryIndex);
  }
  /* Search Button Trigger */
  triggerSearch(event) {
    this.searchBtn.next(event);
  }
  /* Get Direct Form Data */
  getDirectFormData(): DirectFormData {
    return this.directFormData;
  }

  /* Get Product Category List */
  getProductCategory() {
    return this.directFormData.prodCategory;
  }
  /* Product Category Dropdown Handler */
  setProductCategory(prodCat: string) {
    this.directFormData.prodCategory = prodCat;
    console.log(this.directFormData.prodCategory);
  }

  /* Handling Tooltip Modal */
  showToolTipModal(in_title: string, in_message: string) {
    this.tooltipData.title = in_title;
    this.tooltipData.message = in_message;
    this.modalToolTip.next(this.tooltipData);
  }

  /* Handling Minified Product Info */
  setMinProdInfo(prodString: string) {
    this.prodSearchInfo.next(prodString);
  }

  /* Setting Life Protection Form into Direct Form */
  setLifeProtectionForm(form: any) {
    this.directFormData.gender = form.value.gender;
    this.directFormData.dob = form.value.dob;
    this.directFormData.smoker = form.value.smoker;
    this.directFormData.coverageAmt = form.value.coverageAmt;
    this.directFormData.premiumWaiver = form.value.premiumWaiver;
  }

  /* Setting Critical Illness Form into Direct Form */
  setCriticalIllnessForm(form: any) {
    this.directFormData.gender = form.value.gender;
    this.directFormData.dob = form.value.dob;
    this.directFormData.smoker = form.value.smoker;
    this.directFormData.coverageAmt = form.value.coverageAmt;
    this.directFormData.earlyCI = form.value.earlyCI;
  }

  /* Custom Currency */
  convertToCurrency(in_amount: number) {
    const amount = this.currencyPipe.transform(in_amount, 'USD');
    const final_amount = amount.split('.')[0].replace('$', '');
    return final_amount;
  }

  currentFormError(form) {
    const invalid = [];
    const invalidFormat = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        invalidFormat.push(Object.keys(controls[name]['errors']));
      }
    }
    return this.getFormError(invalid[0], invalidFormat[0][0]);
  }

  getFormError(formCtrlName: string, validation: string): string {
    return this.formError.formFieldErrors[formCtrlName][validation];
  }

  setLongTermCareForm(data: ILongTermCare) {
    this.directFormData.longTermCare = data;
  }

  getLongTermCareForm(): ILongTermCare {
    if (!this.directFormData.longTermCare) {
      this.directFormData.longTermCare = {} as ILongTermCare;
    }
    return this.directFormData.longTermCare;
  }

  getRetirementIncomeForm(): IRetirementIncome {
    if (!this.directFormData.retirementIncome) {
      this.directFormData.retirementIncome = {} as IRetirementIncome;
    }
    return this.directFormData.retirementIncome;
  }

  setRetirementIncomeForm(data: IRetirementIncome) {
    this.directFormData.retirementIncome = data;
  }
}
