import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from './../article.service';

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
  public category_id: number;
  constructor(public navbarService: NavbarService, public footerService: FooterService,
              private articleService: ArticleService,
              private config: NgbDropdownConfig, private route: ActivatedRoute) {
              }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['name']) {
        this.getCategoryArticles(params['name']);
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.getCategoryArticles(params['category']);
      }
    });

    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.footerService.setFooterVisibility(true);
  }

  getCategoryArticles(category_name: string) {
    this.category_id = +(this.articleService.getArticleId(category_name));
    this.category = this.articleService.getArticleTagName(this.category_id).tag_name;
  }
}
