import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ArticleApiService } from './../article.api.service';
import { ArticleService } from './../article.service';
import { IArticleElement } from './../articleElement.interface';

@Component({
  selector: 'app-article-category',
  templateUrl: './article-category.component.html',
  styleUrls: ['./article-category.component.scss'],
  providers: [NgbDropdownConfig]
})
export class ArticleCategoryComponent implements OnInit {
  public category = 'Protection';
  public category_id: number;
  public articleListCategory: IArticleElement[];
  constructor(public navbarService: NavbarService, public footerService: FooterService,
              private articleService: ArticleService, private articleApiService: ArticleApiService,
              private config: NgbDropdownConfig, private route: ActivatedRoute, private router: Router) {
              }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['name'] !== undefined) {
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
    if (this.category_id > -1) {
      this.category = this.articleService.getArticleTagName(this.category_id).tag_name;
    } else {
      if (this.category_id === -1) {
        this.category = 'All';
      } else {
        // Redirect away
        this.router.navigate(['/articles/category/all']);
      }
    }
    this.articleApiService.getArticleCategoryList(this.category).subscribe((data) => {
      this.articleListCategory = this.articleService.getArticleElementList(data);
    });
  }
}
