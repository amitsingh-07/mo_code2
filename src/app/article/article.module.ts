import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ArticleCategoryComponent } from './article-category/article-category.component';
import { ArticleEntryComponent } from './article-entry/article-entry.component';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { ArticleService } from './article.service';

import { SubscribeSideComponent } from './../shared/components/subscribe-side/subscribe-side.component';

@NgModule({
  imports: [
    CommonModule,
    ArticleRoutingModule,
    NgbModule
  ],
  declarations: [ArticleComponent, ArticleCategoryComponent, ArticleEntryComponent, SubscribeSideComponent]
})
export class ArticleModule { }
