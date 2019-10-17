import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountCreatedComponent } from './account-created/account-created.component';
import { AccountUpdatedComponent } from './account-updated/account-updated.component';
import { AddUpdateBankComponent } from './add-update-bank/add-update-bank.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { LoggedUserService as LoggedUserGuard } from './auth-guard.service';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import {
    EditResidentialAddressComponent
} from './edit-residential-address/edit-residential-address.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import {
    ForgotPasswordResultComponent
} from './forgot-password-result/forgot-password-result.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PreLoginComponent } from './pre-login/pre-login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpAccessGuard } from './sign-up-access-guard';
import { SIGN_UP_ROUTES } from './sign-up.routes.constants';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { UpdateUserIdComponent } from './update-user-id/update-user-id.component';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';
import {
    ViewAllNotificationsComponent
} from './view-all-notifications/view-all-notifications.component';

const routes: Routes = [
  {
    path: SIGN_UP_ROUTES.ROOT,
    pathMatch: 'full',
    redirectTo: SIGN_UP_ROUTES.CREATE_ACCOUNT
  },
  {
    path: SIGN_UP_ROUTES.PRELOGIN,
    component: PreLoginComponent
  },
  {
    path: SIGN_UP_ROUTES.CREATE_ACCOUNT,
    component: CreateAccountComponent,
    canActivate: [LoggedUserGuard]
  },
  { path: SIGN_UP_ROUTES.VERIFY_MOBILE,
    component: VerifyMobileComponent,
    canActivate: [SignUpAccessGuard]
  },
  { path: SIGN_UP_ROUTES.ACCOUNT_CREATED,
    component: AccountCreatedComponent
  },
  { path: SIGN_UP_ROUTES.EMAIL_VERIFIED,
    component: EmailVerificationComponent
  },
  { path: SIGN_UP_ROUTES.LOGIN,
    component: LoginComponent,
    canActivate: [LoggedUserGuard]
  },
  { path: SIGN_UP_ROUTES.FORGOT_PASSWORD,
    component: ForgotPasswordComponent
  },
  { path: SIGN_UP_ROUTES.FORGOT_PASSWORD_RESULT,
    component: ForgotPasswordResultComponent
  },
  { path: SIGN_UP_ROUTES.RESET_PASSWORD,
    component: ResetPasswordComponent
  },
  { path: SIGN_UP_ROUTES.SUCCESS_MESSAGE,
    component: SuccessMessageComponent
  },
  { path: SIGN_UP_ROUTES.DASHBOARD,
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: SIGN_UP_ROUTES.PRELOGIN,
    component: PreLoginComponent,
    canActivate: [AuthGuard]
  },
  { path: SIGN_UP_ROUTES.EDIT_PROFILE,
    component: EditProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: SIGN_UP_ROUTES.EDIT_PASSWORD,
    component: EditPasswordComponent,
    canActivate: [AuthGuard]
  },
  { path: SIGN_UP_ROUTES.EDIT_RESIDENTIAL,
    component: EditResidentialAddressComponent,
    canActivate: [AuthGuard]
  },
  { path: SIGN_UP_ROUTES.UPDATE_USER_ID,
    component: UpdateUserIdComponent,
    canActivate: [AuthGuard]
  },
  { path: SIGN_UP_ROUTES.ACCOUNT_UPDATED,
    component: AccountUpdatedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: SIGN_UP_ROUTES.VIEW_ALL_NOTIFICATIONS,
    component: ViewAllNotificationsComponent,
    canActivate: [AuthGuard]
  },
  { path: SIGN_UP_ROUTES.UPDATE_BANK,
    component: AddUpdateBankComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
