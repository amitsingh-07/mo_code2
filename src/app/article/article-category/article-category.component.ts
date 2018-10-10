import { Component, OnInit } from '@angular/core';

import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-article-category',
  templateUrl: './article-category.component.html',
  styleUrls: ['./article-category.component.scss'],
  providers: [NgbDropdownConfig]
})
export class ArticleCategoryComponent implements OnInit {
  public category = 'Protection';

  constructor(public navbarService: NavbarService, public footerService: FooterService,
              private config: NgbDropdownConfig) {
              }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.footerService.setFooterVisibility(true);
  }
}
