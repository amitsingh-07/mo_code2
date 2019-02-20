import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute  , Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SeoServiceService } from './../../shared/Services/seo-service.service';

import { ArticleApiService } from '../article.api.service';
import { ArticleService } from '../article.service';

import { IArticleElement } from './../articleElement.interface';

@Component({
  selector: 'app-article-entry',
  templateUrl: './article-entry.component.html',
  styleUrls: ['./article-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleEntryComponent implements OnInit {
  private art_id: number;
  public art_content: any;
  public title: string;
  public summary: string;
  public keywords: string;
  public date: Date;
  public category: string;
  public tags: string[];
  public author = 'default';

  public art_related: IArticleElement[];

  constructor(public navbarService: NavbarService, public footerService: FooterService,
              private route: ActivatedRoute, private seoService: SeoServiceService, public datePipe: DatePipe,
              public articleApiService: ArticleApiService, public articleService: ArticleService,
              private translate: TranslateService) {
                this.translate.use('en');
                this.translate.get('COMMON').subscribe((result) => {
                });
              }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.art_id = params['id'];
        this.getArticleContent(this.art_id);
      }
    });

    // tslint:disable-next-line:no-identical-functions
    this.route.queryParams.subscribe((params) => {
      if (params['art_id']) {
        this.art_id = params['art_id'];
        this.getArticleContent(this.art_id);
      }
    });
    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);
  }

  getArticleContent(art_id: number) {
    // Getting Article Details
    window.scroll(0, 0);
    this.articleApiService.getArticle(art_id).subscribe((data) => {
      const art_data = this.articleService.getArticleEntry(data);
      this.getRelatedArticles(art_data.art_pri_tag);
      this.category = this.articleService.getArticleTagName(art_data.art_pri_tag).tag_name;
      this.title = art_data.title;
      this.summary = art_data.summary;
      this.keywords = art_data.keywords;
      this.author = art_data.author;
      this.tags = art_data.tag;
      this.date = art_data.date;
      const date_string = this.datePipe.transform(this.date, 'dd/MMM/YYYY');
      this.seoService.setTitle(this.translate.instant('COMMON.PRE_TITLE') + this.title);
      this.seoService.setArticlesMetaTags(this.translate.instant('COMMON.PRE_TITLE') + this.title,
                                          this.summary,
                                          'https://www.moneyowl.com.sg/assets/articles/images/' + this.art_id + '/thumbnail.jpg',
                                          this.keywords,
                                          this.author,
                                          date_string,
                                          this.category
      );
    });
    //  Getting Article Content
    this.articleApiService.getArticleContent(art_id).subscribe((data) => {
      this.art_content = data;
    });
  }

  getArticle(id: number) {
    const assetPath = '/assets/articles';
    const articlePath = assetPath + id + '.jsp';
    const thumbnailPath = assetPath + '/images/' + id + '/thumbnail.jpg';
  }

  getRelatedArticles(tag_id: number) {
    this.articleApiService.getRelatedArticle(tag_id).subscribe((data) => {
      this.art_related = this.articleService.getArticleElementList(data);
    });
  }

}
