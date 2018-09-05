import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './modal/loader/loader.component';
import { CustomCurrencyPipe } from './Pipes/custom-currency.pipe';
import { CustomTranslateLoader } from './translate/custom-translate-loader';
import { PlanDetailsWidgetComponent } from './widgets/plan-details-widget/plan-details-widget.component';
import { PlanWidgetComponent } from './widgets/plan-widget/plan-widget.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HeaderComponent, LoaderComponent, TranslateModule, CustomCurrencyPipe,
    PlanWidgetComponent, ProductDetailComponent, PlanDetailsWidgetComponent]
})
export class SharedModule {

  public static getTranslateConfig(moduleName: string) {
    return {
      loader: {
        provide: TranslateLoader,
        useFactory: (() => CustomTranslateLoader(moduleName)),
        deps: [HttpClient]
      },
      isolate: true
    };
  }
}
