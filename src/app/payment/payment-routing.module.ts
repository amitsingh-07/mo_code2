import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';

const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment-status', component: PaymentStatusComponent },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
