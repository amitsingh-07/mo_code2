import { Injectable } from '@angular/core';

import { ArticleApiService } from './article.api.service';
import { IArticleElement } from './articleElement.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(public articleApiService: ArticleApiService) {}

  getArticleElementList(data): IArticleElement[] {
    const articleElementArray = [];
    console.log(data);
    data.forEach((articleElement) => {
      articleElementArray.push(this.createArticleElement(articleElement));
    });
    return articleElementArray;
  }

  createArticleElement(articleElement): IArticleElement {
    const thisArticleElement = {
              id: articleElement.id,
              art_title: articleElement.art_title,
              art_author: articleElement.art_author,
              art_date: articleElement.art_date,
              art_tags: articleElement.art_tags
            } as IArticleElement;
    return thisArticleElement;
    }

}
