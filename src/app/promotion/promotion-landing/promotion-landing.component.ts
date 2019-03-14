import { ConfigService } from './../../config/config.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { PromotionService } from '../promotion.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { PromotionApiService } from './../promotion.api.service';

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
    private promotionApiService: PromotionApiService) {
      this.selectCategory(0);
      this.configService.getConfig().subscribe((config) => {
        this.translate.setDefaultLang(config.language);
        this.translate.use(config.language);
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
          console.log(this.promoList);
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

  goToPromo(url) {
    const urlSplit = url.split('#');
    const newUrlSplit  = Object.assign([], urlSplit);
    newUrlSplit.shift();
    const base = urlSplit[0];
    const extra = {fragment: newUrlSplit[0]} as NavigationExtras;
    this.router.navigate([base], extra);
  }
}
