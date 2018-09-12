import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SharedModule } from './../shared/shared.module';

import { DirectResultsComponent } from './direct-results/direct-results.component';
import { DirectRoutingModule } from './direct-routing.module';
import { DirectComponent } from './direct.component';
import { ProductCategoryComponent } from './product-info/product-category/product-category.component';
import { ProductInfoComponent } from './product-info/product-info.component';

import { CriticalIllnessFormComponent } from './product-info/critical-illness-form/critical-illness-form.component';
import { LifeProtectionFormComponent } from './product-info/life-protection-form/life-protection-form.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
        { prefix: './assets/i18n/app/', suffix: '.json' },
        { prefix: './assets/i18n/direct/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    DirectRoutingModule, NgbModule.forRoot()
  ],
  declarations: [
    DirectResultsComponent, DirectComponent,
    ProductInfoComponent, ProductCategoryComponent,
    LifeProtectionFormComponent, CriticalIllnessFormComponent]
})
export class DirectModule { }
