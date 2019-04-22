import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { SignUpService } from '../sign-up/sign-up.service';
import {
    AccountCreationErrorModalComponent
} from './account-creation-error-modal/account-creation-error-modal.component';
import {
    AccountSetupPendingComponent
} from './account-setup-pending/account-setup-pending.component';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import {
    AdditionalDeclarationInfoComponent
} from './additional-declaration-info/additional-declaration-info.component';
import {
    AdditionalDeclarationScreen2Component
} from './additional-declaration-screen2/additional-declaration-screen2.component';
import {
    AdditionalDeclarationStep1Component
} from './additional-declaration-step1/additional-declaration-step1.component';
import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { FinanicalDetailsComponent } from './finanical-details/finanical-details.component';
import { FundingIntroComponent } from './funding-intro/funding-intro.component';
import { InvestmentAccountRoutingModule } from './investment-account-routing.module';
import {
    PersonalDeclarationComponent
} from './personal-declaration/personal-declaration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PostLoginComponent } from './post-login/post-login.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { SelectNationalityComponent } from './select-nationality/select-nationality.component';
import { SingPassComponent } from './sing-pass/sing-pass.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { UploadDocumentBOComponent } from './upload-document-bo/upload-document-bo.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/app/', suffix: '.json' },
    { prefix: './assets/i18n/investment-account/', suffix: '.json' }
  ]);
}

@NgModule({
  imports: [
    CommonModule,
    InvestmentAccountRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NouisliderModule,
    SharedModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    RouterModule
  ],
  declarations: [
    SingPassComponent,
    PostLoginComponent,
    PersonalInfoComponent,
    ResidentialAddressComponent,
    SelectNationalityComponent,
    EmploymentDetailsComponent,
    TaxInfoComponent,
    FinanicalDetailsComponent,
    UploadDocumentsComponent,
    PersonalDeclarationComponent,
    AdditionalDeclarationScreen2Component,
    ConfirmPortfolioComponent,
    AcknowledgementComponent,
    AdditionalDeclarationInfoComponent,
    AdditionalDeclarationStep1Component,
    AccountSetupPendingComponent,
    UploadDocumentBOComponent,
    AccountCreationErrorModalComponent,
    FundingIntroComponent
  ],
  entryComponents: [AccountCreationErrorModalComponent],
  providers: [CurrencyPipe]
})
export class InvestmentAccountModule {

  constructor() {
  }
}
