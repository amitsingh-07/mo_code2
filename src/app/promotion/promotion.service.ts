import { Injectable } from '@angular/core';
import { IPromotion } from './promotion-landing/promotion-landing.interface';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotion(data): IPromotion[] {
    const promotionArray = [];
    data.forEach((promotion) => {
        promotionArray.push(this.createPromotion(promotion));
    });
    return promotionArray;
  }

  createPromotion(data): IPromotion {
    const thisPromotion = {
        promoId: 1,
        imgSrc: 'test',
        title: 'Title',
        message: 'message'
    };
    return thisPromotion;
  }
}
