import { Component, OnInit } from '@angular/core';

import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-article-category',
  templateUrl: './article-category.component.html',
  styleUrls: ['./article-category.component.scss']
})
export class ArticleCategoryComponent implements OnInit {
  private category = 'Protection';

  constructor(public navbarService: NavbarService, public footerService: FooterService) {}

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.footerService.setFooterVisibility(true);
  }


}
