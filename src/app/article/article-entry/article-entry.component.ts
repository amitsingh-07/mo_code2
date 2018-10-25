import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute  , Router } from '@angular/router';

import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import { ArticleApiService } from './../article.api.service';
import { ArticleService } from './../article.service';

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
  public category: string;
  public tagId: number;
  private author: string;

  constructor(public navbarService: NavbarService, public footerService: FooterService, private route: ActivatedRoute,
              public articleApiService: ArticleApiService, public articleService: ArticleService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.art_id = params['id'];
        this.getArticleContent(this.art_id);
      }
    });
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
    this.articleApiService.getArticleContent(art_id).subscribe((data) => {
      this.art_content = data;
    });
  }

  getArticle(id: number) {
    const assetPath = '../../../assets/articles';
    const articlePath = assetPath + id + '.jsp';
    const thumbnailPath = assetPath + '/images/' + id + '/thumbnail.jpg';
  }

}
