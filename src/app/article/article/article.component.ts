import { Component, OnInit } from '@angular/core';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ArticleApiService } from '../article.api.service';
import { ArticleService } from '../article.service';

import { IArticleElement } from '../articleElement.interface';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  getStartedArticleList: IArticleElement[];
  recentArticleList: IArticleElement[];

  constructor(public navbarService: NavbarService, public footerService: FooterService,
              private articleService: ArticleService, public articleApiService: ArticleApiService) {}

  ngOnInit() {
    this.articleApiService.getGetStartedArticle().subscribe((data) => {
      this.getStartedArticleList = this.articleService.getArticleElementList(data);
    });
    this.articleApiService.getRecentArticle(8).subscribe((data) => {
      this.recentArticleList = this.articleService.getArticleElementList(data);
    });
    this.footerService.setFooterVisibility(true);
  }
}
