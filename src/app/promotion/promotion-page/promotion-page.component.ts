import {
    ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '../../config/config.service';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PromotionApiService } from '../promotion.api.service';
import { IPromotion } from '../promotion.interface';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotion-page',
  templateUrl: './promotion-page.component.html',
  styleUrls: ['./promotion-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PromotionPageComponent implements OnInit {

  @ViewChild('banner') BannerElement: ElementRef;

  //   promotionList: IPromotion[];
  private promoId: number;
  public promoDetails = {} as IPromotion;
  public promoContent = '';
  public promoTnc = '';

  constructor(
    public navbarService: NavbarService, private router: Router, private route: ActivatedRoute,
    public footerService: FooterService, private renderer: Renderer2,
    private translate: TranslateService, private configService: ConfigService,
    private promotionService: PromotionService, private promotionApiService: PromotionApiService,
    private el: ElementRef,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.navbarService.setNavbarMobileVisibility(false);
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
    this.promotionApiService.getPromoList().subscribe((promoList) => {
      let is_exist: boolean;
      is_exist = this.promotionService.checkPromoIdList(promoList, this.promoId);
      if (is_exist) {
        this.promotionApiService.getPromoDetail(this.promoId).subscribe((details) => {
          this.promoDetails = this.promotionService.createPromotion(details);
          // Setting Banner background-image
          const banner = this.BannerElement.nativeElement.childNodes[0];
          if (this.promoDetails.banner) {
            this.renderer.setStyle(banner,
                                'background-image',
                                'url(' + this.promoDetails.banner + ')'
                                );
          } else {
            this.renderer.setStyle(banner,
                                'background-image',
                                'url(' + this.promoDetails.thumbnail + ')'
                                );
          }
          // Getting promo content
          this.promotionApiService.getPromoContent(this.promoId).subscribe((content) => {
            this.promoContent = content;
            this.addRedirectEvent();
          });
          // Getting promo tnc
          this.promotionApiService.getPromoTnc(this.promoId).subscribe((tnc) => {
            this.promoTnc = tnc;
          });
        });
      } else {
        this.router.navigate(['../promotions/']);
      }
    });
  }

  getPartnerLogo(partner: string) {
    return this.promotionService.getPartnerLogo(partner);
  }

  redirect() {
    this.router.navigate(['../promotions/16']);
  }

  addRedirectEvent() {    
    this.cdRef.detectChanges();    
    var el = this.el.nativeElement.querySelector('.text-underline');
    if(el) {
      el.addEventListener('click', this.redirect.bind(this));
    }    
  }
}
