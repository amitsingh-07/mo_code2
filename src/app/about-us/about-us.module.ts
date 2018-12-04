import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomerReviewsComponent } from './customer-reviews/customer-reviews.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { WhyMoneyOwlComponent } from './why-money-owl/why-money-owl.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/about-us/', suffix: '.json' },
      { prefix: './assets/i18n/error/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, NgbModule.forRoot(),
    AboutUsRoutingModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [CustomerReviewsComponent, SubscribeComponent, ContactUsComponent, AboutUsComponent, WhyMoneyOwlComponent]
})
export class AboutUsModule { }
