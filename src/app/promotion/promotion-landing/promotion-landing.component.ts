import { ConfigService } from './../../config/config.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { PromotionService } from '../promotion.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { PromotionApiService } from './../promotion.api.service';

import { SeoServiceService } from './../../shared/Services/seo-service.service';
import { IPromoCategory } from './promo-category.interface';

@Component({
  selector: 'app-promotion-landing',
  templateUrl: './promotion-landing.component.html',
  styleUrls: ['./promotion-landing.component.scss']
})
export class PromotionLandingComponent implements OnInit {
  public promoList: IPromoCategory[];
  public categoryList: string[];
  public mobileThreshold = 567;
  private categorySelect: number;
  public categorySelectTxt: string;

  constructor(
    public navbarService: NavbarService, private router: Router,
    public footerService: FooterService, private configService: ConfigService,
    private translate: TranslateService,
    private promotionService: PromotionService,
    private promotionApiService: PromotionApiService,
    private seoService: SeoServiceService) {
      this.selectCategory(0);
      this.configService.getConfig().subscribe((config) => {
        this.translate.setDefaultLang(config.language);
        this.translate.use(config.language);
      });
      this.translate.get('COMMON').subscribe((result: string) => {
        // Meta Tag and Title Methods
        this.seoService.setTitle(this.translate.instant('PROMO_LANDING.META.META_TITLE'));
        this.seoService.setBaseSocialMetaTags(this.translate.instant('PROMO_LANDING.META.META_TITLE'),
          this.translate.instant('PROMO_LANDING.META.META_DESCRIPTION'),
          this.translate.instant('PROMO_LANDING.META.META_KEYWORDS'));
      });
    }

  @HostListener('window:resize', [])
  checkResize() {
    if (window.innerWidth > this.mobileThreshold) {
      // Reset to show everything;
      this.selectCategory(0);
      }
    }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(false);
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);

    this.promotionApiService.getPromoList().subscribe((promotions) => {
      this.promotionApiService.getPromoCategory().subscribe((categories) => {
          this.promoList = this.promotionService.processPromoList(promotions, categories);
          // console.log(this.promoList);
          this.genCategoryList();
        });
    });
  }

  genCategoryList() {
    this.categoryList = [];
    this.categoryList.push('All');
    this.promoList.forEach((category) => {
      this.categoryList.push(category.title);
    });
  }
  getCategory(index) {
    if (this.categoryList) {
      this.categorySelectTxt = this.categoryList[index];
    } else {
      this.categorySelectTxt = 'All';
    }
  }

  selectCategory(index) {
    this.categorySelect = index;
    this.getCategory(this.categorySelect);
  }

  goToExternal(url) {
    window.open(url, '_blank');
  }
}
