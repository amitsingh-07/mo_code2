import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PromotionService } from '../promotion.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-promotion-page',
  templateUrl: './promotion-page.component.html',
  styleUrls: ['./promotion-page.component.scss']
})
export class PromotionPageComponent implements OnInit {
  //   promotionList: IPromotion[];

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

    
  }
}
