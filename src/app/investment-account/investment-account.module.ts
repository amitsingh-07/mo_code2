import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { AccountSetupCompletedComponent } from './account-setup-completed/account-setup-completed.component';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { AdditionalDeclarationInfoComponent } from './additional-declaration-info/additional-declaration-info.component';
import { AdditionalDeclarationStep1Component } from './additional-declaration-step1/additional-declaration-step1.component';
import { AdditionalDeclarationSubmitComponent } from './additional-declaration-submit/additional-declaration-submit.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { FinanicalDetailsComponent } from './finanical-details/finanical-details.component';
import { InvestmentAccountRoutingModule } from './investment-account-routing.module';
import { PersonalDeclarationComponent } from './personal-declaration/personal-declaration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { SelectNationalityComponent } from './select-nationality/select-nationality.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
        { prefix: './assets/i18n/app/', suffix: '.json' },
        { prefix: './assets/i18n/investment-account/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule, InvestmentAccountRoutingModule, ReactiveFormsModule,
     NgbModule.forRoot(),
    NouisliderModule,
    FormsModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    PersonalInfoComponent,
    ResidentialAddressComponent,
    SelectNationalityComponent,
    EmploymentDetailsComponent,
    TaxInfoComponent,
    FinanicalDetailsComponent,
    UploadDocumentsComponent,
    PersonalDeclarationComponent,
    AcknowledgementComponent,
    AdditionalDeclarationInfoComponent,
    AdditionalDeclarationStep1Component,
    AccountSetupCompletedComponent,
    AdditionalDeclarationSubmitComponent
  ],
  providers: [CurrencyPipe]
})
export class InvestmentAccountModule { }
