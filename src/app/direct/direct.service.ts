import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DirectFormData } from './direct-form-data';
import { DirectApiService } from './direct.api.service';
import { IProductCategory } from './product-info/product-category/product-category';

@Injectable({
  providedIn: 'root'
})
export class DirectService {
  searchStatus: boolean;
  private directFormData:  DirectFormData = new DirectFormData();
  private modalFreeze = new BehaviorSubject(false);
  private prodCategory = new BehaviorSubject(0);
  private searchBtn = new BehaviorSubject('');

  modalFreezeCheck = this.modalFreeze.asObservable();
  prodCategoryIndex = this.prodCategory.asObservable();
  searchBtnTrigger = this.searchBtn.asObservable();

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
}
