import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';

@NgModule({
  imports: [
    CommonModule, SignUpRoutingModule, ReactiveFormsModule, NgbModule.forRoot(),
    TranslateModule.forChild(SharedModule.getTranslateConfig('sign-up')),
  ],
  declarations: [CreateAccountComponent, VerifyMobileComponent]
})
export class SignUpModule { }
