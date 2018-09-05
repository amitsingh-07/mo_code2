import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountCreatedComponent } from './account-created/account-created.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PasswordComponent } from './password/password.component';
import { SignUpAccessGuard } from './sign-up-access-guard';
import { SIGN_UP_ROUTES } from './sign-up.routes.constants';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';

const routes: Routes = [
  {
    path: SIGN_UP_ROUTES.ROOT,
    component: CreateAccountComponent
  },
  {
    path: SIGN_UP_ROUTES.CREATE_ACCOUNT,
    component: CreateAccountComponent
  },
  { path: SIGN_UP_ROUTES.VERIFY_MOBILE,
    component: VerifyMobileComponent,
    canActivate: [SignUpAccessGuard]
  },
  { path: SIGN_UP_ROUTES.PASSWORD,
    component: PasswordComponent,
    canActivate: [SignUpAccessGuard]
  },
  { path: SIGN_UP_ROUTES.ACCOUNT_CREATED,
    component: AccountCreatedComponent,
    canActivate: [SignUpAccessGuard]
  },
  { path: SIGN_UP_ROUTES.EMAIL_VERIFIED,
    component: EmailVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
