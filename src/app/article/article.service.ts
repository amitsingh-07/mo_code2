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
    data.forEach((articleElement) => {
      articleElementArray.push(this.createArticleElement(articleElement));
    });
    return articleElementArray;
  }

  createArticleElement(articleElement): IArticleElement {
    console.log(articleElement);
    const thisArticleElement = {
              id: articleElement.artId,
              art_title: articleElement.title,
              art_author: articleElement.profile.author,
              art_date: articleElement.date,
              art_tags: articleElement.articleTagMap
            } as IArticleElement;
    return thisArticleElement;
    }

}
