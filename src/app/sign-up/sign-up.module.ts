import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { InputFocusDirective } from '../shared/directives/input-focus.directive';
import { SecurePipe } from '../shared/Pipes/secure.pipe';
import { AccountCreatedComponent } from './account-created/account-created.component';
import { AuthGuardService } from './auth-guard.service';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import {
    ForgotPasswordResultComponent
} from './forgot-password-result/forgot-password-result.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';
import { PostLoginComponent } from './post-login/post-login.component';
import { PreLoginComponent } from './pre-login/pre-login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpAccessGuard } from './sign-up-access-guard';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/sign-up/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    SignUpRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AccountCreatedComponent,
    CreateAccountComponent,
    EmailVerificationComponent,
    VerifyMobileComponent,
    PasswordComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordResultComponent,
    ResetPasswordComponent,
    SuccessMessageComponent,
    DashboardComponent,
    PostLoginComponent,
    PreLoginComponent,
    InputFocusDirective,
    SecurePipe
  ],
  providers: [SignUpAccessGuard, AuthGuardService]
})
export class SignUpModule { }
