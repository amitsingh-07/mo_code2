import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomerReviewsComponent } from './customer-reviews/customer-reviews.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

const routes: Routes = [
  { path: '', component: AboutUsComponent},
  { path: 'customer-reviews', component: CustomerReviewsComponent}
  /*
  { path: 'subscribe', component: SubscribeComponent},
  { path: 'contact-us', component: ContactUsComponent}
  */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutUsRoutingModule { }
