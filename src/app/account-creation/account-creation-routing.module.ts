import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../sign-up/auth-guard.service';
import {
    AccountCreationGuardService as AccountCreationGuard
} from './account-creation-guard.service';
import { ACCOUNT_CREATION_ROUTES } from './account-creation-routes.constants';
import { AccountStatusComponent } from './account-status/account-status.component';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import {
    AdditionalDeclarationInfoComponent
} from './additional-declaration-info/additional-declaration-info.component';
import {
    AdditionalDeclaration1Component
} from './additional-declaration1/additional-declaration1.component';
import {
    AdditionalDeclaration2Component
} from './additional-declaration2/additional-declaration2.component';
import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { FinancialDetailsComponent } from './financial-details/financial-details.component';
import { FundingIntroComponent } from './funding-intro/funding-intro.component';
import { NationalityComponent } from './nationality/nationality.component';
import {
    PersonalDeclarationComponent
} from './personal-declaration/personal-declaration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { StartComponent } from './start/start.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { UploadDocumentBOComponent } from './upload-document-bo/upload-document-bo.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

const routes: Routes = [
  {
    path: ACCOUNT_CREATION_ROUTES.ROOT,
    redirectTo: ACCOUNT_CREATION_ROUTES.START,
    pathMatch: 'full',
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.START,
    component: StartComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.SELECT_NATIONALITY,
    component: NationalityComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.PERSONAL_INFO,
    component: PersonalInfoComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.RESIDENTIAL_ADDRESS,
    component: ResidentialAddressComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.EMPLOYMENT_DETAILS,
    component: EmploymentDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ACCOUNT_CREATION_ROUTES.FINANICAL_DETAILS,
    component: FinancialDetailsComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.TAX_INFO,
    component: TaxInfoComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.UPLOAD_DOCUMENTS,
    component: UploadDocumentsComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.SETUP_PENDING,
    component: AccountStatusComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.PERSONAL_DECLARATION,
    component: PersonalDeclarationComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.ADDITIONAL_DECLARATION_SCREEN_2,
    component: AdditionalDeclaration2Component,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.CONFIRM_PORTFOLIO,
    component: ConfirmPortfolioComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.ACKNOWLEDGEMENT,
    component: AcknowledgementComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.ADDITIONALDECLARATION,
    component: AdditionalDeclarationInfoComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.ADDITIONALDECLARATION_STEP1,
    component: AdditionalDeclaration1Component,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.UPLOAD_DOCUMENTS_BO,
    component: UploadDocumentBOComponent,
    canActivate: []
  },
  {
    path: ACCOUNT_CREATION_ROUTES.FUND_INTRO,
    component: FundingIntroComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountCreationRoutingModule {}