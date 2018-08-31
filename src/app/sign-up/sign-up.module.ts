import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

import { NumberOnlyDirective } from '../shared/directives/number-only.directive';
import { AccountCreatedComponent } from './account-created/account-created.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PasswordComponent } from './password/password.component';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';

@NgModule({
  imports: [
    CommonModule,
    SignUpRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    TranslateModule.forChild(SharedModule.getTranslateConfig('sign-up')),
  ],
  declarations: [
    AccountCreatedComponent,
    CreateAccountComponent,
    NumberOnlyDirective,
    EmailVerificationComponent,
    VerifyMobileComponent,
    PasswordComponent
  ]
})
export class SignUpModule { }
