import { Injectable } from '@angular/core';

import { ApiService } from './../shared/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionApiService {
  constructor(private apiService: ApiService) { }

  getPromoList() {
    return this.apiService.getPromoList();
  }

  getPromoCategory() {
    return this.apiService.getPromoCategory();
  }

  getPromoDetail(id: number) {
    return this.apiService.getPromoDetail(id);
  }

  getPromoContent(id: number) {
    return this.apiService.getPromoContent(id);
  }

  getPromoTnc(id: number) {
    return this.apiService.getPromoTnc(id);
  }
}
