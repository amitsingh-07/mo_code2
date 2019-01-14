import { Injectable } from '@angular/core';

import { IPromoCategory } from './promotion-landing/promo-category.interface';
import { IPromotion } from './promotion.interface';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  processPromoList(promotions, categoryList): any[] {
    const currCategoryList = [];
    const promotionArray = [] as IPromoCategory[];
    promotions.forEach((element) => {
      let newCategory = true;
      let catIndex: number;
      currCategoryList.forEach((category, index) => {
        if (element.type === category) {
          catIndex = index;
          newCategory = false;
          return;
        }
      });
      if (newCategory) {
        const promoType = {} as IPromoCategory;
        categoryList.forEach((cat) => {
          if (cat.id === element.type) {
            promoType.title = cat.type;
            promoType.subTitle = cat.desc;
            promoType.promotions = [this.createPromotion(element)];
            currCategoryList.push(cat.id);
            return;
            }
          });
        promotionArray.push(promoType);
        } else {
          promotionArray[catIndex].promotions.push(this.createPromotion(element));
        }
    });
    return promotionArray;
  }

  createPromotion(in_promotion): IPromotion {
    const promotion = {
      promoId: in_promotion.promoId,
      owner: in_promotion.owner,
      title: in_promotion.title,
      img: in_promotion.img,
      desc: in_promotion.desc,
      date_created: in_promotion.date_created,
      date_expiry: in_promotion.date_expiry,
      tag: in_promotion.tags,
      external: in_promotion.external
    } as IPromotion;
    if (in_promotion.url) {
      promotion.url = in_promotion.url;
    }
    return promotion;
  }
}
