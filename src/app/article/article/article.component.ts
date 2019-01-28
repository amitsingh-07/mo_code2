import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ArticleApiService } from '../article.api.service';
import { ArticleService } from '../article.service';
import { ConfigService, IConfig } from './../../config/config.service';
import { SeoServiceService } from './../../shared/Services/seo-service.service';

import { IArticleElement } from '../articleElement.interface';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  getStartedArticleList: IArticleElement[];
  recentArticleList: IArticleElement[];

  constructor(public navbarService: NavbarService, public footerService: FooterService, private seoService: SeoServiceService,
              private articleService: ArticleService, public articleApiService: ArticleApiService, private translate: TranslateService,
              private configService: ConfigService) {
                this.configService.getConfig().subscribe((config) => {
                  this.translate.setDefaultLang(config.language);
                  this.translate.use(config.language);
                });
              }
  ngOnInit() {
    this.translate.get('COMMON').subscribe((result) => {
      this.seoService.setTitle(this.translate.instant('COMMON.PRE_TITLE') + this.translate.instant('GENERAL_ARTICLES.TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('GENERAL_ARTICLES.TITLE'),
                                this.translate.instant('GENERAL_ARTICLES.META.META_DESCRIPTION'),
                                this.translate.instant('GENERAL_ARTICLES.META.META_KEYWORDS'),
                                );
    });
    this.articleApiService.getGetStartedArticle().subscribe((data) => {
      this.getStartedArticleList = this.articleService.getArticleElementList(data);
    });
    this.articleApiService.getRecentArticle(8).subscribe((data) => {
      this.recentArticleList = this.articleService.getArticleElementList(data);
    });
    this.footerService.setFooterVisibility(true);
  }
}
