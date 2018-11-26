import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute  , Router } from '@angular/router';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

import { ArticleApiService } from '../article.api.service';
import { ArticleService } from '../article.service';

import { IArticleElement } from './../articleElement.interface';
import { IArticleEntry } from './articleEntry.interface';

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
  public date: Date;
  public category: string;
  public tags: string[];
  public author = 'default';

  public art_related: IArticleElement[];

  constructor(public navbarService: NavbarService, public footerService: FooterService, private route: ActivatedRoute,
              public articleApiService: ArticleApiService, public articleService: ArticleService) {}

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
      this.author = art_data.author;
      this.tags = art_data.tag;
      this.date = art_data.date;
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
