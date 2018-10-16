import { Injectable } from '@angular/core';

import { ApiService } from './../shared/http/api.service';
import { IArticleElement } from './articleElement.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleApiService {

  constructor(public apiService: ApiService) {}

  getGetStartedArticle() {
    return this.apiService.getGetStartedArticles();
  }

  getRecentArticle(param?: number) {
    let quantity = 0;
    if (param) {
      quantity = param;
    }
    const articleElementList =  this.apiService.getRecentArticles(quantity);

    return articleElementList;
  }

  getArticle(art_id: number) {
    return this.apiService.getArticle(art_id);
  }

  getArticleContent(art_id: number) {
    return this.apiService.getArticleContent(art_id);
  }

  getArticleCategory() {
    return this.apiService.getArticleCategory();
  }

  getArticleCategoryList(category_name: string) {
    return this.apiService.getArticleCategoryList(category_name);
  }

  getArticleTagMap() {
    return require('../../assets/articles/tag_map.json');
  }
}
