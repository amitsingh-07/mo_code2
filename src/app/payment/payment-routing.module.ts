import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { PaymentInstructionComponent } from './payment-instruction/payment-instruction.component';

const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment-status', component: PaymentStatusComponent },
  { path: 'payment-instruction', component: PaymentInstructionComponent },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
