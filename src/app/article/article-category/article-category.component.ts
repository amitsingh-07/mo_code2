import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService, IConfig } from 'src/app/config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SeoServiceService } from './../../shared/Services/seo-service.service';
import { ArticleApiService } from './../article.api.service';
import { ArticleService } from './../article.service';
import { IArticleElement } from './../articleElement.interface';
import { IArticleCategory } from './articleCategory.interface';

@Component({
  selector: 'app-article-category',
  templateUrl: './article-category.component.html',
  styleUrls: ['./article-category.component.scss'],
  providers: [NgbDropdownConfig]
})
export class ArticleCategoryComponent implements OnInit {
  public category = 'Protection';
  public category_id: number;
  public categoryList: IArticleCategory[];
  public articleListCategory: IArticleElement[];
  constructor(public navbarService: NavbarService, public footerService: FooterService, public translate: TranslateService,
              private articleService: ArticleService, private articleApiService: ArticleApiService, private seoService: SeoServiceService,
              private route: ActivatedRoute, private router: Router, private configService: ConfigService) {
                this.configService.getConfig().subscribe((config) => {
                  this.translate.setDefaultLang(config.language);
                  this.translate.use(config.language);
                });
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
    this.articleApiService.getArticleCategory().subscribe((catList) => {
      if (catList) {
        // Creating the first entry
        const tempCatList = this.articleService.getCategoryElementList(catList);

        this.articleApiService.getArticleCategoryList(-1).subscribe((data) => {
          const count_in = this.articleService.getArticleElementList(data).length;
          const allCategory = {
            name: 'All',
            count: count_in,
          } as IArticleCategory;
          tempCatList.unshift(allCategory);
        });
        this.categoryList = tempCatList;
      }
    });

    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(true);
  }

  getCategoryArticles(category_name: string) {
    window.scroll(0, 0);
    this.category_id = +(this.articleService.getArticleId(category_name));
    if (this.category_id > -1) {
      this.category = this.articleService.getArticleTagName(this.category_id).tag_name;
      this.requestArticleData();
      this.setSeoData();
    } else {
      if (this.category_id === -1) {
        this.category = 'All';
        this.requestArticleData();
        this.setSeoData();
      } else {
        // Redirect away
        this.router.navigate(['/articles/category/all']);
      }
    }
  }

  setSeoData() {
    this.translate.get('COMMON').subscribe((result) => {
      this.seoService.setTitle(this.translate.instant('COMMON.PRE_TITLE') + this.category);
    });
  }

  requestArticleData() {
    this.articleApiService.getArticleCategoryList(this.category_id).subscribe((data) => {
      this.articleListCategory = this.articleService.getArticleElementList(data);
    });
  }
}
