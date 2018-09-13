import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { AccountCreatedComponent } from './account-created/account-created.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';
import { SignUpAccessGuard } from './sign-up-access-guard';
import { SignUpRoutingModule } from './sign-up-routing.module';
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
    ForgotPasswordComponent
  ],
  providers: [SignUpAccessGuard]
})
export class SignUpModule { }
