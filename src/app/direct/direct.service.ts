import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DirectApiService } from './direct.api.service';
import { IProductCategory } from './product-info/product-category/product-category';

@Injectable({
  providedIn: 'root'
})
export class DirectService {
  searchStatus: boolean;
  private modalFreeze = new BehaviorSubject(false);
  private prodCategory = new BehaviorSubject(0);

  modalFreezeCheck = this.modalFreeze.asObservable();
  prodCategoryIndex = this.prodCategory.asObservable();

  constructor() { }
  setModalFreeze(isFrozen: boolean) {
    this.modalFreeze.next(isFrozen);
    }

  setProdCategoryIndex(prodCategoryIndex: number) {
    this.prodCategory.next(prodCategoryIndex);
  }
}
