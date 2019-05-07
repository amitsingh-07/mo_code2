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
    const currDate = new Date();
    promotions.forEach((element) => {
      let newCategory = true;
      let catIndex: number;
      const start_date = element.date_created;
      const expiry_date = element.date_expiry;
      const today_date = currDate;
      if (expiry_date >= today_date && start_date <= today_date) {
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
        }
    });
    return promotionArray;
  }

  checkPromoIdList(promoList, promoId): boolean {
    let is_exist = false;
    promoId = +promoId;
    promoList.forEach((element) => {
      if (promoId === +element.promoId) {
        if (!element.external) {
          is_exist = true;
        }
        return;
      }
    });
    return is_exist;
  }

  createPromotion(in_promotion): IPromotion {
    const promotion = {
      promoId: in_promotion.promoId,
      owner: in_promotion.owner,
      title: in_promotion.title,
      thumbnail: in_promotion.thumbnail,
      desc: in_promotion.desc,
      date_created: in_promotion.date_created,
      date_expiry: in_promotion.date_expiry,
      tag: in_promotion.tags,
      external: in_promotion.external
    } as IPromotion;
    if (in_promotion.banner) {
      promotion.banner = in_promotion.banner;
    }
    if (in_promotion.url) {
      promotion.url = in_promotion.url;
    }
    if (in_promotion.button_label) {
      promotion.button_label = in_promotion.button_label;
    }
    if (!in_promotion.external) {
      promotion.logo = this.getPartnerLogo(in_promotion.owner);
    }
    return promotion;
  }

  getPartnerLogo(owner) {
    if (owner) {
      let partner_name = owner.toLowerCase();
      partner_name = partner_name.replace(/ /g, '');
      const logo = '/assets/images/partners/logo-' + partner_name + '.png';
      return logo;
    } else {
      return '/assets/images/partners/logo-placeholder.png';
    }
  }
}
