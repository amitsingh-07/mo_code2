import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateAccountComponent } from './create-account/create-account.component';
import { SIGN_UP_ROUTES } from './sign-up.routes.constants';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';

const routes: Routes = [
  { path: SIGN_UP_ROUTES.ROOT, component: CreateAccountComponent },
  { path: SIGN_UP_ROUTES.CREATE_ACCOUNT, component: CreateAccountComponent },
  { path: SIGN_UP_ROUTES.VERIFY_MOBILE, component: VerifyMobileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
