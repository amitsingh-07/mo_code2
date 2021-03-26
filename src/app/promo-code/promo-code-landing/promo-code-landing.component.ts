import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-promo-code-landing',
  templateUrl: './promo-code-landing.component.html',
  styleUrls: ['./promo-code-landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PromoCodeLandingComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    public navbarService: NavbarService,
    private renderer: Renderer2) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.setNavbarServices(this.translate.instant('PROMO_CODE.TITLE'));
    });
    this.renderer.addClass(document.body, 'portfolioname-bg');
  }

  setNavbarServices(title: string) {
    this.navbarService.setPageTitle(title);
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(104);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'portfolioname-bg');
  }
}
