import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { FaqComponent } from './faq/faq.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { WillWritingRoutingModule } from './will-writing-routing.module';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/will-writing/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    WillWritingRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    IntroductionComponent,
    FaqComponent
  ]
})
export class WillWritingModule { }
