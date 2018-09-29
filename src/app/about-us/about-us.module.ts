import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { CustomerReviewsComponent } from './customer-reviews/customer-reviews.component';

@NgModule({
  imports: [
    CommonModule,
    AboutUsRoutingModule
  ],
  declarations: [CustomerReviewsComponent]
})
export class AboutUsModule { }
