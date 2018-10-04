import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomerReviewsComponent } from './customer-reviews/customer-reviews.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/guide-me/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, NgbModule.forRoot(),
    AboutUsRoutingModule
  ],
  declarations: [CustomerReviewsComponent, SubscribeComponent, ContactUsComponent]
})
export class AboutUsModule { }
