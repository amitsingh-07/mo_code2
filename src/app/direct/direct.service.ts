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
  private searchBtn = new BehaviorSubject('');
  private modalToolTip = new BehaviorSubject(this.tooltipData);

  modalFreezeCheck = this.modalFreeze.asObservable();
  prodCategoryIndex = this.prodCategory.asObservable();
  searchBtnTrigger = this.searchBtn.asObservable();
  modalToolTipTrigger = this.modalToolTip.asObservable();

  constructor() {
  }

  setModalFreeze(isFrozen: boolean) {
    this.modalFreeze.next(isFrozen);
    }

  setProdCategoryIndex(prodCategoryIndex: number) {
    this.prodCategory.next(prodCategoryIndex);
  }

  triggerSearch(event) {
    this.searchBtn.next(event);
  }

  getDirectFormData(): DirectFormData {
    return this.directFormData;
  }

  getProductCategory() {
    return this.directFormData.prodCategory;
  }

  setProductCategory(prodCat: string) {
    this.directFormData.prodCategory = prodCat;
    console.log(this.directFormData.prodCategory);
  }

  setLifeProtectionForm(form: any) {
    this.directFormData.gender = form.value.gender;
    this.directFormData.dob = form.value.dob;
    this.directFormData.smoker = form.value.smoker;
    this.directFormData.coverageAmt = form.value.coverageAmt;
  }

  showToolTipModal(in_title: string, in_message: string) {
    this.tooltipData.title = in_title;
    this.tooltipData.message = in_message;
    this.modalToolTip.next(this.tooltipData);
  }
}
