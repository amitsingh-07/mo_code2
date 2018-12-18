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

promotionList = new Array(); 

  constructor(
      public navbarService: NavbarService, 
      public footerService: FooterService, 
      private translate: TranslateService,
      private promotionService: PromotionService) {}

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);

    const thisPromotion = {
        promoId: 1,
        imgSrc: 'test',
        title: 'Title',
        message: 'message'
    };

    console.log('Pushing promotion ' + thisPromotion );
    this.promotionList.push(thisPromotion);

  }
}
