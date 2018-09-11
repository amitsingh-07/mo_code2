import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DirectFormData } from './direct-form-data';

@Injectable({
  providedIn: 'root'
})

export class DirectService {
  searchStatus: boolean;

  tooltipData = {
    title: '',
    message: ''
  };

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
  }

  /* Custom Currency */
  convertToCurrency(in_amount: number) {
    const amount = this.currencyPipe.transform(in_amount, 'USD');
    const final_amount = amount.split('.')[0].replace('$', '');
    return final_amount;
  }
}
