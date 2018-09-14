import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { ArticleService } from './article.service';

@NgModule({
  imports: [
    CommonModule,
    ArticleRoutingModule
  ],
  declarations: [ArticleComponent, ArticleService]
})
export class ArticleModule { }
