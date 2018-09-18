import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';

import { AppModule } from '../app.module';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { CurrencyInputDirective } from './directives/currency-input.directive';

export function HttpLoaderFactory(http: HttpClient, moduleName: string) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/' + moduleName + '/', suffix: '.json' },
    ]);
}

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CurrencyInputDirective,
    StepIndicatorComponent
  ],
  declarations: [
    CurrencyInputDirective,
    StepIndicatorComponent
  ]
})
export class SharedModule { }
