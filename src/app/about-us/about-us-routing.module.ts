import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerReviewsComponent } from './customer-reviews/customer-reviews.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full'},
  { path: 'customer-reviews', component: CustomerReviewsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutUsRoutingModule { }
