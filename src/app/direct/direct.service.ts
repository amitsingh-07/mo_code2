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

  modalFreezeCheck = this.modalFreeze.asObservable();

  constructor() { }
  setModalFreeze(isFrozen: boolean) {
    this.modalFreeze.next(isFrozen);
    }
}
