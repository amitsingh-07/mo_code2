import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import { RecommendationsModalComponent } from './modal/recommendations-modal/recommendations-modal.component';
import { OrderByPipe } from './Pipes/order-by.pipe';
import { PlanFilterPipe } from './Pipes/plan-filter.pipe';
import { PlanDetailsWidgetComponent } from './widgets/plan-details-widget/plan-details-widget.component';
import { PlanWidgetComponent } from './widgets/plan-widget/plan-widget.component';
import { SettingsWidgetComponent } from './widgets/settings-widget/settings-widget.component';
import { PopupModalComponent } from './modal/popup-modal/popup-modal.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })],
  exports: [CurrencyInputDirective, PlanWidgetComponent, StepIndicatorComponent, SettingsWidgetComponent,
    PlanFilterPipe, OrderByPipe, ProductDetailComponent, PlanDetailsWidgetComponent],
  declarations: [CurrencyInputDirective, PlanWidgetComponent, StepIndicatorComponent, SettingsWidgetComponent, PlanFilterPipe,
    OrderByPipe, RecommendationsModalComponent, ProductDetailComponent, PlanDetailsWidgetComponent]
})
export class SharedModule { }
