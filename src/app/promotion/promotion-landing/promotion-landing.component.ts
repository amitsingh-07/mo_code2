import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PromotionService } from '../promotion.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { IPromotion } from './promotion-landing.interface';

@Component({
  selector: 'app-promotion-landing',
  templateUrl: './promotion-landing.component.html',
  styleUrls: ['./promotion-landing.component.scss']
})
export class PromotionLandingComponent implements OnInit {
  //   promotionList: IPromotion[];

  insurancePromotionList = new Array();
  willsPromotionList = new Array();

  constructor(
    public navbarService: NavbarService,
    public footerService: FooterService,
    private translate: TranslateService,
    private promotionService: PromotionService) { }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);

    const thisPromotion1 = {
      promoId: 1,
      imgSrc: 'test',
      title: '35% off Aviva IdealIncome',
      summary: 'Enjoy lifetime discount with Occupational Disability coverage!'
    };

    const thisPromotion2 = {
      promoId: 2,
      imgSrc: 'test',
      title: 'Save $100 on Aviva MyCare & MyCare Plus',
      summary: 'Get S$100 off your first year\'s premium with long-term care coverage!'
    };

    const thisPromotion3 = {
      promoId: 3,
      imgSrc: 'test',
      title: '5% off for coverage $1.1M & above',
      summary: 'Enjoy 5% lifetime discount on Aviva MyProtector Term Plan & attached riders!'
    };

    const thisPromotion4 = {
      promoId: 4,
      imgSrc: 'test',
      title: 'Additional goodies with Aviva plans',
      summary: 'Treat yourself with shopping vouchers, dining treats or hotel stays!'
    };

    const thisPromotion5 = {
      promoId: 5,
      imgSrc: 'test',
      title: 'Write your Will, for Free! (worth $150!)',
      summary: 'Subscribe to our mailing list & get a promo code to write for free! Limited offer.'
    };

    this.insurancePromotionList.push(thisPromotion1);
    this.insurancePromotionList.push(thisPromotion2);
    this.insurancePromotionList.push(thisPromotion3);
    this.insurancePromotionList.push(thisPromotion4);
    this.willsPromotionList.push(thisPromotion5);
  }

  goToPromotion(promoId: number) {
    console.log(promoId);
  }
}
