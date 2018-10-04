import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute  , Router } from '@angular/router';

import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

import { ArticleApiService } from './../article.api.service';

@Component({
  selector: 'app-article-entry',
  templateUrl: './article-entry.component.html',
  styleUrls: ['./article-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleEntryComponent implements OnInit {
  private art_id: number;
  private art_content: any;
  private title: string;
  private category: string;
  private author: string;

  constructor(public navbarService: NavbarService, public footerService: FooterService, private route: ActivatedRoute,
              public articleApiService: ArticleApiService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.art_id = params['id'];
        console.log(this.art_id);
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params['art_id']) {
        this.art_id = params['art_id'];
        console.log(this.art_id);
      }
    });

    this.articleApiService.getArticleContent(this.art_id).subscribe((data) => {
      this.art_content = data;
      this.title = 'Understanding MediShield Life & What should you do (Part 1: MediShield Life in a Nutshell)';
      this.category = 'Protection';
      this.author = 'Shawn Lee';
    });

    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);
  }

  getArticle(id: number) {
    const assetPath = '../../../assets/articles';
    const articlePath = assetPath + id + '.jsp';
    const thumbnailPath = assetPath + '/images/' + id + '/thumbnail.jpg';
  }

}
