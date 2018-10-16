import { ArticleService } from './../article.service';
import { catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
              private articleService: ArticleService,
              private config: NgbDropdownConfig, private route: ActivatedRoute) {
              }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['name']) {
        this.category = params['name'];
        console.log(this.category);
        this.getCategoryArticles(this.category);
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.category = params['category'];
        this.getCategoryArticles(this.category);
      }
    });

    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(true);
    this.footerService.setFooterVisibility(true);
  }

  getCategoryArticles(category_name: string) {
    const category_id =  this.articleService.getArticleId(category_name);
    console.log(category_id);
  }
}
