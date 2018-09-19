import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CurrencyInputDirective } from './directives/currency-input.directive';
import { PlanWidgetComponent } from './widgets/plan-widget/plan-widget.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })],
  exports: [CurrencyInputDirective, PlanWidgetComponent],
  declarations: [CurrencyInputDirective, PlanWidgetComponent]
})
export class SharedModule {}
