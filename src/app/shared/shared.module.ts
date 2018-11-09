import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import {
    BreakdownAccordionComponent
} from '../shared/components/breakdown-accordion/breakdown-accordion.component';
import { BreakdownBarComponent } from '../shared/components/breakdown-bar/breakdown-bar.component';
import { PercentageInputDirective } from '../shared/directives/percentage-input.directive';
import { DisclosuresComponent } from './components/disclosures/disclosures.component';
import { FairDealingComponent } from './components/fair-dealing/fair-dealing.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { StepIndicatorComponent } from './components/step-indicator/step-indicator.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { TermsComponent } from './components/terms/terms.component';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import {
    ConfirmationModalComponent
} from './modal/confirmation-modal/confirmation-modal.component';
import {
    RecommendationsModalComponent
} from './modal/recommendations-modal/recommendations-modal.component';
import { OrderByPipe } from './Pipes/order-by.pipe';
import { PlanFilterPipe } from './Pipes/plan-filter.pipe';
import {
    PlanDetailsWidgetComponent
} from './widgets/plan-details-widget/plan-details-widget.component';
import { PlanWidgetComponent } from './widgets/plan-widget/plan-widget.component';
import { SettingsWidgetComponent } from './widgets/settings-widget/settings-widget.component';

import { WillDisclaimerComponent } from './components/will-disclaimer/will-disclaimer.component';

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
  exports: [CurrencyInputDirective, PercentageInputDirective, PlanWidgetComponent, StepIndicatorComponent, SettingsWidgetComponent,
    PlanFilterPipe, OrderByPipe, ProductDetailComponent, PlanDetailsWidgetComponent, LoaderComponent,
    BreakdownBarComponent, BreakdownAccordionComponent],
  declarations: [CurrencyInputDirective, PlanWidgetComponent, StepIndicatorComponent, SettingsWidgetComponent, PlanFilterPipe,
    OrderByPipe, RecommendationsModalComponent, ProductDetailComponent, PlanDetailsWidgetComponent,
    LoaderComponent, ConfirmationModalComponent,
    PrivacyPolicyComponent,
    FairDealingComponent,
    DisclosuresComponent,
    TermsComponent,
    WillDisclaimerComponent,
    TermsOfUseComponent,
    BreakdownBarComponent,
    BreakdownAccordionComponent,
    PercentageInputDirective]
})
export class SharedModule { }
