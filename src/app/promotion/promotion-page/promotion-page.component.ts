import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { PromotionService } from '../promotion.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import { IPromotion } from '../promotion.interface';
import { PromotionApiService } from './../promotion.api.service';

@Component({
  selector: 'app-promotion-page',
  templateUrl: './promotion-page.component.html',
  styleUrls: ['./promotion-page.component.scss']
})

export class PromotionPageComponent implements OnInit {

  @ViewChild('banner') BannerElement: ElementRef;

  //   promotionList: IPromotion[];
  private promoId: number;
  private promoDetails = {} as IPromotion;
  private promoContent = '';
  private promoTnc = '';

  constructor(
    public navbarService: NavbarService, private route: ActivatedRoute,
    public footerService: FooterService, private renderer: Renderer2,
    private translate: TranslateService,
    private promotionService: PromotionService, private promotionApiService: PromotionApiService) { }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.promoId = params['id'];
        this.getPromoDetails();
      }
    });
  }

  getPromoDetails() {
    window.scroll(0, 0);
    this.promotionApiService.getPromoDetail(this.promoId).subscribe((details) => {
      this.promoDetails = this.promotionService.createPromotion(details);

      // Setting Banner background-image
      const banner = this.BannerElement.nativeElement.childNodes[0];
      this.renderer.setStyle(banner,
                            'background-image',
                            'url(' + this.promoDetails.banner + ')'
                            );
      // Getting promo content
      this.promotionApiService.getPromoContent(this.promoId).subscribe((content) => {
        this.promoContent = content;
      });
      // Getting promo tnc
      this.promotionApiService.getPromoTnc(this.promoId).subscribe((tnc) => {
        this.promoTnc = tnc;
      });
    });
  }

  getPartnerLogo(partner: string) {
    return this.promotionService.getPartnerLogo(partner);
  }
}
