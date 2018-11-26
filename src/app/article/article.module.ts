import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ArticleCategoryComponent } from './article-category/article-category.component';
import { ArticleEntryComponent } from './article-entry/article-entry.component';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article/article.component';

import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SubscribeSideComponent } from './../shared/components/subscribe-side/subscribe-side.component';
import { StringToLinkFormatPipe } from './../shared/Pipes/string-to-link.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/articles/', suffix: '.json' },
      { prefix: './assets/i18n/error/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    ArticleRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
   ],
  declarations: [ArticleComponent, ArticleCategoryComponent,
    ArticleEntryComponent, SubscribeSideComponent,
    StringToLinkFormatPipe]
})

export class ArticleModule { }
