import { Injectable } from '@angular/core';

import { ApiService } from './../shared/http/api.service';

declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class ArticleApiService {

  constructor(public apiService: ApiService) { }

  getGetStartedArticle() {
    return this.apiService.getGetStartedArticles();
  }

  getRecentArticle(param?: number) {
    let quantity = 0;
    if (param) {
      quantity = param;
    }
    const articleElementList = this.apiService.getRecentArticles(quantity);
    // console.log(articleElementList);
    return articleElementList;
  }

  getArticle(art_id: number) {
    return this.apiService.getArticleData(art_id);
  }

  getArticleContent(art_id: number) {
    return this.apiService.getArticleContent(art_id);
  }

  getRelatedArticle(tag_id: number) {
    return this.apiService.getRelatedArticle(tag_id);
  }

  getArticleCategory() {
    return this.apiService.getArticleCategory();
  }

  getArticleCategoryList(category_id: number) {
    return this.apiService.getArticleCategoryList(category_id);
  }

  getArticleTagMap() {
    return require('../../assets/articles/tag_map.json');
  }
}
