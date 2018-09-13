import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountCreatedComponent } from './account-created/account-created.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';
import { SignUpAccessGuard } from './sign-up-access-guard';
import { SIGN_UP_ROUTES } from './sign-up.routes.constants';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { ForgotPasswordResultComponent } from './forgot-password-result/forgot-password-result.component';

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
  },
  { path: SIGN_UP_ROUTES.LOGIN,
    component: LoginComponent
  },
  { path: SIGN_UP_ROUTES.FORGOT_PASSWORD,
    component: ForgotPasswordComponent
  },
  { path: SIGN_UP_ROUTES.FORGOT_PASSWORD_RESULT,
    component: ForgotPasswordResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
